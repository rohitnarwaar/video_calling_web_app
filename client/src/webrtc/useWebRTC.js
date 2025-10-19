import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// >>> set this to your deployed signaling server URL later
const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || 'http://localhost:5000';

const iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];

export default function useWebRTC({ name = 'Guest' }) {
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcMapRef = useRef(new Map()); // peerId -> RTCPeerConnection
  const [peers, setPeers] = useState([]); // [{id, stream}]
  const [messages, setMessages] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenTrackRef = useRef(null);

  const addPeerStream = (id, stream) => {
    setPeers(prev => {
      const exists = prev.some(p => p.id === id);
      if (exists) return prev.map(p => p.id === id ? { ...p, stream } : p);
      return [...prev, { id, stream }];
    });
  };
  const removePeer = (id) => {
    setPeers(prev => prev.filter(p => p.id !== id));
    const pc = pcMapRef.current.get(id);
    if (pc) pc.close();
    pcMapRef.current.delete(id);
  };

  // init socket + local media once
  useEffect(() => {
    socketRef.current = io(SIGNALING_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to signaling server', SIGNALING_URL, socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });


    const setupMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;

      // show local video immediately
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true; // avoid echo
      video.playsInline = true;
      video.style.width = '240px';
      video.style.borderRadius = '8px';
      video.style.margin = '8px';
      video.id = 'localVideo';
      document.getElementById('video-grid')?.prepend(video);
      console.log('🎥 Local stream ready');

    };
    setupMedia();

    const s = socketRef.current;

    s.on('participants', (peers) => peers.forEach(p => createOfferFor(p.socketId)));
    s.on('user-joined', ({ socketId }) => {
      console.log('New user joined:', socketId);
    });
    s.on('offer', async ({ from, sdp }) => {
      const pc = getOrCreatePC(from);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit('answer', { to: from, sdp: pc.localDescription });
    });

    s.on('answer', async ({ from, sdp }) => {
      const pc = pcMapRef.current.get(from);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    s.on('ice-candidate', ({ from, candidate }) => {
      const pc = pcMapRef.current.get(from);
      if (pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    s.on('chat-message', (msg) => setMessages(prev => [...prev, msg]));
    s.on('user-left', ({ socketId }) => removePeer(socketId));

    return () => {
      s.disconnect();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      pcMapRef.current.forEach(pc => pc.close());
      pcMapRef.current.clear();
    };
  }, []);

  const getOrCreatePC = (peerId) => {
    if (pcMapRef.current.has(peerId)) return pcMapRef.current.get(peerId);
    const pc = new RTCPeerConnection({ iceServers });


    // push local tracks
    localStreamRef.current?.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

    // on remote track
    const remoteStream = new MediaStream();
    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach(t => remoteStream.addTrack(t));
      addPeerStream(peerId, remoteStream);
    };

    // ice
    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current.emit('ice-candidate', { to: peerId, candidate: e.candidate });
    };

    pc.onconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        removePeer(peerId);
      }
    };

    pcMapRef.current.set(peerId, pc);
    return pc;
  };

  const createOfferFor = async (peerId, emitUserJoined = true) => {
    const pc = getOrCreatePC(peerId);
    if (pc.signalingState !== 'stable') {
      console.warn(`Skipping offer creation for ${peerId}, connection not stable`);
      return;
    }
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit('offer', { to: peerId, sdp: pc.localDescription });
  };

  const joinRoom = async (roomId) => {
    await waitForLocalStream();
    socketRef.current.roomId = roomId; // store for later
    socketRef.current.emit('join-room', { roomId, name });
  };


  const waitForLocalStream = () => new Promise(res => {
    if (localStreamRef.current) return res();
    const i = setInterval(() => {
      if (localStreamRef.current) { clearInterval(i); res(); }
    }, 50);
  });

  const leaveRoom = () => {
    socketRef.current.emit('leave-room');
    pcMapRef.current.forEach((pc, id) => { pc.close(); });
    pcMapRef.current.clear();
    setPeers([]);
  };

  // controls
  const toggleMic = () => {
    const tracks = localStreamRef.current?.getAudioTracks() || [];
    tracks.forEach(t => t.enabled = !t.enabled);
    setIsMicOn(tracks[0]?.enabled ?? false);
  };
  const toggleCam = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || [];
    tracks.forEach(t => t.enabled = !t.enabled);
    setIsCamOn(tracks[0]?.enabled ?? false);
  };

  const shareScreen = async () => {
    if (isScreenSharing) return;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const track = displayStream.getVideoTracks()[0];
    screenTrackRef.current = track;
    replaceOutgoingVideoTrack(track);
    setIsScreenSharing(true);
    track.onended = () => stopShare();
  };

  const stopShare = () => {
    if (!isScreenSharing) return;
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack) replaceOutgoingVideoTrack(camTrack);
    screenTrackRef.current?.stop();
    screenTrackRef.current = null;
    setIsScreenSharing(false);
  };

  const replaceOutgoingVideoTrack = (newTrack) => {
    pcMapRef.current.forEach(pc => {
      const senders = pc.getSenders().filter(s => s.track?.kind === 'video');
      senders.forEach(sender => sender.replaceTrack(newTrack));
    });
  };

  // chat
  const sendChat = (text) => {
    socketRef.current.emit('chat-message', { roomId: socketRef.current.roomId, text });
    setMessages(prev => [...prev, { from: name, text, at: Date.now() }]);
  };


  return {
    localStream: localStreamRef,
    peers,
    joinRoom, leaveRoom,
    toggleMic, toggleCam, shareScreen, stopShare,
    isMicOn, isCamOn, isScreenSharing,
    sendChat, messages,
  };
}

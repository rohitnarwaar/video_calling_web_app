import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import useWebRTC from '../webrtc/useWebRTC';
import ChatPanel from '../ui/ChatPanel';
import Controls from '../ui/Controls';
import VideoGrid from '../ui/VideoGrid';

export default function Room() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const name = state?.name || 'Guest';

  const {
    localStream,
    peers, // [{id, stream}]
    joinRoom,
    leaveRoom,
    toggleMic,
    toggleCam,
    shareScreen,
    stopShare,
    isMicOn,
    isCamOn,
    isScreenSharing,
    sendChat,
    messages,
  } = useWebRTC({ name });

  useEffect(() => {
    joinRoom(roomId);
    return () => leaveRoom();
  }, [roomId]);

  // Chat panel toggle (for mobile)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = useCallback(() => setIsChatOpen((v) => !v), []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121212] font-inter">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid Section */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${isChatOpen ? 'lg:mr-1/3' : 'mr-0'
            }`}
        >
          <VideoGrid localStream={localStream} peers={peers} />
        </div>

        {/* Chat Panel Section */}
        <ChatPanel
          isPanelOpen={isChatOpen}
          togglePanel={toggleChat}
          messages={messages}
          onSend={sendChat}
        />
      </div>

      {/* Control Bar */}
      <Controls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        toggleMic={toggleMic}
        toggleCam={toggleCam}
        shareScreen={shareScreen}
        stopShare={stopShare}
        leaveRoom={leaveRoom}
      />

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl lg:hidden z-40"
        aria-label="Toggle Chat"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}

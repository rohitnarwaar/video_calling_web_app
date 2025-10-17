import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useWebRTC from '../webrtc/useWebRTC'
import ChatPanel from '../ui/ChatPanel'
import Controls from '../ui/Controls'
import VideoGrid from '../ui/VideoGrid'

export default function Room() {
  const { roomId } = useParams()
  const { state } = useLocation()
  const name = state?.name || 'Guest'

  const {
    localStream,
    peers, // [{id, stream}]
    joinRoom, leaveRoom,
    toggleMic, toggleCam, shareScreen, stopShare,
    isMicOn, isCamOn, isScreenSharing,
    sendChat, messages,
  } = useWebRTC({ name })

  useEffect(() => { joinRoom(roomId); return () => leaveRoom() }, [roomId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      <div className="grid gap-3">
        <VideoGrid localStream={localStream} peers={peers}/>
        <Controls
          isMicOn={isMicOn} isCamOn={isCamOn} isScreenSharing={isScreenSharing}
          toggleMic={toggleMic} toggleCam={toggleCam}
          shareScreen={shareScreen} stopShare={stopShare}
          leaveRoom={leaveRoom}
        />
      </div>
      <ChatPanel messages={messages} onSend={sendChat}/>
    </div>
  )
}

export default function Controls({
  isMicOn, isCamOn, isScreenSharing,
  toggleMic, toggleCam, shareScreen, stopShare, leaveRoom
}) {
  return (
    <div className="flex gap-3 items-center">
      <button className="p-2 bg-white text-black rounded" onClick={toggleMic}>
        {isMicOn ? 'Mute' : 'Unmute'}
      </button>
      <button className="p-2 bg-white text-black rounded" onClick={toggleCam}>
        {isCamOn ? 'Cam Off' : 'Cam On'}
      </button>
      {!isScreenSharing ? (
        <button className="p-2 bg-white text-black rounded" onClick={shareScreen}>Share Screen</button>
      ) : (
        <button className="p-2 bg-white text-black rounded" onClick={stopShare}>Stop Share</button>
      )}
      <button className="p-2 bg-red-500 text-white rounded" onClick={leaveRoom}>Leave</button>
    </div>
  )
}

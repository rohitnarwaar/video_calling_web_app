import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';

function ControlButton({ icon: Icon, label, isActive, onClick, isDanger = false, isDisabled = false }) {
  const activeColor = isActive
    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/50'
    : isDanger
      ? 'bg-red-600 hover:bg-red-500 shadow-red-500/50'
      : 'bg-gray-700 hover:bg-gray-600';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-300 transform text-white
        shadow-lg
        ${activeColor}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        ${isActive ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-gray-900' : ''}
      `}
      aria-label={label}
      title={label}
    >
      <Icon size={24} className={isActive ? 'text-white' : 'text-white/80'} />
      <span className="mt-1 text-xs hidden sm:block">{label}</span>
    </button>
  );
}

export default function Controls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  toggleMic,
  toggleCam,
  shareScreen,
  stopShare,
  leaveRoom,
}) {
  // Internal state mirrors props for button animation feedback
  const [mic, setMic] = useState(isMicOn);
  const [cam, setCam] = useState(isCamOn);
  const [sharing, setSharing] = useState(isScreenSharing);

  useEffect(() => setMic(isMicOn), [isMicOn]);
  useEffect(() => setCam(isCamOn), [isCamOn]);
  useEffect(() => setSharing(isScreenSharing), [isScreenSharing]);

  return (
    <div className="flex justify-center p-4 md:p-6 bg-gray-800/80 backdrop-blur-md border-t border-white/10 shadow-2xl z-20">
      <div className="flex space-x-3 sm:space-x-6">
        {/* Mic Toggle */}
        <ControlButton
          icon={mic ? Mic : MicOff}
          label={mic ? 'Mic On' : 'Mic Off'}
          isActive={mic}
          onClick={toggleMic}
        />

        {/* Camera Toggle */}
        <ControlButton
          icon={cam ? Video : VideoOff}
          label={cam ? 'Cam On' : 'Cam Off'}
          isActive={cam}
          onClick={toggleCam}
        />

        {/* Screen Share */}
        <ControlButton
          icon={ScreenShare}
          label={sharing ? 'Stop Sharing' : 'Share Screen'}
          isActive={sharing}
          onClick={() => (sharing ? stopShare() : shareScreen())}
        />

        {/* Leave Button */}
        <ControlButton
          icon={PhoneOff}
          label="Leave"
          isDanger
          onClick={leaveRoom}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [joinId, setJoinId] = useState('');
  const [isJoinVisible, setIsJoinVisible] = useState(false);

  const createMeeting = () => {
    const roomId = uuidv4();
    nav(`/room/${roomId}`, { state: { name } });
  };

  const joinMeeting = () => {
    if (!joinId.trim()) return;
    nav(`/room/${joinId.trim()}`, { state: { name } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b15] via-[#121232] to-[#090912] font-inter relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 text-center p-8 md:p-12 bg-gradient-to-b from-gray-900/80 to-gray-800/40 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(118,0,255,0.3)] max-w-lg w-full animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          SyncCall
        </h1>

        {/* name input */}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-6 bg-gray-800/80 text-white placeholder-gray-400 border border-indigo-500/50 rounded-xl py-3 px-5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
        />

        {/* Create Room button */}
        <button
          onClick={createMeeting}
          className="relative w-full px-8 py-3 rounded-xl font-bold text-lg text-white transition-all duration-500 overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-purple-500/50 active:scale-95"
        >
          <span className="relative z-10">Create New Room</span>
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>

        {/* Join existing room */}
        <button
          onClick={() => setIsJoinVisible(!isJoinVisible)}
          className="w-full py-3 mt-4 text-white/80 hover:text-white transition-colors duration-300"
        >
          {isJoinVisible ? 'Cancel' : 'Join Existing Room'}
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            isJoinVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex space-x-3 mt-4">
            <input
              type="text"
              placeholder="Enter Meeting ID"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="flex-1 bg-gray-800/80 text-white placeholder-gray-400 border border-indigo-500/50 rounded-xl py-3 px-5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
              onKeyPress={(e) => e.key === 'Enter' && joinMeeting()}
            />
            <button
              onClick={joinMeeting}
              className="relative px-6 py-3 rounded-xl font-bold text-white transition-all duration-500 overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-purple-500/50 active:scale-95"
            >
              Join
            </button>
          </div>
        </div>

        <p className="opacity-70 text-sm mt-8">
          Features: multi-user video, chat, mic/cam toggle, and screen share.
        </p>
      </div>
    </div>
  );
}

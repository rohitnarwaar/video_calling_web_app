import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

export default function ChatPanel({ messages = [], onSend, isPanelOpen = true, togglePanel }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when a new message arrives
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={`flex flex-col bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-2xl transition-all duration-300 ease-in-out
        ${isPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        fixed inset-y-0 right-0 w-full z-30 lg:relative lg:flex lg:w-1/3 lg:max-w-md lg:shadow-none
      `}
      style={{ minWidth: '20rem' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center">
          <MessageSquare className="mr-2" size={20} /> Chat
        </h2>
        <button
          onClick={togglePanel}
          className="lg:hidden text-white/70 hover:text-white transition duration-200 p-2 rounded-full hover:bg-white/10"
          aria-label="Close Chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10 opacity-60">No messages yet</p>
        )}
        {messages.map((m, i) => {
          const isLocal = m.from === 'You' || m.from === 'Guest';
          return (
            <div key={i} className={`flex ${isLocal ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-xl shadow-lg transition-all duration-300 ${isLocal
                    ? 'bg-indigo-600/90 text-white rounded-br-none'
                    : 'bg-gray-700/80 text-gray-100 rounded-tl-none'
                  }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span
                    className={`text-xs font-semibold ${isLocal ? 'text-indigo-200' : 'text-purple-300'
                      }`}
                  >
                    {m.from}
                  </span>
                  <span className="text-xs text-white/50 ml-3">
                    {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/10 flex items-center bg-gray-800/60 backdrop-blur-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700/70 text-white placeholder-gray-400 border-none rounded-full py-3 px-5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition duration-300 shadow-lg hover:shadow-indigo-500/50"
          aria-label="Send Message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react'

export default function ChatPanel({ messages, onSend }) {
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }
  return (
    <div className="bg-neutral-900 rounded p-3 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m,i)=>(
          <div key={i} className="text-sm">
            <span className="opacity-70">{m.from}:</span> <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="flex-1 p-2 text-black" value={text} onChange={e=>setText(e.target.value)} placeholder="Type message..."/>
        <button onClick={send} className="p-2 bg-white text-black rounded">Send</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
  const [name, setName] = useState('')

  const createMeeting = () => {
    const roomId = uuidv4()
    nav(`/room/${roomId}`, { state: { name } })
  }

  const [joinId, setJoinId] = useState('')
  const joinMeeting = () => {
    if (!joinId.trim()) return
    nav(`/room/${joinId.trim()}`, { state: { name } })
  }

  return (
    <div className="grid gap-6 py-12">
      <div>
        <label>Your name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Rohit" className="block mt-2 w-full p-2 text-black"/>
      </div>

      <div className="grid gap-3">
        <button onClick={createMeeting} className="p-3 bg-white text-black rounded">Create New Meeting</button>
        <div className="flex gap-2">
          <input placeholder="Paste Meeting ID" value={joinId} onChange={e=>setJoinId(e.target.value)} className="flex-1 p-2 text-black"/>
          <button onClick={joinMeeting} className="p-3 bg-white text-black rounded">Join</button>
        </div>
      </div>

      <p className="opacity-70 text-sm">Features: multi-user video, chat, mute/cam toggle, screen share.</p>
    </div>
  )
}

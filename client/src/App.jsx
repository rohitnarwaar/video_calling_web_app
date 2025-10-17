import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto p-4">
        <header className="py-4 flex items-center justify-between">
          <h1 style={{fontWeight:700}}>Video Calling Web App</h1>
          <a href="/" className="text-sm opacity-75">Home</a>
        </header>
        <Outlet/>
      </div>
    </div>
  )
}

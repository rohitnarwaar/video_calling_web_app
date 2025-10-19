import { Outlet } from 'react-router-dom'
import './styles/custom.css';


export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto p-4">
        <Outlet/>
      </div>
    </div>
  )
}

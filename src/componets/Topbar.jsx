import { HeartPulse, LogOut } from 'lucide-react'

function Topbar({ onBack }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="small-logo">
          <HeartPulse size={28} />
        </div>

        <div>
          <h2>MEDPASS</h2>
          <p>Historial médico digital</p>
        </div>
      </div>

      <button className="logout-button" onClick={onBack}>
        <LogOut size={18} />
        Volver
      </button>
    </header>
  )
}

export default Topbar
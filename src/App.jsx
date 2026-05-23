import { useState } from 'react'
import Login from './pages/Login.jsx'
import PerfilMedico from './pages/PerfilMedico.jsx'

function App() {
  const [paginaActual, setPaginaActual] = useState('login')

  return (
    <>
      {paginaActual === 'login' && (
        <Login onLogin={() => setPaginaActual('historial')} />
      )}

      {paginaActual === 'historial' && (
        <PerfilMedico onBack={() => setPaginaActual('login')} />
      )}
    </>
  )
}

export default App
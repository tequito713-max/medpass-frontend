import { useState } from 'react'
import Login from './pages/Login.jsx'
import BuscarPaciente from './pages/BuscarPaciente.jsx'
import PerfilMedico from './pages/PerfilMedico.jsx'
import RegistrarPaciente from './pages/RegistrarPaciente.jsx'

function App() {
  const [paginaActual, setPaginaActual] = useState('login')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [usuario, setUsuario] = useState(null)

  function manejarLogin(datosUsuario) {
    setUsuario(datosUsuario)
    setPaginaActual('buscarPaciente')
  }

  function abrirPerfil(paciente) {
    setPacienteSeleccionado(paciente)
    setPaginaActual('perfil')
  }

  function abrirRegistroPaciente() {
    setPaginaActual('registrarPaciente')
  }

  function pacienteRegistrado(pacienteNuevo) {
    setPacienteSeleccionado(pacienteNuevo)
    setPaginaActual('perfil')
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    setPacienteSeleccionado(null)
    setPaginaActual('login')
  }

  return (
    <>
      {paginaActual === 'login' && (
        <Login onLogin={manejarLogin} />
      )}

      {paginaActual === 'buscarPaciente' && (
        <BuscarPaciente
          usuario={usuario}
          onSeleccionarPaciente={abrirPerfil}
          onRegistrarPaciente={abrirRegistroPaciente}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {paginaActual === 'registrarPaciente' && (
        <RegistrarPaciente
          onPacienteRegistrado={pacienteRegistrado}
          onBack={() => setPaginaActual('buscarPaciente')}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {paginaActual === 'perfil' && (
        <PerfilMedico
          paciente={pacienteSeleccionado}
          onBack={() => setPaginaActual('buscarPaciente')}
          onCerrarSesion={cerrarSesion}
        />
      )}
    </>
  )
}

export default App
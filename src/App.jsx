import { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import BuscarPaciente from './pages/BuscarPaciente.jsx'
import PerfilMedico from './pages/PerfilMedico.jsx'
import RegistrarPaciente from './pages/RegistrarPaciente.jsx'
import { obtenerPacientePorId } from './services/api.js'

function App() {
  const [paginaActual, setPaginaActual] = useState(() => {
    const pacienteGuardado = localStorage.getItem('pacienteSeleccionado')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (usuarioGuardado && pacienteGuardado) {
      return 'perfil'
    }

    if (usuarioGuardado) {
      const usuarioParsed = JSON.parse(usuarioGuardado)

      if (esPaciente(usuarioParsed)) {
        return 'cargandoPaciente'
      }

      return 'buscarPaciente'
    }

    return 'login'
  })

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(() => {
    const pacienteGuardado = localStorage.getItem('pacienteSeleccionado')
    return pacienteGuardado ? JSON.parse(pacienteGuardado) : null
  })

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  })

  const [errorPaciente, setErrorPaciente] = useState('')

  useEffect(() => {
    if (usuario && esPaciente(usuario) && !pacienteSeleccionado) {
      cargarPerfilPaciente(usuario)
    }
  }, [usuario])

  async function manejarLogin(datosUsuario) {
    setUsuario(datosUsuario)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))

    if (esPaciente(datosUsuario)) {
      await cargarPerfilPaciente(datosUsuario)
      return
    }

    setPaginaActual('buscarPaciente')
  }

  async function cargarPerfilPaciente(datosUsuario) {
    try {
      setErrorPaciente('')
      setPaginaActual('cargandoPaciente')

      const pacienteId = obtenerPacienteId(datosUsuario)

      if (!pacienteId) {
        throw new Error('Este usuario paciente no tiene PacienteId asignado.')
      }

      const paciente = await obtenerPacientePorId(pacienteId)

      setPacienteSeleccionado(paciente)
      localStorage.setItem('pacienteSeleccionado', JSON.stringify(paciente))
      setPaginaActual('perfil')
    } catch (err) {
      setErrorPaciente(err.message || 'No se pudo cargar el perfil del paciente')
      setPaginaActual('errorPaciente')
    }
  }

  function abrirPerfil(paciente) {
    if (esPaciente(usuario)) return

    setPacienteSeleccionado(paciente)
    localStorage.setItem('pacienteSeleccionado', JSON.stringify(paciente))
    setPaginaActual('perfil')
  }

  function abrirRegistroPaciente() {
    if (esPaciente(usuario)) return

    setPaginaActual('registrarPaciente')
  }

  function pacienteRegistrado(pacienteNuevo) {
    if (esPaciente(usuario)) return

    setPacienteSeleccionado(pacienteNuevo)
    localStorage.setItem('pacienteSeleccionado', JSON.stringify(pacienteNuevo))
    setPaginaActual('perfil')
  }

  function volverABuscarPaciente() {
    if (esPaciente(usuario)) return

    setPacienteSeleccionado(null)
    localStorage.removeItem('pacienteSeleccionado')
    setPaginaActual('buscarPaciente')
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('pacienteSeleccionado')

    setUsuario(null)
    setPacienteSeleccionado(null)
    setPaginaActual('login')
  }

  return (
    <>
      {paginaActual === 'login' && (
        <Login onLogin={manejarLogin} />
      )}

      {paginaActual === 'cargandoPaciente' && (
        <div className="estado-box">
          Cargando historial del paciente...
        </div>
      )}

      {paginaActual === 'errorPaciente' && (
        <main className="dashboard-page">
          <div className="error-box large-error">
            {errorPaciente}
          </div>

          <button className="logout-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </main>
      )}

      {paginaActual === 'buscarPaciente' && !esPaciente(usuario) && (
        <BuscarPaciente
          usuario={usuario}
          onSeleccionarPaciente={abrirPerfil}
          onRegistrarPaciente={abrirRegistroPaciente}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {paginaActual === 'registrarPaciente' && !esPaciente(usuario) && (
        <RegistrarPaciente
          usuario={usuario}
          onPacienteRegistrado={pacienteRegistrado}
          onVolver={() => setPaginaActual('buscarPaciente')}
        />
      )}

      {paginaActual === 'perfil' && pacienteSeleccionado && (
        <PerfilMedico
          paciente={pacienteSeleccionado}
          usuario={usuario}
          onBack={volverABuscarPaciente}
          onCerrarSesion={cerrarSesion}
        />
      )}
    </>
  )
}

function esPaciente(usuario) {
  return usuario?.rol?.toLowerCase() === 'paciente'
}

function obtenerPacienteId(usuario) {
  return usuario?.pacienteId || usuario?.PacienteId || usuario?.paciente?.id || usuario?.Paciente?.Id
}

export default App

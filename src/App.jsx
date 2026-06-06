import { useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import BuscarPaciente from './pages/BuscarPaciente.jsx'
import PerfilMedico from './pages/PerfilMedico.jsx'
import RegistrarPaciente from './pages/RegistrarPaciente.jsx'
import { obtenerPacientePorId } from './services/api.js'


const TIEMPO_INACTIVIDAD = 900000  

function App() {
  const [paginaActual, setPaginaActual] = useState('login')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (tokenGuardado && usuarioGuardado) {
      const usuarioLocal = JSON.parse(usuarioGuardado)

      setUsuario(usuarioLocal)

      if (usuarioLocal.rol === 'Paciente') {
        cargarPerfilPaciente(usuarioLocal)
      } else if (usuarioLocal.rol === 'Medico') {
        setPaginaActual('buscarPaciente')
      }
    }
  }, [])

  useEffect(() => {
    if (!usuario) return

    let temporizador

    const cerrarPorInactividad = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      setUsuario(null)
      setPacienteSeleccionado(null)
      setPaginaActual('login')
    }

    const reiniciarTemporizador = () => {
      clearTimeout(temporizador)
      temporizador = setTimeout(cerrarPorInactividad, TIEMPO_INACTIVIDAD)
    }

    window.addEventListener('mousemove', reiniciarTemporizador)
    window.addEventListener('keydown', reiniciarTemporizador)
    window.addEventListener('click', reiniciarTemporizador)
    window.addEventListener('scroll', reiniciarTemporizador)

    reiniciarTemporizador()

    return () => {
      clearTimeout(temporizador)
      window.removeEventListener('mousemove', reiniciarTemporizador)
      window.removeEventListener('keydown', reiniciarTemporizador)
      window.removeEventListener('click', reiniciarTemporizador)
      window.removeEventListener('scroll', reiniciarTemporizador)
    }
  }, [usuario])

  async function cargarPerfilPaciente(datosUsuario) {
    try {
      const pacienteCompleto = await obtenerPacientePorId(datosUsuario.pacienteId)

      setPacienteSeleccionado(pacienteCompleto)
      setPaginaActual('perfil')
    } catch (error) {
      console.error('Error al obtener el perfil del paciente:', error)

      setPacienteSeleccionado({
        id: datosUsuario.pacienteId,
        nombre: datosUsuario.nombre
      })

      setPaginaActual('perfil')
    }
  }

  async function manejarLogin(datosUsuario) {
    setUsuario(datosUsuario)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))

    if (datosUsuario.rol === 'Paciente') {
      await cargarPerfilPaciente(datosUsuario)
    } else if (datosUsuario.rol === 'Medico') {
      setPaginaActual('buscarPaciente')
    }
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

      {paginaActual === 'buscarPaciente' && usuario?.rol === 'Medico' && (
        <BuscarPaciente
          usuario={usuario}
          onSeleccionarPaciente={abrirPerfil}
          onRegistrarPaciente={abrirRegistroPaciente}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {paginaActual === 'registrarPaciente' && usuario?.rol === 'Medico' && (
        <RegistrarPaciente
          onPacienteRegistrado={pacienteRegistrado}
          onBack={() => setPaginaActual('buscarPaciente')}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {paginaActual === 'perfil' && (
        <PerfilMedico
          paciente={pacienteSeleccionado}
          usuario={usuario}
          onBack={
            usuario?.rol === 'Medico'
              ? () => setPaginaActual('buscarPaciente')
              : null
          }
          onCerrarSesion={cerrarSesion}
        />
      )}
    </>
  )
}

export default App
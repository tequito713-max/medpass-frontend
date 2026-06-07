import { useEffect, useState } from 'react'
import {
  HeartPulse,
  LogOut,
  Search,
  UserRound,
  Mail,
  Phone,
  Droplets,
  Calendar,
  FileText,
} from 'lucide-react'

import { obtenerPacientes } from '../services/api.js'

function BuscarPaciente({ usuario, onSeleccionarPaciente, onRegistrarPaciente, onCerrarSesion }) {
  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const esUsuarioPaciente = usuario?.rol === 'Paciente'

  useEffect(() => {
    cargarPacientes()
  }, [])

  async function cargarPacientes() {
    if (esUsuarioPaciente) {
      setPacientes([])
      setCargando(false)
      return
    }

    try {
      setCargando(true)
      setError('')

      const data = await obtenerPacientes()
      setPacientes(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pacientes')
    } finally {
      setCargando(false)
    }
  }

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = `${paciente.nombre} ${paciente.curp} ${paciente.email} ${paciente.telefono}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase())
  })


  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="small-logo">
            <HeartPulse size={28} />
          </div>

          <div>
            <h2>MEDPASS</h2>
            <p>Buscar paciente</p>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="usuario-sesion">
            {usuario?.nombre || 'Usuario'}
          </span>

          <button className="logout-button" onClick={onCerrarSesion}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      <section className="search-hero">
        <div>
          <span className="section-label">Pacientes registrados</span>
          <h1>Buscar historial médico</h1>
          <p>
            Consulta pacientes usando nombre, CURP, correo o teléfono.
          </p>
        </div>

        <div className="stats-card">
          <strong>{pacientes.length}</strong>
          <span>Pacientes</span>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-box">
          <Search size={22} />
          <input
            type="text"
            placeholder="Buscar por nombre, CURP, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>

      {cargando && (
        <div className="estado-box">
          Cargando pacientes...
        </div>
      )}

      {error && (
        <div className="error-box large-error">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <section className="patients-grid">
          {pacientesFiltrados.map((paciente) => (
            <article className="patient-card" key={paciente.id}>
              <div className="patient-card-header">
                <div className="patient-avatar">
                  <UserRound size={32} />
                </div>

                <div>
                  <h3>{paciente.nombre}</h3>
                  <p>{paciente.curp}</p>
                </div>
              </div>

              <div className="patient-info-list">
                <div>
                  <Mail size={17} />
                  <span>{paciente.email}</span>
                </div>

                <div>
                  <Phone size={17} />
                  <span>{paciente.telefono}</span>
                </div>

                <div>
                  <Droplets size={17} />
                  <span>Tipo de sangre: {paciente.tipoSangre}</span>
                </div>

                <div>
                  <Calendar size={17} />
                  <span>Nacimiento: {formatearFecha(paciente.fechaNac)}</span>
                </div>
              </div>

              <button
                className="primary-outline-button"
                onClick={() => !esUsuarioPaciente && onSeleccionarPaciente(paciente)}
              >
                <FileText size={18} />
                Ver historial
              </button>
            </article>
          ))}

          {pacientesFiltrados.length === 0 && (
            <div className="estado-box full-width">
              <p>No se encontraron pacientes con esa búsqueda.</p>

              {!esUsuarioPaciente && (
                <button
                  className="btn-registrar"
                  onClick={onRegistrarPaciente}
                >
                  Registrar nuevo paciente
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'

  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default BuscarPaciente
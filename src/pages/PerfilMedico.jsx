import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Droplets,
  Stethoscope,
  Hospital,
  ClipboardList,
  HeartPulse,
  LogOut,
  ArrowLeft,
  UserRound,
  Pill,
  FlaskConical,
  AlertTriangle,
  CalendarDays,
  Phone,
  Mail,
  IdCard,
  PlusCircle,
  Pencil,
} from 'lucide-react'

import {
  obtenerConsultas,
  obtenerAlergias,
  obtenerRecetas,
  obtenerEstudios,
  obtenerMedicos,
  obtenerClinicas,
} from '../services/api.js'

import FormularioAtencion from '../componets/FormularioAtencion.jsx'

function PerfilMedico({ paciente, onBack, onCerrarSesion }) {
  const [consultas, setConsultas] = useState([])
  const [alergias, setAlergias] = useState([])
  const [recetas, setRecetas] = useState([])
  const [estudios, setEstudios] = useState([])
  const [medicos, setMedicos] = useState([])
  const [clinicas, setClinicas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [consultaEditar, setConsultaEditar] = useState(null)

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  useEffect(() => {
    if (paciente?.id) {
      cargarHistorial()
    }
  }, [paciente])

  async function cargarHistorial() {
    try {
      setCargando(true)
      setError('')

      const [
        consultasData,
        alergiasData,
        recetasData,
        estudiosData,
        medicosData,
        clinicasData,
      ] = await Promise.all([
        obtenerConsultas(),
        obtenerAlergias(),
        obtenerRecetas(),
        obtenerEstudios(),
        obtenerMedicos(),
        obtenerClinicas(),
      ])

      const consultasPaciente = consultasData.filter(
        (consulta) => consulta.pacienteId === paciente.id
      )

      const idsConsultasPaciente = consultasPaciente.map(
        (consulta) => consulta.id
      )

      const recetasPaciente = recetasData.filter((receta) =>
        idsConsultasPaciente.includes(receta.consultaId)
      )

      const alergiasPaciente = alergiasData.filter(
        (alergia) => alergia.pacienteId === paciente.id
      )

      const estudiosPaciente = estudiosData.filter(
        (estudio) => estudio.pacienteId === paciente.id
      )

      setConsultas(consultasPaciente)
      setAlergias(alergiasPaciente)
      setRecetas(recetasPaciente)
      setEstudios(estudiosPaciente)
      setMedicos(medicosData)
      setClinicas(clinicasData)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el historial')
    } finally {
      setCargando(false)
    }
  }

  function buscarMedico(id) {
    return medicos.find((medico) => medico.id === id)
  }

  function buscarClinica(id) {
    return clinicas.find((clinica) => clinica.id === id)
  }

  function cerrarFormularioYActualizar() {
    setMostrarFormulario(false)
    setConsultaEditar(null)
    cargarHistorial()
  }

  return (
    <main className="profile-page">
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

        <div className="topbar-actions">
          <button className="logout-button secondary" onClick={onBack}>
            <ArrowLeft size={18} />
            Volver
          </button>

          <button className="logout-button" onClick={onCerrarSesion}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      <section className="profile-header">
        <div className="user-avatar">
          <UserRound size={58} />
        </div>

        <div>
          <span className="section-label">Paciente</span>
          <h1>{paciente.nombre}</h1>
          <p>Historial médico registrado en MEDPASS</p>
        </div>

        {usuario?.rol === 'Medico' && (
          <button
            className="btn-nueva-atencion"
            onClick={() => {
              setConsultaEditar(null)
              setMostrarFormulario(true)}}
          >
            <PlusCircle size={18} />
            Registrar nueva atención
          </button>
        )}
      </section>

      <section className="summary-cards">
        <div className="mini-card">
          <Stethoscope size={24} />
          <strong>{consultas.length}</strong>
          <span>Consultas</span>
        </div>

        <div className="mini-card">
          <AlertTriangle size={24} />
          <strong>{alergias.length}</strong>
          <span>Alergias</span>
        </div>

        <div className="mini-card">
          <Pill size={24} />
          <strong>{recetas.length}</strong>
          <span>Recetas</span>
        </div>

        <div className="mini-card">
          <FlaskConical size={24} />
          <strong>{estudios.length}</strong>
          <span>Estudios</span>
        </div>
      </section>

      {cargando && (
        <div className="estado-box">
          Cargando historial médico...
        </div>
      )}

      {error && (
        <div className="error-box large-error">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <section className="content-grid">
          <div className="card personal-info">
            <div className="card-title">
              <ClipboardList size={24} />
              <h3>Información personal</h3>
            </div>

            <div className="info-grid">
              <InfoItem icono={<UserRound size={18} />} titulo="Nombre" valor={paciente.nombre} />
              <InfoItem icono={<IdCard size={18} />} titulo="CURP" valor={paciente.curp} />
              <InfoItem icono={<Droplets size={18} />} titulo="Tipo de sangre" valor={paciente.tipoSangre} />
              <InfoItem icono={<Phone size={18} />} titulo="Teléfono" valor={paciente.telefono} />
              <InfoItem icono={<Mail size={18} />} titulo="Correo" valor={paciente.email} />
              <InfoItem icono={<CalendarDays size={18} />} titulo="Fecha de nacimiento" valor={formatearFecha(paciente.fechaNac)} />
            </div>
          </div>

          <div className="card medical-summary">
            <div className="card-title">
              <ShieldCheck size={24} />
              <h3>Alergias</h3>
            </div>

            {alergias.length > 0 ? (
              <div className="vertical-list">
                {alergias.map((alergia) => (
                  <div className="medical-row" key={alergia.id}>
                    <div className="medical-icon danger">
                      <AlertTriangle size={22} />
                    </div>

                    <div>
                      <span>{alergia.sustancia}</span>
                      <strong>{alergia.reaccion}</strong>
                      <p>Severidad: {alergia.severidad}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No hay alergias registradas.</p>
            )}
          </div>

          <div className="card history-card wide-card">
            <div className="card-title">
              <Stethoscope size={24} />
              <h3>Consultas médicas</h3>
            </div>

            {consultas.length > 0 ? (
              <div className="timeline-list">
                {consultas.map((consulta) => {
                  const medico = buscarMedico(consulta.medicoId)
                  const clinica = buscarClinica(consulta.clinicaId)

                  return (
                    <div className="timeline-item" key={consulta.id}>
                      <div className="timeline-date">
                        {formatearFecha(consulta.fecha)}
                      </div>

                      <div className="timeline-content">
                        <h4>{consulta.motivo}</h4>
                        <p>{consulta.diagnostico}</p>

                        <div className="timeline-meta">
                          <span>
                            <Stethoscope size={15} />
                            {medico?.nombre || 'Médico no encontrado'}
                          </span>

                          <span>
                            <Hospital size={15} />
                            {clinica?.nombre || 'Clínica no encontrada'}
                          </span>
                        </div>
                      </div>

                      {usuario?.rol === 'Medico' && (
                        <button
                          className="btn-editar-consulta"
                          onClick={() => {
                            setConsultaEditar(consulta)
                            setMostrarFormulario(true)
                          }}
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="empty-text">No hay consultas registradas.</p>
            )}
          </div>

          <div className="card history-card">
            <div className="card-title">
              <Pill size={24} />
              <h3>Recetas</h3>
            </div>

            {recetas.length > 0 ? (
              <div className="vertical-list">
                {recetas.map((receta) => (
                  <div className="simple-record" key={receta.id}>
                    <strong>{receta.medicamento}</strong>
                    <span>Dosis: {receta.dosis}</span>
                    <p>Duración: {receta.duracion}</p>
                    {receta.indicaciones && (
                      <p>Indicaciones: {receta.indicaciones}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No hay recetas registradas.</p>
            )}
          </div>

          <div className="card history-card">
            <div className="card-title">
              <FlaskConical size={24} />
              <h3>Estudios médicos</h3>
            </div>

            {estudios.length > 0 ? (
              <div className="vertical-list">
                {estudios.map((estudio) => {
                  const clinica = buscarClinica(estudio.clinicaId)

                  return (
                    <div className="simple-record" key={estudio.id}>
                      <strong>{estudio.tipo}</strong>
                      <span>{estudio.resultado}</span>
                      <p>{formatearFecha(estudio.fecha || estudio.fechaSolicitud)}</p>
                      <p>{clinica?.nombre || estudio.clinicaLaboratorio || 'Clínica no encontrada'}</p>

                      {estudio.hospital && (
                        <p>Hospital: {estudio.hospital}</p>
                      )}

                      {estudio.fechaProgramada && (
                        <p>Fecha programada: {formatearFecha(estudio.fechaProgramada)}</p>
                      )}

                      {estudio.indicaciones && (
                        <p>Indicaciones: {estudio.indicaciones}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="empty-text">No hay estudios registrados.</p>
            )}
          </div>
        </section>
      )}

      {mostrarFormulario && (
        <FormularioAtencion
          pacienteId={paciente.id}
          medicoId={usuario?.medicoId}
          consultaEditar={consultaEditar}
          onCerrar={() => {
            setMostrarFormulario(false)
            setConsultaEditar(null)
          }}
          onGuardado={cerrarFormularioYActualizar}
        />
      )}
    </main>
  )
}

function InfoItem({ icono, titulo, valor }) {
  return (
    <div className="info-item">
      <div className="info-icon">
        {icono}
      </div>

      <div>
        <span>{titulo}</span>
        <strong>{valor || 'Sin información'}</strong>
      </div>
    </div>
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

export default PerfilMedico
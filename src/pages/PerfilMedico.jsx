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
  crearAlergia,
  editarAlergia,
  borrarAlergia,
  actualizarEstudio,
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
  const [mostrarFormularioAlergia, setMostrarFormularioAlergia] = useState(false)
  const [guardandoAlergia, setGuardandoAlergia] = useState(false)
  const [nuevaAlergia, setNuevaAlergia] = useState({
    sustancia: '',
    reaccion: '',
    severidad: 'Baja',
  }) 
  const [alergiaEditar, setAlergiaEditar] = useState(null)
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  
  const [estudioEditandoId, setEstudioEditandoId] = useState(null)
  const [resultadoEditado, setResultadoEditado] = useState('')
  const [estudioDetalleId, setEstudioDetalleId] = useState(null)
  const [guardandoResultado, setGuardandoResultado] = useState(false)  


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
    return medicos.find((medico) => String(medico.id) === String(id))
  }

  function buscarClinica(id) {
    return clinicas.find((clinica) => String(clinica.id) === String(id))
  }

  function cerrarFormularioYActualizar() {
    setMostrarFormulario(false)
    setConsultaEditar(null)
    cargarHistorial()
  }
  async function guardarAlergia(e) {
    e.preventDefault()

    if (!nuevaAlergia.sustancia.trim()) {
      
      return
    }

    if (!nuevaAlergia.reaccion.trim()) {
      
      return
    }

    try {
      setGuardandoAlergia(true)

      const alergiaEnviar = {
        sustancia: nuevaAlergia.sustancia,
        reaccion: nuevaAlergia.reaccion,
        severidad: nuevaAlergia.severidad,
        pacienteId: paciente.id,
      }

      if (alergiaEditar) {
        await editarAlergia(alergiaEditar.id, {
          id: alergiaEditar.id,
          ...alergiaEnviar,
        })
      } else {
        await crearAlergia(alergiaEnviar)
      }

      setNuevaAlergia({
        sustancia: '',
        reaccion: '',
        severidad: 'Baja',
      })

      setAlergiaEditar(null)
      setMostrarFormularioAlergia(false)
      cargarHistorial()
    } catch (error) {
      alert(error.message || 'No se pudo guardar la alergia')
    } finally {
      setGuardandoAlergia(false)
    }
  }

  async function eliminarAlergia() {
    if (!alergiaEditar) return

    const confirmar = confirm('¿Seguro que quieres borrar esta alergia?')

    if (!confirmar) return

    try {
      await borrarAlergia(alergiaEditar.id)

      setNuevaAlergia({
        sustancia: '',
        reaccion: '',
        severidad: 'Baja',
      })

      setAlergiaEditar(null)
      setMostrarFormularioAlergia(false)
      cargarHistorial()
    } catch (error) {
      alert(error.message || 'No se pudo borrar la alergia')
    }
  }

  function abrirEditarAlergia(alergia) {
    setAlergiaEditar(alergia)

    setNuevaAlergia({
      sustancia: alergia.sustancia || '',
      reaccion: alergia.reaccion || '',
      severidad: alergia.severidad || 'Baja',
    })

    setMostrarFormularioAlergia(true)
  }

  async function guardarResultadoEstudio(id) {
    if (!resultadoEditado.trim()) {
      alert('Escribe el resultado del estudio')
      return
    }

    const estudioActual = estudios.find(
      (estudio) => String(estudio.id) === String(id)
    )

    if (!estudioActual) {
      alert('No se encontró el estudio')
      return
    }

    try {
      setGuardandoResultado(true)

      await actualizarEstudio(id, {
        ...estudioActual,
        resultado: resultadoEditado,
      })

      setEstudioEditandoId(null)
      setResultadoEditado('')
      cargarHistorial()
    } catch (error) {
      alert(error.message || 'No se pudo actualizar el resultado del estudio')
    } finally {
      setGuardandoResultado(false)
    }
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
          {usuario?.rol !== 'Paciente' && (
            <button className="logout-button secondary" onClick={onBack}>
              <ArrowLeft size={18} />
              Volver
            </button>
          )}

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
            <ShieldCheck size={24} />
            <strong>{consultas.length}</strong>
            <span>Consultas</span>
          </div>

        <div className="mini-card">
          <ShieldCheck size={24} />
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
            <div className="card-title card-title-between">
              <div className="card-title-left">
                <ShieldCheck size={24} />
                <h3>Alergias</h3>
              </div>

              {usuario?.rol === 'Medico' && (
                <button
                  type="button"
                  className="btn-agregar-alergia"
                  onClick={() => {
                    setAlergiaEditar(null)
                    setNuevaAlergia({
                      sustancia: '',
                      reaccion: '',
                      severidad: 'Baja',
                    })
                    setMostrarFormularioAlergia(true)
                  }}
                >
                  <PlusCircle size={16} />
                  Agregar
                </button>
              )}
            </div>

            {alergias.length > 0 ? (
              <div className="vertical-list">
                {alergias.map((alergia) => (
                  <div className="medical-row medical-row-editable" key={alergia.id}>
                    <div className="medical-icon danger">
                      <AlertTriangle size={22} />
                    </div>

                    <div className="medical-info">
                      <span>{alergia.sustancia}</span>
                      <strong>{alergia.reaccion}</strong>
                      <p>Severidad: {alergia.severidad}</p>
                    </div>

                    {usuario?.rol === 'Medico' && (
                      <button
                        type="button"
                        className="btn-editar-alergia"
                        onClick={() => abrirEditarAlergia(alergia)}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No hay alergias registradas.</p>
            )}

            {mostrarFormularioAlergia && (
              <form className="formulario-alergia" onSubmit={guardarAlergia}>
                <h4>{alergiaEditar ? 'Editar alergia' : 'Nueva alergia'}</h4>

                <label>Sustancia</label>
                <input
                  type="text"
                  placeholder="Ejemplo: Penicilina"
                  value={nuevaAlergia.sustancia}
                  onChange={(e) =>
                    setNuevaAlergia({
                      ...nuevaAlergia,
                      sustancia: e.target.value,
                    })
                  }
                />

                <label>Reacción</label>
                <input
                  type="text"
                  placeholder="Ejemplo: Erupción cutánea"
                  value={nuevaAlergia.reaccion}
                  onChange={(e) =>
                    setNuevaAlergia({
                      ...nuevaAlergia,
                      reaccion: e.target.value,
                    })
                  }
                />

                <label>Severidad</label>
                <select
                  value={nuevaAlergia.severidad}
                  onChange={(e) =>
                    setNuevaAlergia({
                      ...nuevaAlergia,
                      severidad: e.target.value,
                    })
                  }
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>

                <div className="acciones-form-alergia">
                  <button
                    type="button"
                    className="btn-cancelar-alergia"
                    onClick={() => {
                      setMostrarFormularioAlergia(false)
                      setAlergiaEditar(null)
                      setNuevaAlergia({
                        sustancia: '',
                        reaccion: '',
                        severidad: 'Baja',
                      })
                    }}
                  >
                    Cancelar
                  </button>

                  {alergiaEditar && (
                    <button
                      type="button"
                      className="btn-borrar-alergia"
                      onClick={eliminarAlergia}
                    >
                      Borrar
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn-guardar-alergia"
                    disabled={guardandoAlergia}
                  >
                    {guardandoAlergia
                      ? 'Guardando...'
                      : alergiaEditar
                        ? 'Actualizar alergia'
                        : 'Guardar alergia'}
                  </button>
                </div>
              </form>
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
                            const recetasDeConsulta = recetas.filter(
                              (receta) => Number(receta.consultaId) === Number(consulta.id)
                            )

                            setConsultaEditar({
                              ...consulta,
                              recetas: recetasDeConsulta,
                              estudio: null,
                            })

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
                {consultas.map((consulta) => {
                  const recetasDeConsulta = recetas.filter(
                    (receta) => Number(receta.consultaId) === Number(consulta.id)
                  )

                  if (recetasDeConsulta.length === 0) {
                    return null
                  }

                  return (
                    <div className="simple-record receta-grupo" key={consulta.id}>
                      <strong>Receta del {formatearFecha(consulta.fecha)}</strong>

                      {recetasDeConsulta.map((receta, index) => (
                        <div className="medicamento-receta" key={receta.id}>
                          <h4>
                            Medicamento {index + 1}: {receta.medicamento}
                          </h4>

                          <span>Dosis: {receta.dosis}</span>
                          <p>Duración: {receta.duracion}</p>

                          {receta.indicaciones && (
                            <p>Indicaciones: {receta.indicaciones}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })}
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
                  const estaAbierto = estudioDetalleId === estudio.id

                  return (
                    <div className="simple-record estudio-record" key={estudio.id}>
                      <div className="estudio-record-header">
                        <div>
                          <strong>{estudio.tipo || `Estudio #${estudio.id}`}</strong>

                          <span
                            className={`badge-estado ${
                              estudio.resultado === 'Pendiente'
                                ? 'estado-pendiente'
                                : 'estado-realizado'
                            }`}
                          >
                            {estudio.resultado || 'Pendiente'}
                          </span>
                        </div>
                      </div>

                      <p>
                        {formatearFecha(estudio.fecha || estudio.fechaSolicitud)}
                      </p>

                      <p>
                        {clinica?.nombre ||
                          estudio.clinicaLaboratorio ||
                          'Clínica no encontrada'}
                      </p>

                      <div className="estudio-actions">
                        <button
                          type="button"
                          className="btn-ver-detalles"
                          onClick={() =>
                            setEstudioDetalleId(estaAbierto ? null : estudio.id)
                          }
                        >
                          {estaAbierto ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>

                       {usuario?.rol === 'Medico' && (
                        <button
                          type="button"
                          className="btn-editar-estudio"
                          onClick={() => {
                            setEstudioEditandoId(estudio.id)
                            setResultadoEditado(estudio.resultado || '')
                          }}
                        >
                          Editar resultado
                        </button>
                      )}
                      </div>

                      {estaAbierto && (
                        <div className="estudio-detalle">
                          <p>
                            <strong>Tipo:</strong>{' '}
                            {estudio.tipo || 'No especificado'}
                          </p>

                          <p>
                            <strong>Resultado:</strong>{' '}
                            {estudio.resultado || 'Pendiente'}
                          </p>

                          <p>
                            <strong>Fecha:</strong>{' '}
                            {formatearFecha(estudio.fecha || estudio.fechaSolicitud)}
                          </p>

                          <p>
                            <strong>Clínica/Laboratorio:</strong>{' '}
                            {clinica?.nombre ||
                              estudio.clinicaLaboratorio ||
                              'Clínica no encontrada'}
                          </p>

                          {estudio.hospital && (
                            <p>
                              <strong>Hospital:</strong> {estudio.hospital}
                            </p>
                          )}

                          {estudio.fechaProgramada && (
                            <p>
                              <strong>Fecha programada:</strong>{' '}
                              {formatearFecha(estudio.fechaProgramada)}
                            </p>
                          )}

                          {estudio.indicaciones && (
                            <p>
                              <strong>Indicaciones:</strong>{' '}
                              {estudio.indicaciones}
                            </p>
                          )}
                        </div>
                      )}

                      {estudioEditandoId === estudio.id && (
                        <div className="formulario-editar-resultado">
                          <h4>Editar resultado del estudio</h4>

                          <label>Resultado</label>
                          <textarea
                            value={resultadoEditado}
                            onChange={(e) => setResultadoEditado(e.target.value)}
                            placeholder="Escribe el resultado del estudio"
                            rows="4"
                          />

                          <div className="acciones-editar-resultado">
                            <button
                              type="button"
                              className="btn-guardar-resultado"
                              onClick={() => guardarResultadoEstudio(estudio.id)}
                            >
                              Guardar cambios
                            </button>

                            <button
                              type="button"
                              className="btn-cancelar-resultado"
                              onClick={() => {
                                setEstudioEditandoId(null)
                                setResultadoEditado('')
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
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
          medicos={medicos}
          clinicas={clinicas}
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
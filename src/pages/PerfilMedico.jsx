import {
  HeartPulse,
  UserRound,
  ShieldCheck,
  Droplets,
  Stethoscope,
  Hospital,
  ClipboardList,
  LogOut,
} from 'lucide-react'

function PerfilMedico({ onBack }){
  const usuario = {
    nombre: 'Juan Carlos',
    apellidoPaterno: 'Ramírez',
    apellidoMaterno: 'López',
    seguro: 'NSS-8392017462',
    curp: 'RALJ010524HSRMPN09',
    alergias: 'Penicilina, polvo',
    enfermedades: 'Asma controlada',
    tipoSangre: 'O+',
  }

  const doctores = [
    {
      nombre: 'Dra. Mariana Torres',
      especialidad: 'Medicina general',
      fecha: '12 mayo 2026',
    },
    {
      nombre: 'Dr. Luis Herrera',
      especialidad: 'Neumología',
      fecha: '03 abril 2026',
    },
  ]

  const hospitales = [
    {
      nombre: 'Hospital General de Sonora',
      motivo: 'Consulta de seguimiento',
      fecha: '12 mayo 2026',
    },
    {
      nombre: 'Clínica San José',
      motivo: 'Revisión médica',
      fecha: '20 marzo 2026',
    },
  ]

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

        <button className="logout-button" onClick={onBack}>
          <LogOut size={18} />
          Volver
        </button>
      </header>

      <section className="profile-header">
        <div className="user-avatar">
          <UserRound size={58} />
        </div>

        <div>
          <h1>
            {usuario.nombre} {usuario.apellidoPaterno}
          </h1>
          <p>Paciente registrado en MEDPASS</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="card personal-info">
          <div className="card-title">
            <ClipboardList size={24} />
            <h3>Información personal</h3>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span>Nombre</span>
              <strong>{usuario.nombre}</strong>
            </div>

            <div className="info-item">
              <span>Apellido paterno</span>
              <strong>{usuario.apellidoPaterno}</strong>
            </div>

            <div className="info-item">
              <span>Apellido materno</span>
              <strong>{usuario.apellidoMaterno}</strong>
            </div>

            <div className="info-item">
              <span>Número de seguro</span>
              <strong>{usuario.seguro}</strong>
            </div>

            <div className="info-item large">
              <span>CURP</span>
              <strong>{usuario.curp}</strong>
            </div>
          </div>
        </div>

        <div className="card medical-summary">
          <div className="card-title">
            <ShieldCheck size={24} />
            <h3>Datos médicos</h3>
          </div>

          <div className="medical-list">
            <div className="medical-row">
              <div className="medical-icon">
                <Droplets size={22} />
              </div>
              <div>
                <span>Tipo de sangre</span>
                <strong>{usuario.tipoSangre}</strong>
              </div>
            </div>

            <div className="medical-row">
              <div className="medical-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span>Alergias</span>
                <strong>{usuario.alergias}</strong>
              </div>
            </div>

            <div className="medical-row">
              <div className="medical-icon">
                <Stethoscope size={22} />
              </div>
              <div>
                <span>Enfermedades</span>
                <strong>{usuario.enfermedades}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card history-card">
          <div className="card-title">
            <Stethoscope size={24} />
            <h3>Historia de doctores</h3>
          </div>

          {doctores.map((doctor, index) => (
            <div className="history-item" key={index}>
              <div>
                <strong>{doctor.nombre}</strong>
                <span>{doctor.especialidad}</span>
              </div>
              <p>{doctor.fecha}</p>
            </div>
          ))}
        </div>

        <div className="card history-card">
          <div className="card-title">
            <Hospital size={24} />
            <h3>Historia de hospitales</h3>
          </div>

          {hospitales.map((hospital, index) => (
            <div className="history-item" key={index}>
              <div>
                <strong>{hospital.nombre}</strong>
                <span>{hospital.motivo}</span>
              </div>
              <p>{hospital.fecha}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PerfilMedico
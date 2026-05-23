import { UserRound } from 'lucide-react'

function ProfileHeader({ nombre, apellidoPaterno }) {
  return (
    <section className="profile-header">
      <div className="user-avatar">
        <UserRound size={58} />
      </div>

      <div>
        <h1>{nombre} {apellidoPaterno}</h1>
        <p>Paciente registrado en MEDPASS</p>
      </div>
    </section>
  )
}

export default ProfileHeader
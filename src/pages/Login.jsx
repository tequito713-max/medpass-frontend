import { useState } from 'react'
import { UserRound, Lock, Mail, HeartPulse } from 'lucide-react'
import { loginUsuario } from '../services/api.js'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function manejarSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const data = await loginUsuario(email, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      onLogin(data.usuario)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="brand-section">
          <div className="logo-box">
            <HeartPulse size={42} />
          </div>

          <h1>MEDPASS</h1>
          <p>Acceso seguro a tu historial médico digital</p>
        </div>

        <form className="login-card" onSubmit={manejarSubmit}>
          <div className="login-header">
            <UserRound size={34} />
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para continuar</p>
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Correo</label>
            <div className="input-box">
              <Mail size={20} />
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-box">
              <Lock size={20} />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Login'}
          </button>

          <p className="register-text">
            Sistema médico conectado a base de datos MEDPASS
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
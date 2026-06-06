import { useState } from 'react'
import { UserRound, Lock, Mail, HeartPulse, ShieldCheck } from 'lucide-react'
import { loginUsuario, verificarMfa } from '../services/api.js'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [requiereMfa, setRequiereMfa] = useState(false)
  const [usuarioId, setUsuarioId] = useState(null)
  const [codigoMfa, setCodigoMfa] = useState('')

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function manejarSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    try {
      const data = await loginUsuario(email, password)

      console.log('Respuesta login:', data)

      if (data.ok && data.requiereMfa) {
        setRequiereMfa(true)
        setUsuarioId(data.usuarioId)
        setCodigoMfa('')
        setError('')
        return
      }

      if (data.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))

        onLogin(data.usuario)
        return
      }

      setError(data.mensaje || 'No se pudo iniciar sesión')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  async function manejarMfa(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const data = await verificarMfa(usuarioId, codigoMfa)

      console.log('Respuesta MFA:', data)

      if (data.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))

        onLogin(data.usuario)
        return
      }

      setError(data.mensaje || 'Código MFA incorrecto')
    } catch (err) {
      setError(err.message || 'El código MFA es incorrecto o ya expiró')
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

        {!requiereMfa ? (
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
                  required
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
                  required
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
        ) : (
          <form className="login-card" onSubmit={manejarMfa}>
            <div className="login-header">
              <ShieldCheck size={34} />
              <h2>Verificación MFA</h2>
              <p>Ingresa el código de 6 dígitos de tu app Authenticator</p>
            </div>

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Código MFA</label>
              <div className="input-box">
                <Lock size={20} />
                <input
                  type="text"
                  placeholder="123456"
                  value={codigoMfa}
                  onChange={(e) => setCodigoMfa(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button" disabled={cargando}>
              {cargando ? 'Verificando...' : 'Verificar código'}
            </button>

            <button
              type="button"
              className="login-button"
              disabled={cargando}
              onClick={() => {
                setRequiereMfa(false)
                setUsuarioId(null)
                setCodigoMfa('')
                setError('')
              }}
            >
              Volver al login
            </button>

            <p className="register-text">
              El código cambia cada 30 segundos
            </p>
          </form>
        )}
      </section>
    </main>
  )
}

export default Login
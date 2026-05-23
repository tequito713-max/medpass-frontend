import { UserRound, Lock, Mail, HeartPulse } from 'lucide-react'

function Login({ onLogin }) {
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

        <form className="login-card">
          <div className="login-header">
            <UserRound size={34} />
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para continuar</p>
          </div>

          <div className="form-group">
            <label>Correo o usuario</label>
            <div className="input-box">
              <Mail size={20} />
              <input type="text" placeholder="ejemplo@correo.com" />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-box">
              <Lock size={20} />
              <input type="password" placeholder="Ingresa tu contraseña" />
            </div>
          </div>

          <a href="#" className="forgot-link">
            ¿Olvidaste tu contraseña?
          </a>

          <button type="button" className="login-button" onClick={onLogin}>
            Login
          </button>

          <p className="register-text">
            ¿No estás dado de alta? <a href="#">Regístrate aquí</a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
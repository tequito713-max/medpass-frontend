import axios from 'axios'
const API_URL = 'https://d35t58c2fgfu9s.cloudfront.net/v1'
//const API_URL = 'https://localhost:7121/v1'
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  const esLogin = config.url === '/Auth/login'
  const esMfa = config.url === '/Auth/verificar-mfa'

  if (token && !esLogin && !esMfa) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function manejarError(error) {
  const mensaje =
    error.response?.data?.mensaje ||
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    'Ocurrió un error'

  throw new Error(mensaje)
}

export async function loginUsuario(email, password) {
  try {
    const response = await api.post('/Auth/login', {
      email,
      password,
    })

    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function verificarMfa(usuarioId, codigo) {
  try {
    const response = await api.post('/Auth/verificar-mfa', {
      usuarioId,
      codigo,
    })

    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerPacientes() {
  try {
    const response = await api.get('/Pacientes')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerPacientePorId(id) {
  try {
    const response = await api.get(`/Pacientes/${id}`)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerAlergias() {
  try {
    const response = await api.get('/Alergias')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerConsultas() {
  try {
    const response = await api.get('/Consultas')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerRecetas() {
  try {
    const response = await api.get('/Recetas')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function actualizarEstudio(id, datos) {
  try {
    const response = await api.patch(`/Estudios/${id}`, datos)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerEstudios() {
  try {
    const response = await api.get('/Estudios')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerMedicos() {
  try {
    const response = await api.get('/Medicos')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function obtenerClinicas() {
  try {
    const response = await api.get('/Clinicas')
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function crearPaciente(paciente) {
  try {
    const response = await api.post('/Pacientes', paciente)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function crearAlergia(alergia) {
  try {
    const response = await api.post('/Alergias', alergia)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function editarAlergia(id, alergia) {
  try {
    const response = await api.patch(`/Alergias/${id}`, alergia)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function borrarAlergia(id) {
  try {
    const response = await api.delete(`/Alergias/${id}`)
    return response.data
  } catch (error) {
    manejarError(error)
  }
}

export async function crearPacienteConCuenta(datos) {
  try {
    const response = await api.post("/Auth/registrar-paciente", datos);
    return response.data;
  } catch (error) {
    manejarError(error);
  }
}





export default api
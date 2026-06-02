const API_URL = 'https://localhost:7121/v1'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  let response

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (error) {
    throw new Error('No se pudo conectar con el backend')
  }

  const texto = await response.text()

  let data = null

  if (texto) {
    try {
      data = JSON.parse(texto)
    } catch {
      data = texto
    }
  }

  if (!response.ok) {
    const mensaje =
      data?.mensaje ||
      data?.message ||
      (typeof data === 'string' ? data : null) ||
      `Error ${response.status}`

    throw new Error(mensaje)
  }

  return data
}

export function loginUsuario(email, password) {
  return apiRequest('/Auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}

export function obtenerPacientes() {
  return apiRequest('/Pacientes')
}

export function obtenerAlergias() {
  return apiRequest('/Alergias')
}

export function obtenerConsultas() {
  return apiRequest('/Consultas')
}

export function obtenerRecetas() {
  return apiRequest('/Recetas')
}

export function obtenerEstudios() {
  return apiRequest('/Estudios')
}

export function obtenerMedicos() {
  return apiRequest('/Medicos')
}

export function obtenerClinicas() {
  return apiRequest('/Clinicas')
}

export function crearPaciente(paciente) {
  return apiRequest('/Pacientes', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}

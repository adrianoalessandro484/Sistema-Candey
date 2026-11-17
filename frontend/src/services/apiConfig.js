import axios from 'axios'

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')
export const API_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`

export const SESSION_KEY = 'candey.session'

function getStoredToken() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY))
    return saved?.token ?? null
  } catch {
    return null
  }
}

axios.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const validationMessage = data?.errors
      ? Object.values(data.errors).flat().find(Boolean)
      : null
    const message = data?.mensaje ?? validationMessage ?? data?.title

    if (message) {
      error.message = message
    } else if (!error.response) {
      error.message = 'No se pudo conectar con el servidor. Verifique que la API este en ejecucion.'
    } else if (error.response.status === 403) {
      error.message = 'No tiene permisos para realizar esta accion.'
    } else if (error.response.status === 401) {
      error.message = 'La sesion expiro. Vuelva a iniciar sesion.'
    }

    if (error.response?.status === 401 && !window.location.pathname.startsWith('/autenticacion')) {
      localStorage.removeItem(SESSION_KEY)
      window.location.assign('/autenticacion')
    }

    return Promise.reject(error)
  },
)

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        console.error('Token invalid atau expired, redirecting to login...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else if (status === 500) {
        console.error('Server error. Please try again later.')
      }
    } else if (error.request) {
      console.error('Network error. Please check your internet connection.')
    } else {
      console.error('Error in request setup: ', error.message)
    }
    return Promise.reject(error)
  },
)

export async function validateToken() {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const res = await api.get('/auth/me')
    return !!res.data
  } catch (err) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

export default api

import api from '@/utils/axios'
import axios from 'axios'

const state = () => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
  status: null,
})

const getters = {
  isLoggedIn: (state) => !!state.token,
  getUser: (state) => state.user,
  authError: (state) => state.error,
  authStatus: (state) => state.status,
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_AUTH(state, { token, user }) {
    state.token = token
    state.user = user
    state.error = null
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  CLEAR_AUTH(state) {
    state.token = null
    state.user = null
    state.error = null
    state.status = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_STATUS(state, status) {
    state.status = status
  },
}

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('SET_STATUS', 'loading')
      const res = await api.post('/auth/login', credentials)
      const { token, user } = res.data.data
      commit('SET_AUTH', { token, user })
      commit('SET_STATUS', 'success')
      return res.data
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || 'Login gagal')
      commit('SET_STATUS', 'error')
      throw err
    }
  },

  async register({ commit }, payload) {
    try {
      commit('SET_STATUS', 'loading')
      const res = await api.post('/auth/register', payload)
      commit('SET_STATUS', 'success')
      return res.data
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || 'Registrasi gagal')
      commit('SET_STATUS', 'error')
      throw err
    }
  },

  async fetchProfile({ commit }) {
    try {
      const res = await api.get('/auth/get-profile')
      if (res.data.success) {
        commit('SET_USER', res.data.data)
      }
    } catch (err) {
      commit('SET_ERROR', 'Gagal memuat profil')
      console.error('Gagal mengambil profil:', err)
    }
  },

  async updateProfile({ commit }, payload) {
    try {
      const res = await api.put('/auth/update-profile', payload)
      if (res.data.success) {
        commit('SET_USER', res.data.data)
      }
      return res.data
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || 'Gagal update profil')
      throw err
    }
  },

  async updatePassword({ commit }, payload) {
    try {
      const res = await api.put('/auth/change-password', payload)
      return res.data
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || 'Gagal update password')
      throw err
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

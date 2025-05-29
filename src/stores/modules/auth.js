import api from '@/utils/axios'
import axios from 'axios'

const state = () => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
})

const getters = {
  isLoggedIn: (state) => !!state.token,
  getUser: (state) => state.user,
}

const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token
    state.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  CLEAR_AUTH(state) {
    state.token = null
    state.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  },
}

const actions = {
  async login({ commit }, credentials) {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data.data
    commit('SET_AUTH', { token, user })
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

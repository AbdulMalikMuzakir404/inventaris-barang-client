const state = () => ({
  message: '',
  type: 'success',
  duration: 3000,
})

const mutations = {
  SET_TOAST(state, { message, type, duration }) {
    state.message = message
    state.type = type
    state.duration = duration
  },
  CLEAR_TOAST(state) {
    state.message = ''
  },
}

const actions = {
  showToast({ commit }, payload) {
    commit('SET_TOAST', payload)
    setTimeout(() => {
      commit('CLEAR_TOAST')
    }, payload.duration || 3000)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

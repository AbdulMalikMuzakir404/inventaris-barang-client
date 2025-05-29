// File: src/store/modules/category.js
import api from '@/utils/axios'

export default {
  namespaced: true,
  state: () => ({
    categories: [],
    simpleList: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    currentCategory: null,
  }),

  mutations: {
    SET_CATEGORIES(state, payload) {
      state.categories = payload.data
      state.total = payload.total
      state.page = payload.page
      state.limit = payload.limit
      state.totalPages = payload.totalPages
    },
    SET_CURRENT_CATEGORY(state, category) {
      state.currentCategory = category
    },
    SET_SIMPLE_CATEGORIES(state, categories) {
      state.simpleList = categories
    },
  },

  actions: {
    async fetchCategories({ commit }, { page = 1, limit = 10, q = '' } = {}) {
      try {
        const res = await api.get('/category', {
          params: {
            page,
            limit,
            q: q.trim() || undefined,
          },
        })
        if (res.data.success) {
          commit('SET_CATEGORIES', res.data)
        }
      } catch (err) {
        console.error('Gagal mengambil data kategori:', err)
        commit('SET_CATEGORIES', { data: [], total: 0, page: 1, limit: 10, totalPages: 1 })
      }
    },

    async fetchAllCategories({ commit }) {
      try {
        const res = await api.get('/category/simple')
        if (res.data.success) {
          commit('SET_SIMPLE_CATEGORIES', res.data.data)
        }
      } catch (err) {
        console.error('Gagal mengambil semua kategori:', err)
        commit('SET_SIMPLE_CATEGORIES', [])
      }
    },

    async fetchCategoryById({ commit }, id) {
      try {
        const res = await api.get(`/category/${id}`)
        if (res.data.success) {
          commit('SET_CURRENT_CATEGORY', res.data.data)
        }
      } catch (err) {
        console.error('Gagal mengambil detail kategori:', err)
        commit('SET_CURRENT_CATEGORY', null)
      }
    },

    async createCategory({ dispatch }, payload) {
      try {
        const res = await api.post('/category', payload)
        if (res.data.success) {
          await dispatch('fetchCategories')
        }
      } catch (err) {
        console.error('Gagal menambahkan kategori:', err)
      }
    },

    async updateCategory({ dispatch }, payload) {
      try {
        const res = await api.put(`/category/${payload.id}`, payload)
        if (res.data.success) {
          await dispatch('fetchCategories')
        }
      } catch (err) {
        console.error('Gagal memperbarui kategori:', err)
      }
    },

    async deleteCategory({ dispatch }, id) {
      try {
        const res = await api.delete(`/category/${id}`)
        if (res.data.success) {
          await dispatch('fetchCategories')
        }
      } catch (err) {
        console.error('Gagal menghapus kategori:', err)
      }
    },
  },
}

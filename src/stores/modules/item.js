// File: src/store/modules/item.js
import api from '@/utils/axios'

export default {
  namespaced: true,
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    currentItem: null,
  }),

  mutations: {
    SET_ITEMS(state, payload) {
      state.items = payload.data
      state.total = payload.total
      state.page = payload.page
      state.limit = payload.limit
      state.totalPages = payload.totalPages
    },
    SET_CURRENT_ITEM(state, item) {
      state.currentItem = item
    },
  },

  actions: {
    async fetchItems({ commit }, { page = 1, limit = 10, q = '' } = {}) {
      try {
        const res = await api.get('/item', {
          params: {
            page,
            limit,
            q: q.trim() || undefined,
          },
        })
        if (res.data.success) {
          commit('SET_ITEMS', res.data)
        }
      } catch (err) {
        console.error('Gagal mengambil semua barang:', err)
        commit('SET_ITEMS', { data: [], total: 0, page: 1, limit: 10, totalPages: 1 })
      }
    },

    async fetchItemById({ commit }, id) {
      try {
        const res = await api.get(`/item/${id}`)
        if (res.data.success) {
          commit('SET_CURRENT_ITEM', res.data.data)
        }
      } catch (err) {
        console.error('Gagal mengambil detail barang:', err)
        commit('SET_CURRENT_ITEM', null)
      }
    },

    async createItem({ dispatch }, payload) {
      try {
        const res = await api.post('/item', payload)
        if (res.data.success) {
          await dispatch('fetchItems')
        }
      } catch (err) {
        console.error('Gagal menambahkan barang:', err)
      }
    },

    async updateItem({ dispatch }, payload) {
      try {
        const res = await api.put(`/item/${payload.id}`, payload)
        if (res.data.success) {
          await dispatch('fetchItems')
        }
      } catch (err) {
        console.error('Gagal memperbarui barang:', err)
      }
    },

    async deleteItem({ dispatch }, id) {
      try {
        const res = await api.delete(`/item/${id}`)
        if (res.data.success) {
          await dispatch('fetchItems')
        }
      } catch (err) {
        console.error('Gagal menghapus barang:', err)
      }
    },
  },
}

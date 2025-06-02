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
    q: '',
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
    SET_PARAMS(state, { page, limit, q }) {
      state.page = page
      state.limit = limit
      state.q = q
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
          commit('SET_PARAMS', { page, limit, q })
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

    async createItem({ dispatch, state }, payload) {
      try {
        const res = await api.post('/item', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.data.success) {
          await dispatch('fetchItems', {
            page: state.page,
            limit: state.limit,
            q: state.q,
          })
        }
        return res.data
      } catch (err) {
        console.error('Gagal menambahkan barang:', err)
        throw err
      }
    },

    async updateItem({ dispatch, state }, { id, data }) {
      try {
        const res = await api.put(`/item/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (res.data.success) {
          await dispatch('fetchItems', {
            page: state.page,
            limit: state.limit,
            q: state.q,
          })
        }
        return res.data
      } catch (err) {
        console.error('Gagal memperbarui barang:', err)
        throw err
      }
    },

    async deleteItem({ dispatch, state }, id) {
      try {
        const res = await api.delete(`/item/${id}`)
        if (res.data.success) {
          await dispatch('fetchItems', {
            page: state.page,
            limit: state.limit,
            q: state.q,
          })
        }
      } catch (err) {
        console.error('Gagal menghapus barang:', err)
      }
    },

    async importItems({ dispatch, state }, formData) {
      try {
        await api.post('/item-ei/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        await dispatch('fetchItems', {
          page: state.page,
          limit: state.limit,
          q: state.q,
        })
      } catch (error) {
        console.error('Import gagal:', error)
        throw error
      }
    },

    async exportItems({ state }, searchQuery = '') {
      try {
        const res = await api.post('/item-ei/export', { q: searchQuery })

        if (!res.data?.success || !res.data?.jobId) {
          throw new Error('Response tidak valid atau jobId tidak ditemukan.')
        }

        const { jobId } = res.data

        const poll = setInterval(async () => {
          try {
            const statusRes = await api.get(`/item-ei/export/status/${jobId}`)
            const { success, state: jobState, data } = statusRes.data

            if (success && jobState === 'completed' && data?.downloadUrl) {
              clearInterval(poll)
              window.open(data.downloadUrl, '_blank')
            }
          } catch (err) {
            console.error('Polling status export gagal:', err)
            clearInterval(poll)
          }
        }, 2000)
      } catch (error) {
        console.error('Export gagal:', error)
        throw error
      }
    },
  },
}

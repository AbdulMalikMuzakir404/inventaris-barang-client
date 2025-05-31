<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">🏷️ Data Kategori</h1>
      <button
        @click="openForm(null)"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Baru
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p class="text-sm text-gray-600">
        Total Data: <span class="font-medium">{{ total }}</span>
      </p>
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Cari kategori..."
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keydown.enter="onSearch"
        />
        <select
          v-model="perPage"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th class="px-6 py-3">No</th>
            <th class="px-6 py-3">Kode</th>
            <th class="px-6 py-3">Nama</th>
            <th class="px-6 py-3">Dibuat</th>
            <th class="px-6 py-3">Diubah</th>
            <th class="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="hover:bg-gray-50 border-t transition"
          >
            <td class="px-6 py-3">{{ index + 1 + (page - 1) * perPage }}</td>
            <td class="px-6 py-3">{{ item.kode ?? '-' }}</td>
            <td class="px-6 py-3 font-medium text-gray-900">{{ item.nama ?? '-' }}</td>
            <td class="px-6 py-3">{{ formatDateTime(item.createdAt) }}</td>
            <td class="px-6 py-3">{{ formatDateTime(item.updatedAt) }}</td>
            <td class="px-6 py-3 flex items-center gap-3">
              <button
                @click="openForm(item)"
                class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 16H9v-2.828z"
                  />
                </svg>
                Edit
              </button>
              <button
                @click="confirmDelete(item)"
                class="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2h10z"
                  />
                </svg>
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="6" class="text-center text-gray-500 py-6">Tidak ada data ditemukan.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="flex justify-between items-center px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t"
      >
        <p>
          Menampilkan halaman <strong>{{ page }}</strong> dari <strong>{{ totalPages }}</strong>
        </p>
        <div class="flex gap-2">
          <button
            :disabled="page === 1"
            @click="goToPage(page - 1)"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅ Sebelumnya
          </button>
          <button
            :disabled="page === totalPages"
            @click="goToPage(page + 1)"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya ➡
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CategoryForm v-if="showForm" :item="selectedItem" @close="closeForm" />
    <CategoryDeleteConfirm
      v-if="showDeleteConfirm"
      :item="selectedItem"
      @close="cancelDelete"
      @confirm="deleteItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import CategoryForm from './CategoryForm.vue'
import CategoryDeleteConfirm from './CategoryDeleteConfirm.vue'
import { formatDateTime } from '@/utils/dateFormat'

const store = useStore()

// State lokal
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const selectedItem = ref(null)

// Getters
const items = computed(() => store.state.category.categories)
const total = computed(() => store.state.category.total)
const totalPages = computed(() => store.state.category.totalPages)

// Ambil data kategori
const fetchData = async () => {
  const query = search.value.trim()
  try {
    await store.dispatch('category/fetchCategories', {
      page: page.value,
      limit: perPage.value,
      q: query,
    })

    if (items.value.length === 0) {
      store.dispatch('toast/showToast', {
        message: query ? 'Data tidak ditemukan' : 'Data kosong',
        type: 'info',
        duration: 3000,
      })
    }
  } catch (err) {
    store.dispatch('toast/showToast', {
      message: 'Gagal mengambil data kategori',
      type: 'error',
      duration: 3000,
    })
    console.error('Fetch Error:', err)
  }
}

// Form
const openForm = (item) => {
  selectedItem.value = item
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedItem.value = null
  fetchData()
}

// Delete
const confirmDelete = (item) => {
  selectedItem.value = item
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  selectedItem.value = null
}

const deleteItem = async () => {
  if (!selectedItem.value) return
  try {
    await store.dispatch('category/deleteCategory', selectedItem.value.id)
    store.dispatch('toast/showToast', {
      message: 'Kategori berhasil dihapus',
      type: 'success',
      duration: 3000,
    })
    showDeleteConfirm.value = false
    selectedItem.value = null
    fetchData()
  } catch (error) {
    store.dispatch('toast/showToast', {
      message: 'Gagal menghapus kategori',
      type: 'error',
      duration: 3000,
    })
    console.error('Delete Error:', error)
  }
}

// Pagination
const goToPage = (p) => {
  if (p !== page.value && p >= 1 && p <= totalPages.value) {
    page.value = p
    fetchData()
  }
}

// Watchers
watch(perPage, () => {
  page.value = 1
  fetchData()
})

watch(search, (val) => {
  if (val.trim() === '') {
    onSearch()
  }
})

const onSearch = () => {
  page.value = 1
  fetchData()
}

// Init
onMounted(fetchData)
</script>

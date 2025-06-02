<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">📦 Data Barang</h1>
      <button
        @click="openForm(null)"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4V20M4 12H20"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Tambah Baru
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p class="text-sm text-gray-600">
        Total Data: <span class="font-medium">{{ total }}</span>
      </p>
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Cari barang..."
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

    <!-- Export & Import -->
    <div class="flex gap-2 mb-4">
      <button
        @click="handleExport"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
      >
        📤 Export
      </button>
      <button
        @click="showImportModal = true"
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
      >
        📥 Import
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th class="px-6 py-3">No</th>
            <th class="px-4 py-2">Cover</th>
            <th class="px-6 py-3">Nama</th>
            <th class="px-6 py-3">Kategori</th>
            <th class="px-6 py-3">Stok</th>
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
            <td class="px-4 py-2">
              <img
                :src="item.cover ? item.cover : 'https://ui-avatars.com/api/?name=Item'"
                alt="cover"
                class="w-10 h-10 object-cover rounded-full border"
              />
            </td>
            <td class="px-6 py-3 font-medium text-gray-900">{{ item.nama }}</td>
            <td class="px-6 py-3">{{ item.kategori?.nama || '-' }}</td>
            <td class="px-6 py-3">{{ item.stok }}</td>
            <td class="px-6 py-3">{{ formatDateTime(item.createdAt) }}</td>
            <td class="px-6 py-3">{{ formatDateTime(item.updatedAt) }}</td>
            <td class="px-6 py-3 flex items-center gap-3">
              <button
                @click="openForm(item)"
                class="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-red-600 hover:text-red-800 font-medium transition"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="8" class="text-center text-gray-500 py-6">Tidak ada data ditemukan.</td>
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
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            ⬅ Sebelumnya
          </button>
          <button
            :disabled="page === totalPages"
            @click="goToPage(page + 1)"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Selanjutnya ➡
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ItemForm v-if="showForm" :item="selectedItem" @close="closeForm" />
    <ItemDeleteConfirm
      v-if="showDeleteConfirm"
      :item="selectedItem"
      @close="cancelDelete"
      @confirm="deleteItem"
    />
    <ImportModal v-if="showImportModal" @close="showImportModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import ItemForm from './ItemForm.vue'
import ItemDeleteConfirm from './ItemDeleteConfirm.vue'
import ImportModal from './ImportModal.vue'
import { formatDateTime } from '@/utils/dateFormat'

const store = useStore()
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const showImportModal = ref(false)
const selectedItem = ref(null)

const items = computed(() => store.state.item.items)
const total = computed(() => store.state.item.total)
const totalPages = computed(() => store.state.item.totalPages)

const fetchData = async () => {
  const q = search.value.trim()
  try {
    await store.dispatch('item/fetchItems', { page: page.value, limit: perPage.value, q })
  } catch (err) {
    store.dispatch('toast/showToast', {
      message: 'Gagal memuat data',
      type: 'error',
      duration: 3000,
    })
  }
}

const openForm = (item) => {
  selectedItem.value = item
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedItem.value = null
  fetchData()
}

const confirmDelete = (item) => {
  selectedItem.value = item
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  selectedItem.value = null
  showDeleteConfirm.value = false
}

const deleteItem = async () => {
  if (!selectedItem.value) return
  await store.dispatch('item/deleteItem', selectedItem.value.id)
  cancelDelete()
  fetchData()
}

const onSearch = () => {
  page.value = 1
  fetchData()
}

const handleExport = async () => {
  await store.dispatch('item/exportItems', search.value)
}

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p
    fetchData()
  }
}

watch(perPage, () => {
  page.value = 1
  fetchData()
})
watch(search, (val) => {
  if (val.trim() === '') onSearch()
})
onMounted(fetchData)
</script>

<style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>

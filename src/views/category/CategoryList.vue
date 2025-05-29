<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Data Kategori</h1>
      <button @click="openForm(null)" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow">
        Tambah Baru
      </button>
    </div>

    <div class="mb-4 flex justify-between items-center gap-2">
      <p class="text-sm text-gray-600">Total Data: {{ total }}</p>
      <div class="flex gap-2 items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Cari kategori..."
          class="p-2 border rounded"
          @keydown.enter="onSearch"
        />
        <select v-model="perPage" class="border p-2 rounded text-sm">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <div class="bg-white shadow rounded-xl overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-100 text-gray-600">
          <tr>
            <th class="px-4 py-2">No</th>
            <th class="px-4 py-2">Kode</th>
            <th class="px-4 py-2">Nama</th>
            <th class="px-4 py-2">Dibuat</th>
            <th class="px-4 py-2">Diubah</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{{ index + 1 + (page - 1) * perPage }}</td>
            <td class="px-4 py-2">{{ item.kode ?? '-' }}</td>
            <td class="px-4 py-2">{{ item.nama ?? '-' }}</td>
            <td class="px-4 py-2">{{ formatDateTime(item.createdAt) }}</td>
            <td class="px-4 py-2">{{ formatDateTime(item.updatedAt) }}</td>
            <td class="px-4 py-2 space-x-2">
              <button @click="openForm(item)" class="text-blue-500 hover:text-blue-700">
                ✏️ Edit
              </button>
              <button @click="confirmDelete(item)" class="text-red-500 hover:text-red-700">
                🗑️ Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between items-center mt-4 text-sm">
        <p>Menampilkan halaman {{ page }} dari {{ totalPages }}</p>
        <div class="space-x-1">
          <button
            :disabled="page === 1"
            @click="goToPage(page - 1)"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            :disabled="page === totalPages"
            @click="goToPage(page + 1)"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

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
import { onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import CategoryForm from './CategoryForm.vue'
import CategoryDeleteConfirm from './CategoryDeleteConfirm.vue'
import { formatDateTime } from '@/utils/dateFormat'

const store = useStore()

const search = ref('')
const page = ref(1)
const perPage = ref(10)

const showForm = ref(false)
const showDeleteConfirm = ref(false)
const selectedItem = ref(null)

const items = computed(() => store.state.category.categories)
const total = computed(() => store.state.category.total)
const totalPages = computed(() => store.state.category.totalPages)

const fetchData = () => {
  const trimmed = search.value.trim()
  const query = trimmed.length > 0 ? trimmed : ''
  store.dispatch('category/fetchCategories', {
    page: page.value,
    limit: perPage.value,
    q: query,
  })
}

const onSearch = () => {
  page.value = 1
  fetchData()
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
  showDeleteConfirm.value = false
  selectedItem.value = null
}

const deleteItem = async () => {
  if (!selectedItem.value) return
  await store.dispatch('category/deleteCategory', selectedItem.value.id)
  showDeleteConfirm.value = false
  selectedItem.value = null
  fetchData()
}

const goToPage = (p) => {
  if (p !== page.value && p >= 1 && p <= totalPages.value) {
    page.value = p
    fetchData()
  }
}

watch(perPage, () => {
  page.value = 1
  fetchData()
})

watch(search, (val) => {
  if (val.trim() === '') {
    onSearch()
  }
})

onMounted(fetchData)
</script>

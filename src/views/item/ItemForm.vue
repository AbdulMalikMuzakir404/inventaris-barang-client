<template>
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">
        {{ form.id ? 'Edit Barang' : 'Tambah Barang' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Barang</label>
          <input
            v-model="form.nama"
            type="text"
            placeholder="Contoh: Meja Kayu"
            class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
          <select
            v-model="form.kategoriId"
            required
            class="w-full appearance-none border border-gray-300 rounded-lg p-3 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled selected>Pilih Kategori</option>
            <option v-for="kat in categories" :key="kat.id" :value="kat.id">
              {{ kat.nama }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Stok</label>
          <input
            v-model="form.stok"
            type="number"
            placeholder="0"
            min="0"
            class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({ item: Object })
const emit = defineEmits(['close'])

const store = useStore()

const form = reactive({
  id: null,
  nama: '',
  stok: 0,
  kategoriId: '',
})

const categories = computed(() => store.state.category.simpleList)

watch(
  () => props.item,
  (newVal) => {
    if (newVal) Object.assign(form, newVal)
    else Object.assign(form, { id: null, nama: '', stok: 0, kategoriId: '' })
  },
  { immediate: true },
)

const handleSubmit = async () => {
  try {
    if (form.id) {
      await store.dispatch('item/updateItem', { ...form })
      store.dispatch('toast/showToast', {
        message: 'Item berhasil diperbarui',
        type: 'success',
        duration: 3000,
      })
    } else {
      await store.dispatch('item/createItem', { ...form })
      store.dispatch('toast/showToast', {
        message: 'Item berhasil ditambahkan',
        type: 'success',
        duration: 3000,
      })
    }
    emit('close')
  } catch (error) {
    const message = error.response?.data?.message || 'Gagal menyimpan item'
    store.dispatch('toast/showToast', {
      message,
      type: 'error',
      duration: 4000,
    })
    console.error('Submit Error:', error)
  }
}

onMounted(() => {
  store.dispatch('category/fetchAllCategories')
})
</script>

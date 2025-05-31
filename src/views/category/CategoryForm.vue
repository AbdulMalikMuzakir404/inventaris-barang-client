<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">
        {{ form.id ? 'Edit Kategori' : 'Tambah Kategori' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kode Kategori</label>
          <input
            v-model="form.kode"
            type="text"
            placeholder="CTG001"
            class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori</label>
          <input
            v-model="form.nama"
            type="text"
            placeholder="Nama kategori"
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
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({ item: Object })
const emit = defineEmits(['close'])

const store = useStore()

const form = reactive({
  id: null,
  kode: '',
  nama: '',
})

// Reset form saat item berubah
watch(
  () => props.item,
  (newVal) => {
    if (newVal) Object.assign(form, newVal)
    else Object.assign(form, { id: null, kode: '', nama: '' })
  },
  { immediate: true },
)

// Handle submit
const handleSubmit = async () => {
  try {
    if (form.id) {
      await store.dispatch('category/updateCategory', { ...form })
      store.dispatch('toast/showToast', {
        message: 'Kategori berhasil diperbarui',
        type: 'success',
        duration: 3000,
      })
    } else {
      await store.dispatch('category/createCategory', { ...form })
      store.dispatch('toast/showToast', {
        message: 'Kategori berhasil ditambahkan',
        type: 'success',
        duration: 3000,
      })
    }
    emit('close')
  } catch (error) {
    const message = error.response?.data?.message || 'Gagal menyimpan kategori'
    store.dispatch('toast/showToast', {
      message,
      type: 'error',
      duration: 4000,
    })
    console.error('Submit Error:', error)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4">
        {{ form.id ? 'Edit Kategori' : 'Tambah Kategori' }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium">Kode</label>
          <input v-model="form.kode" type="text" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Nama</label>
          <input v-model="form.nama" type="text" class="w-full border rounded p-2" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-200">
            Batal
          </button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-500 text-white">Simpan</button>
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

watch(
  () => props.item,
  (newVal) => {
    if (newVal) Object.assign(form, newVal)
    else Object.assign(form, { id: null, kode: '', nama: '' })
  },
  { immediate: true },
)

const handleSubmit = async () => {
  if (form.id) {
    await store.dispatch('category/updateCategory', { ...form })
  } else {
    await store.dispatch('category/createCategory', { ...form })
  }
  emit('close')
}
</script>

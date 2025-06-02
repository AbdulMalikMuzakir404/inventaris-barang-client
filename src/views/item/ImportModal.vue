<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-xl space-y-4 w-full max-w-sm">
      <h2 class="text-lg font-bold">Import Data Item</h2>
      <input type="file" @change="onFileChange" accept=".xlsx,.csv" />
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="btn bg-gray-200 text-gray-800">Batal</button>
        <button @click="handleImport" class="btn bg-blue-600 text-white">Import</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['close', 'success'])

const file = ref(null)

const onFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleImport = async () => {
  if (!file.value) return
  try {
    const formData = new FormData()
    formData.append('file', file.value)

    await store.dispatch('item/importItems', formData)
    store.dispatch('toast/showToast', {
      message: 'Import berhasil!',
      type: 'success',
      duration: 3000,
    })
    emit('success')
    emit('close')
  } catch (err) {
    store.dispatch('toast/showToast', {
      message: 'Gagal mengimpor data.',
      type: 'error',
      duration: 3000,
    })
  }
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg transition;
}
</style>

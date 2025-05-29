<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4">{{ form.id ? 'Edit Barang' : 'Tambah Barang' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium">Nama</label>
          <input v-model="form.nama" type="text" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Kategori</label>
          <select v-model="form.kategoriId" class="w-full border rounded p-2" required>
            <option value="" disabled selected>Pilih Kategori</option>
            <option v-for="kat in categories" :key="kat.id" :value="kat.id">
              {{ kat.nama }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Stok</label>
          <input v-model="form.stok" type="number" class="w-full border rounded p-2" required />
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
  if (form.id) {
    await store.dispatch('item/updateItem', { ...form })
  } else {
    await store.dispatch('item/createItem', { ...form })
  }
  emit('close')
}

onMounted(() => {
  store.dispatch('category/fetchAllCategories')
})
</script>

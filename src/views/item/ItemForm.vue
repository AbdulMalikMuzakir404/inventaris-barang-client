<template>
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">
        {{ form.id ? 'Edit Barang' : 'Tambah Barang' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- COVER -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Cover</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div v-if="form.coverPreview" class="mt-2">
            <img :src="form.coverPreview" class="w-20 h-20 object-cover rounded-full border" />
          </div>
        </div>

        <!-- NAMA -->
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

        <!-- KATEGORI -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
          <select
            v-model="form.kategoriId"
            required
            class="w-full appearance-none border border-gray-300 rounded-lg p-3 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Pilih Kategori</option>
            <option v-for="kat in categories" :key="kat.id" :value="kat.id">
              {{ kat.nama }}
            </option>
          </select>
        </div>

        <!-- STOK -->
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

        <!-- ACTIONS -->
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
import { reactive, watch, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({ item: Object })
const emit = defineEmits(['close'])

const store = useStore()
const fileInput = ref(null)

const form = reactive({
  id: null,
  nama: '',
  stok: '',
  kategoriId: '',
  cover: null,
  coverPreview: null,
})

const categories = computed(() => store.state.category.simpleList)

watch(
  () => props.item,
  (newVal) => {
    if (newVal) {
      Object.assign(form, {
        id: newVal.id,
        nama: newVal.nama,
        stok: newVal.stok.toString(), // pastikan string
        kategoriId: newVal.kategoriId.toString(),
        cover: null,
        coverPreview: newVal.cover || null,
      })
    } else {
      Object.assign(form, {
        id: null,
        nama: '',
        stok: '',
        kategoriId: '',
        cover: null,
        coverPreview: null,
      })
    }

    if (fileInput.value) fileInput.value.value = ''
  },
  { immediate: true },
)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file instanceof File) {
    form.cover = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.coverPreview = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    form.cover = null
    form.coverPreview = null
  }
}

const handleSubmit = async () => {
  try {
    const payload = new FormData()
    payload.append('nama', form.nama)
    payload.append('stok', form.stok)
    payload.append('kategoriId', form.kategoriId)
    if (form.cover instanceof File) {
      payload.append('cover', form.cover)
    }

    if (form.id) {
      await store.dispatch('item/updateItem', { id: form.id, data: payload })
      store.dispatch('toast/showToast', {
        message: 'Item berhasil diperbarui',
        type: 'success',
        duration: 3000,
      })
    } else {
      await store.dispatch('item/createItem', payload)
      store.dispatch('toast/showToast', {
        message: 'Item berhasil ditambahkan',
        type: 'success',
        duration: 3000,
      })
    }

    emit('close')
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Gagal menyimpan item'
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

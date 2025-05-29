<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
      <p>
        Apakah Anda yakin ingin menghapus kategori <strong>{{ item.nama }}</strong
        >?
      </p>
      <div class="flex justify-end gap-2 mt-6">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded">Batal</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 text-white rounded">
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object })
defineEmits(['close', 'confirm'])
</script>

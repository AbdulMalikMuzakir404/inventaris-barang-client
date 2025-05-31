<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5">
      <h2 class="text-xl font-bold text-gray-800">Konfirmasi Penghapusan</h2>

      <p class="text-gray-700">
        Anda yakin ingin menghapus barang
        <span class="font-semibold text-red-600">"{{ item.nama }}"</span>? Tindakan ini tidak dapat
        dibatalkan.
      </p>

      <div class="flex justify-end gap-3 pt-4 border-t mt-6">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Batal
        </button>
        <button
          @click="$emit('confirm')"
          class="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
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

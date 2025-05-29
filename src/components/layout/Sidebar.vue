<template>
  <aside class="w-64 h-screen bg-gray-800 text-white fixed">
    <div class="p-4 text-lg font-bold border-b border-gray-700">Inventaris</div>
    <nav class="mt-4 flex flex-col gap-2">
      <router-link
        to="/item"
        class="px-4 py-2 hover:bg-gray-700"
        :class="{ 'bg-gray-700': $route.path === '/item' }"
      >
        Barang
      </router-link>
      <router-link
        to="/category"
        class="px-4 py-2 hover:bg-gray-700"
        :class="{ 'bg-gray-700': $route.path === '/category' }"
      >
        Kategori
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>

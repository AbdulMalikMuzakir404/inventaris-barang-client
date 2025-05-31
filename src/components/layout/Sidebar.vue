<template>
  <aside class="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 z-40 shadow-lg">
    <div class="h-16 flex items-center justify-center border-b border-gray-800 text-xl font-bold">
      Inventaris
    </div>

    <nav class="mt-4 flex flex-col gap-1 px-2">
      <router-link
        v-for="(menu, index) in menus"
        :key="index"
        :to="menu.to"
        class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        :class="{ 'bg-gray-800 font-semibold': route.path === menu.to }"
      >
        <component :is="menu.icon" class="w-5 h-5" />
        <span>{{ menu.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { h } from 'vue'

const BoxIcon = {
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        class: 'w-5 h-5',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M3 7l9-4 9 4-9 4-9-4z',
        }),
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M3 17l9 4 9-4M3 12l9 4 9-4',
        }),
      ],
    )
  },
}

const TagIcon = {
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        class: 'w-5 h-5',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M20 13V6a2 2 0 00-2-2h-5v9h7zM9 21V6a2 2 0 012-2h1v15H9zM4 13v7a2 2 0 002 2h5v-9H4z',
        }),
      ],
    )
  },
}

const menus = [
  { label: 'Barang', to: '/item', icon: BoxIcon },
  { label: 'Kategori', to: '/category', icon: TagIcon },
]

const route = useRoute()
</script>

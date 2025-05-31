<template>
  <nav class="px-6 py-3 mt-2 bg-white border-b border-gray-200 shadow-sm rounded">
    <ol class="flex items-center space-x-2 text-sm text-gray-600">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2">
        <template v-if="index !== breadcrumbs.length - 1">
          <RouterLink
            :to="crumb.to"
            class="text-blue-600 hover:underline capitalize flex items-center gap-1"
          >
            <template v-if="crumb.label === 'Home'">
              <!-- Home Icon -->
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7m-9 14V9m0 0L5 12m14-2l2 2m-2-2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6"
                />
              </svg>
            </template>
            <span>{{ crumb.label }}</span>
          </RouterLink>
          <span>/</span>
        </template>
        <template v-else>
          <span class="text-gray-500 capitalize">{{ crumb.label }}</span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter((p) => p)
  let result = [{ label: 'Home', to: '/' }]
  let fullPath = ''

  paths.forEach((p) => {
    fullPath += '/' + p
    result.push({
      label: mapLabel(p),
      to: fullPath,
    })
  })

  return result
})

function mapLabel(str) {
  const labelMap = {
    item: 'Barang',
    category: 'Kategori',
    list: 'Daftar',
    // tambah mapping di sini jika perlu
  }
  return labelMap[str] || capitalize(str)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

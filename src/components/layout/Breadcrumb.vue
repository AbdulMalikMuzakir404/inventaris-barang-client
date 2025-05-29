<template>
  <nav class="ml-64 px-6 py-3 bg-white border-b border-gray-200">
    <ol class="flex items-center space-x-2 text-sm text-gray-600">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2">
        <template v-if="index !== breadcrumbs.length - 1">
          <RouterLink :to="crumb.to" class="text-blue-600 hover:underline">
            {{ crumb.label }}
          </RouterLink>
          <span>/</span>
        </template>
        <template v-else>
          <span class="text-gray-500">{{ crumb.label }}</span>
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

  let result = []
  let fullPath = ''

  result.push({ label: 'Home', to: '/' })

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
  }
  return labelMap[str] || capitalize(str)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

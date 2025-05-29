<template>
  <div>
    <Sidebar v-if="isAuthenticated" />
    <Header v-if="isAuthenticated" />
    <Breadcrumb v-if="isAuthenticated" />

    <main :class="{ 'ml-64': isAuthenticated, 'ml-0': !isAuthenticated }" class="mt-3 p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Breadcrumb from './components/layout/Breadcrumb.vue'

const isAuthenticated = ref(!!localStorage.getItem('token'))

watch(isAuthenticated, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    console.log('Login status changed:', newValue ? 'Logged In' : 'Logged Out')
  }
})
</script>

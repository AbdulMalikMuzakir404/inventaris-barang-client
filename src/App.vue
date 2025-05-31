<template>
  <div>
    <!-- Sidebar tetap fixed -->
    <Sidebar v-if="isAuthenticated" />

    <!-- Header tetap fixed -->
    <Header v-if="isAuthenticated" />

    <!-- Toast floating -->
    <Toast
      v-if="toast.message"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />

    <!-- Main Content -->
    <main :class="[isAuthenticated ? 'ml-64 pt-16' : 'ml-0', 'p-4']">
      <!-- Breadcrumb sekarang akan terlihat -->
      <Breadcrumb v-if="isAuthenticated" />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Breadcrumb from './components/layout/Breadcrumb.vue'
import Toast from './components/ui/Toast.vue'

const store = useStore()

const isAuthenticated = computed(() => store.getters['auth/isLoggedIn'])
const toast = computed(() => store.state.toast || {})
</script>

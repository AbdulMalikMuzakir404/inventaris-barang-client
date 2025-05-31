<template>
  <header
    class="fixed top-0 left-64 right-0 h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 z-30"
  >
    <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">
        👋 Selamat datang, <strong>{{ userName }}</strong>
      </span>
      <button
        @click="handleLogout"
        class="inline-flex items-center gap-2 px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-11V4m-6 16h6a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters['auth/getUser'])
const userName = computed(() => user.value?.nama || '-')

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>

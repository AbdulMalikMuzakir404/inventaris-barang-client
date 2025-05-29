<template>
  <header class="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm ml-64">
    <h1 class="text-xl font-semibold">Dashboard</h1>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">Welcome, {{ userName }}</span>
      <button @click="handleLogout" class="bg-blue-500 text-white px-3 py-1 rounded">Logout</button>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['getUser']),
    userName() {
      return this.getUser?.nama || '-'
    },
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    },
  },
}
</script>

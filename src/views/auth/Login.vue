<template>
  <div class="max-w-sm mx-auto mt-10">
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="username" class="block">Username</label>
        <input v-model="username" type="text" id="username" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label for="password" class="block">Password</label>
        <input v-model="password" type="password" id="password" class="w-full p-2 border rounded" />
      </div>
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Login</button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Belum punya akun?
      <router-link to="/register" class="text-blue-500 hover:underline">Daftar di sini</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password,
        })

        this.$store.dispatch('toast/showToast', {
          message: 'Login berhasil!',
          type: 'success',
          duration: 3000,
        })

        this.$router.push('/item')
      } catch (error) {
        const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
        this.$store.dispatch('toast/showToast', {
          message,
          type: 'error',
          duration: 5000,
        })
      }
    },
  },
}
</script>

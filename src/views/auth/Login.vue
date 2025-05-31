<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-sm p-8 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800">Login ke Aplikasi</h1>
        <p class="text-sm text-gray-500 mt-1">Silakan masuk dengan akun Anda</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Masukkan username"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Masukkan password"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p class="text-center text-sm text-gray-600">
        Belum punya akun?
        <router-link to="/register" class="text-blue-500 hover:underline"
          >Daftar di sini</router-link
        >
      </p>
    </div>
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

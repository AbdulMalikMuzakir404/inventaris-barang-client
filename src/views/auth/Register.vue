<template>
  <div class="max-w-sm mx-auto mt-10">
    <form @submit.prevent="register">
      <div class="mb-4">
        <label for="nama" class="block">Nama</label>
        <input v-model="form.nama" type="text" id="nama" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label for="username" class="block">Username</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block">Email</label>
        <input v-model="form.email" type="email" id="email" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label for="password" class="block">Password</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label for="confirmPassword" class="block">Konfirmasi Password</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          id="confirmPassword"
          class="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Register</button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Sudah punya akun?
      <router-link to="/login" class="text-blue-500 hover:underline">Login di sini</router-link>
    </p>
  </div>
</template>

<script>
import api from '@/utils/axios'

export default {
  data() {
    return {
      form: {
        nama: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        this.$emit('show-toast', 'Password dan konfirmasi tidak cocok', 'error', 5000)
        return
      }

      try {
        const response = await api.post('/auth/register', {
          nama: this.form.nama,
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          confirmPassword: this.form.confirmPassword,
        })

        this.$emit('show-toast', 'Registrasi berhasil!', 'success', 3000)
        this.$router.push('/login')
      } catch (error) {
        console.error(error)
        const message = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
        this.$emit('show-toast', message, 'error', 5000)
      }
    },
  },
}
</script>

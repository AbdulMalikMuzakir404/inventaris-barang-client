<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-sm p-8 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800">Daftar Akun</h1>
        <p class="text-sm text-gray-500 mt-1">Silakan isi form untuk membuat akun baru</p>
      </div>

      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label for="nama" class="block text-sm font-medium text-gray-700">Nama</label>
          <input
            v-model="form.nama"
            id="nama"
            type="text"
            placeholder="Nama lengkap"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            placeholder="Username unik"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            placeholder="you@example.com"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            placeholder="******"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Konfirmasi Password</label
          >
          <input
            v-model="form.confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Daftar
        </button>
      </form>

      <p class="text-center text-sm text-gray-600">
        Sudah punya akun?
        <router-link to="/login" class="text-blue-500 hover:underline">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const form = reactive({
  nama: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const register = async () => {
  if (form.password !== form.confirmPassword) {
    store.dispatch('toast/showToast', {
      message: 'Password dan konfirmasi tidak cocok',
      type: 'error',
      duration: 4000,
    })
    return
  }

  try {
    await store.dispatch('auth/register', {
      nama: form.nama,
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    })

    store.dispatch('toast/showToast', {
      message: 'Registrasi berhasil! Silakan login.',
      type: 'success',
      duration: 3000,
    })

    router.push('/login')
  } catch (error) {
    const message = store.getters['auth/authError'] || 'Registrasi gagal. Silakan coba lagi.'
    store.dispatch('toast/showToast', {
      message,
      type: 'error',
      duration: 4000,
    })
    console.error('Register Error:', error)
  }
}
</script>

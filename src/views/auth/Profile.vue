<template>
  <div class="max-w-xl mx-auto mt-10 space-y-10">
    <!-- Ubah Profil -->
    <div class="space-y-3">
      <h2 class="text-xl font-bold">Ubah Profil</h2>
      <form @submit.prevent="submitProfile" class="space-y-4">
        <input v-model="profile.nama" class="input" placeholder="Nama" />
        <input v-model="profile.username" class="input" placeholder="Username" />
        <input v-model="profile.email" class="input" placeholder="Email" type="email" />
        <button class="btn">Simpan</button>
      </form>
    </div>

    <!-- Ubah Password -->
    <div class="space-y-3 border-t pt-5">
      <h2 class="text-xl font-bold">Ubah Password</h2>
      <form @submit.prevent="submitPassword" class="space-y-4">
        <input
          v-model="password.oldPassword"
          class="input"
          type="password"
          placeholder="Password Lama"
        />
        <input
          v-model="password.newPassword"
          class="input"
          type="password"
          placeholder="Password Baru"
        />
        <input
          v-model="password.confirmPassword"
          class="input"
          type="password"
          placeholder="Konfirmasi Password"
        />
        <button class="btn bg-red-500 hover:bg-red-600">Ganti Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const profile = reactive({
  nama: '',
  username: '',
  email: '',
})

const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const submitProfile = async () => {
  try {
    const res = await store.dispatch('auth/updateProfile', profile)
    store.dispatch('toast/showToast', {
      message: res.message || 'Profil berhasil diperbarui',
      type: 'success',
      duration: 3000,
    })
  } catch (err) {
    store.dispatch('toast/showToast', {
      message: err?.response?.data?.message || 'Gagal memperbarui profil',
      type: 'error',
      duration: 4000,
    })
  }
}

const submitPassword = async () => {
  if (password.newPassword !== password.confirmPassword) {
    store.dispatch('toast/showToast', {
      message: 'Konfirmasi password tidak cocok',
      type: 'error',
      duration: 4000,
    })
    return
  }

  try {
    const res = await store.dispatch('auth/updatePassword', password)
    store.dispatch('toast/showToast', {
      message: res.message || 'Password berhasil diubah',
      type: 'success',
      duration: 3000,
    })
    Object.assign(password, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  } catch (err) {
    store.dispatch('toast/showToast', {
      message: err?.response?.data?.message || 'Gagal mengubah password',
      type: 'error',
      duration: 4000,
    })
  }
}

onMounted(async () => {
  await store.dispatch('auth/fetchProfile')
  const user = store.getters['auth/getUser']
  Object.assign(profile, {
    nama: user?.nama || '',
    username: user?.username || '',
    email: user?.email || '',
  })
})
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
  @apply px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition;
}
</style>

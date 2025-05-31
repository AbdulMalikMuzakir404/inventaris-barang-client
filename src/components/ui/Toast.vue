<template>
  <div
    v-if="visible"
    class="fixed top-4 right-4 w-80 p-4 bg-green-500 text-white rounded-lg shadow-lg transition-opacity duration-300"
    :class="toastClasses"
  >
    <p class="text-sm">{{ message }}</p>
    <button @click="closeToast" class="absolute top-0 right-0 px-2 py-1 text-white">✖</button>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const visible = ref(true)

const toastClasses = computed(() => {
  return {
    'bg-green-500': props.type === 'success',
    'bg-red-500': props.type === 'error',
    'bg-yellow-500': props.type === 'warning',
    'bg-blue-500': props.type === 'info',
  }
})

const closeToast = () => {
  visible.value = false
}

watchEffect(() => {
  setTimeout(() => {
    visible.value = false
  }, props.duration)
})
</script>

<style scoped>
.fixed {
  z-index: 9999;
}
button {
  cursor: pointer;
  background: transparent;
  border: none;
}
</style>

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { validateToken } from './utils/axios'

import './assets/style.css'

validateToken().then((valid) => {
  if (valid) {
    store.commit('auth/SET_AUTH', {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user')),
    })
  }
  createApp(App).use(store).use(router).mount('#app')
})

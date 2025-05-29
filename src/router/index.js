import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Item from '../views/item/ItemList.vue'
import Category from '../views/category/CategoryList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/item',
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true },
    },
    {
      path: '/item',
      name: 'Item',
      component: Item,
      meta: { requiresAuth: true },
    },
    {
      path: '/category',
      name: 'Category',
      component: Category,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

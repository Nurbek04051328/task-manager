// src/router/index.ts
import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from 'stores/user'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes
  })

  // Global navigation guard
  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    const isLoggedIn = !!userStore.username
    const authRequiredRoutes = ['/tasks']  // Qaysi sahifalar login talab qiladi

    if (authRequiredRoutes.includes(to.path) && !isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  })

  return Router
})

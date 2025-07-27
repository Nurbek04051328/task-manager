// src/router/routes.ts
import MainLayout from 'layouts/MainLayout.vue'
import LoginPage from 'pages/LoginPage.vue'
import TaskBoard from 'pages/TaskBoard.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/tasks',
    component: MainLayout,
    children: [
      {
        path: '',
        component: TaskBoard
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
]

export default routes

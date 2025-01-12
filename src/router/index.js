import LogIn from '@/views/LogIn.vue'
import SignUp from '@/views/SignUp.vue'
import GenericDashboard from '@/views/GenericDashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: GenericDashboard,
    },
  ],
})

export default router

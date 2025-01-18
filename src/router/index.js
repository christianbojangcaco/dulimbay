import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/LogIn.vue'
import SignUp from '@/views/SignUp.vue'
import NavBar from '@/views/NavBar.vue'
import MemberDashboard from '@/views/MemberDashboard.vue'
import OfficerSecretaryDashboard from '@/views/OfficerSecretaryDashboard.vue'
import OfficerPresidentDashboard from '@/views/OfficerPresidentDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

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
      path: '/navbar',
      name: 'navbar',
      component: NavBar,
    },
    {
      path: '/dashboard/member',
      name: 'memberDashboard',
      component: MemberDashboard,
    },
    {
      path: '/dashboard/officer-secretary',
      name: 'officerSecretaryDashboard',
      component: OfficerSecretaryDashboard,
    },
    {
      path: '/dashboard/officer-president',
      name: 'officerPresidentDashboard',
      component: OfficerPresidentDashboard,
    },
    {
      path: '/dashboard/admin',
      name: 'adminDashboard',
      component: AdminDashboard,
    },
  ],
})

export default router

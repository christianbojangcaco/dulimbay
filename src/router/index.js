import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/LogIn.vue'
import SignUp from '@/views/SignUp.vue'
import NavBar from '@/components/NavBar.vue'
import MemberDashboard from '@/views/MemberDashboard.vue'
import OfficerDashboard from '@/views/OfficerDashboard.vue'
import OfficerSecretaryDashboard from '@/views/OfficerSecretaryDashboard.vue'
import OfficerPresidentDashboard from '@/views/OfficerPresidentDashboard.vue'
import OfficerTreasurerDashboard from '@/views/OfficerTreasurerDashboard.vue'
import OfficerCostumeCustodianDashboard from '@/views/OfficerCostumeCustodianDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import FooterBar from '@/components/FooterBar.vue'

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
      path: '/MemberDashboard',
      name: 'memberDashboard',
      component: MemberDashboard,
    },
    {
      path: '/OfficerSecretaryDashboard',
      name: 'officerSecretaryDashboard',
      component: OfficerSecretaryDashboard,
    },
    {
      path: '/OfficerPresidentDashboard',
      name: 'officerPresidentDashboard',
      component: OfficerPresidentDashboard,
    },
    {
      path: '/OfficerTreasurerDashboard',
      name: 'officerTreasurerDashboard',
      component: OfficerTreasurerDashboard,
    },
    {
      path: '/OfficerCostumeCustodianDashboard',
      name: 'officerCostumeCustodianDashboard',
      component: OfficerCostumeCustodianDashboard,
    },
    {
      path: '/AdminDashboard',
      name: 'adminDashboard',
      component: AdminDashboard,
    },
    {
      path: '/footerbar',
      name: 'footerbar',
      component: FooterBar,
    },
    {
      path: '/OfficerDashboard',
      name: 'officerdashboard',
      component: OfficerDashboard,
    },
  ],
})

export default router

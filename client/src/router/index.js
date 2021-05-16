import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AcceptInvite from '../views/AcceptInvite.vue'
import ConnectFour from '../views/games/ConnectFour.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connect-four',
    name: 'ConnectFour',
    component: ConnectFour
  },
  {
    path: '/invite/:id',
    component: AcceptInvite,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

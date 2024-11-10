import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'
import HomePage from '@/views/home/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/planet',
    name: 'Planet',
    component: () => import('@/views/planet/PlanetPage.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/ChatPage.vue'),
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/views/user/RankPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes],
})

router.beforeEach((to, _, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('token')) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router

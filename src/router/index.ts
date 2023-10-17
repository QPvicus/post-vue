import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
import { useUserStore } from '@/stores'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [{ path: '', name: 'Home', component: Home, meta: { title: '欢迎来到绘海报' } }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: { redirectAlreadyLogin: true, title: '登录到绘海报' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return Promise.resolve({ left: 0, top: 0 })
    }
  }
})

// 白名单
const whiteList = ['/login', '/login/back']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const store = useUserStore()
  const { requiredLogin, redirectAlreadyLogin, title } = to.meta
  if (title) {
    //@ts-expect-error: 1
    document.title = title
  }
  if (!store.user.isLogin) {
    if (store.user.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${store.user.token}`
    }
  }
  next()
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}`
  NProgress.done()
})

export default router

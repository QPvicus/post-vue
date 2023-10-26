import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
import MyWork from '@/views/my-work.vue'
import Setting from '@/views/setting.vue'
import TemplateDetail from '@/views/template-detail.vue'
import { useUserStore } from '@/stores'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      { path: '', name: 'Home', component: Home, meta: { title: '欢迎来到绘海报' } },
      {
        path: 'mywork',
        name: 'MyWork',
        component: MyWork,
        meta: { requiredLogin: true, title: '我的设计列表' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: Setting,
        meta: { requiredLogin: true, title: '我的信息' }
      },
      {
        path: '/template/:id',
        name: 'TemplateDetail', component: TemplateDetail, meta: { title: '模版详情' } name: ''
      }
    ]
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import('@/views/editor.vue'),
    meta: { requiredLogin: true, title: '编辑我的设计' }
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

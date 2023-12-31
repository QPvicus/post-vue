import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import { registerComponent } from '@/components'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './main.css'
import 'normalize.css'
import 'reset-css'
import 'element-plus/dist/index.css'
import 'cropperjs/dist/cropper.css'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'
// @ts-expect-error: 1
import lego from 'lego-components'
import 'lego-components/dist/lego-components.css'
import axios from 'axios'

export const baseBackendURL = `https://api.imooc-lego.com`

// axios.defaults.baseURL = `https://api.imooc-lego.com`
axios.defaults.baseURL = `http://localhost:3000/api`

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
registerComponent(app)
app.use(router)
app.use(pinia)
app.use(lego)
app.use(ElementPlus)
app.mount('#app')

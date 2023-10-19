import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import { registerComponent } from '@/components'
// @ts-expect-error: 1
import lego from 'lego-components'
import 'lego-components/dist/lego-components.css'
const app = createApp(App)
// registerComponent(app)
app.use(router)
app.use(pinia)
app.use(lego)
app.mount('#app')

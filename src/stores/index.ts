import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

export * from './modules/user'
export * from './modules/status'
export * from './modules/component'
export * from './modules/work'

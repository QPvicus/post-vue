import hotkeys from 'hotkeys-js'
import type { KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'

export interface Options {
  scope?: string
  element?: HTMLElement | null
  keyup?: boolean | null
  keydown?: boolean | null
  capture?: boolean
  splitKey?: string
}

hotkeys.filter = () => {
  return true
}

export function useHotKey(key: string, callback: KeyHandler, options: Options = {}) {
  onMounted(() => hotkeys(key, options, callback))
  onUnmounted(() => hotkeys.unbind(key, callback))
}

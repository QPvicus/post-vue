import type { App, Component } from 'vue'
import LImage from './l-image.vue'
import LShape from './l-shape.vue'
import LText from './l-text.vue'

const components: Record<string, Component> = {
  'l-image': LImage,
  'l-shape': LShape,
  'l-text': LText
}

export function registerComponent(app: App) {
  for (const key in components) {
    app.component(key, components[key])
  }
}

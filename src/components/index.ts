import type { App, Component } from 'vue'
import TextareaFix from './editor/textarea-fix.vue'
import ColorPicker from './color-picker.vue'
import SvgIcon from './svg-icon.vue'
import IconSwitch from './icon-switch.vue'
import ShadowPicker from './shadow-picker.vue'
import Uploader from './uploader.vue'
import ImageProcess from './image-process.vue'
import BackgroundProcessor from './background-processor.vue'
import StyledUploader from './styled-uploader.vue'
import PublishForm from './publish-form.vue'
const components: Record<string, Component> = {
  'textarea-fix': TextareaFix,
  'color-picker': ColorPicker,
  'svg-icon': SvgIcon,
  'icon-switch': IconSwitch,
  'shadow-picker': ShadowPicker,
  uploader: Uploader,
  'image-process': ImageProcess,
  'background-processor': BackgroundProcessor,
  'styled-uploader': StyledUploader,
  'publish-form': PublishForm
}

export function registerComponent(app: App) {
  for (const key in components) {
    app.component(key, components[key])
  }
}

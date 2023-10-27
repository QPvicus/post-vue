import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { ComponentData, EditProps } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { isUndefined } from 'lodash'

let globalTimeout = 0
let cachedOldValue: any
const debounceChange = (cachedValue: any, cb: () => void, timeout = 1000) => {
  if (globalTimeout) clearInterval(globalTimeout)
  if (isUndefined(cachedOldValue)) cachedOldValue = cachedValue
  globalTimeout = setTimeout(() => {
    cb()
    cachedOldValue = undefined
    globalTimeout = 0
  }, timeout)
}

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px'
}

export const useComponentStore = defineStore('post-component', () => {
  const editor = reactive<EditProps>({
    components: [],
    page: { props: pageDefaultProps, setting: {} },
    currentElement: '',
    isChangedNotPublished: false,
    isDirty: false,
    currentEditing: '',
    channels: [],
    histories: [],
    historyIndex: -1
  })

  function resetEditor() {
    editor.components = []
    editor.page = { props: pageDefaultProps, setting: {} }
    editor.histories = []
    editor.isDirty = false
    editor.isChangedNotPublished = false
  }

  function addComponentToEditor(component: ComponentData) {
    component.id = uuidv4()
    component.layerName = `图层${editor.components.length + 1}`
    editor.components.push(component)
  }

  function updateComponent(data: any) {
    const { id, isProps, key, value } = data
    const updatedComponent = editor.components.find(
      (c) => c.id === (id || editor.currentElement)
    ) as any
    if (updatedComponent) {
      if (isProps) {
        const oldValue = Array.isArray(key)
          ? key.map((k: string) => updatedComponent.props[k])
          : updatedComponent.props[key]

        debounceChange(oldValue, () => {})
        if (Array.isArray(key)) {
          key.forEach((k, idx) => {
            updatedComponent.props[k] = value[idx]
          })
        } else {
          updatedComponent.props[key] = value
        }
      } else {
        updatedComponent[key] = value
      }

      editor.isDirty = true
      editor.isChangedNotPublished = true
    }
  }

  function updatePage(data: any) {
    const { key, value, level } = data
    if (level) {
      if (level === 'props') {
        // @ts-ignore
        const oldValue = editor.page[level][key]
        debounceChange(oldValue, () => {})
        // @ts-ignore
        editor.page[level][key] = value
      }
    } else {
      // @ts-ignore
      editor.page[key] = value
    }
    editor.isDirty = true
    editor.isChangedNotPublished = true
  }

  function setActive(id: string) {
    editor.currentElement = id
  }

  function setEditing(id: string) {
    editor.currentEditing = id
  }

  async function getWork(id: string) {
    const tm = {
      _id: '653b0c5cb750ee0fbd3028df',
      isTemplate: false,
      copiedCount: 0,
      status: 1,
      channels: [],
      title: '未命名作品',
      desc: '未命名作品',
      coverImg:
        'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png',
      user: '65276d463c02c3488c82e694',
      author: '13175087561',
      uuid: 'NpgrJZ',
      createdAt: '2023-10-27T01:03:24.776Z',
      updatedAt: '2023-10-27T01:03:24.776Z',
      id: 6243,
      __v: 0
    }
    const data = await new Promise((resolve) => {
      resolve(tm)
    })
    //@ts-ignore
    const { content, ...rest } = data
    editor.page = { ...editor.page, ...rest }
    if (content && content.props) {
      editor.page.props = { ...editor.page.props, ...content.props }
    }
    if (content && content.setting) {
      editor.page.setting = { ...editor.page.setting, ...content.setting }
    }
    editor.components = content.components
    return data
  }

  return {
    editor,
    addComponentToEditor,
    updateComponent,
    setActive,
    setEditing,
    updatePage,
    resetEditor,
    getWork
  }
})

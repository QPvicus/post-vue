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
    currentEditing: ''
  })

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
        updatedComponent.props[key] = value
      }

      editor.isDirty = true
      editor.isChangedNotPublished = true
    }
  }

  function setActive(id: string) {
    editor.currentElement = id
  }

  function setEditing(id: string) {
    editor.currentEditing = id
  }

  return { editor, addComponentToEditor, updateComponent, setActive, setEditing }
})

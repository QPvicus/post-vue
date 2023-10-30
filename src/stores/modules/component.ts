import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import type { ComponentData, EditProps, HistoryProps } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, isUndefined } from 'lodash'
import { insertAt } from '@/utils'
import type { MoveDirection } from '@/plugins/dataOperations'

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

const modifyHistory = (
  editor: ReturnType<typeof reactive<EditProps>>,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  if (!componentId) {
    editor.page.props[key] = type === 'undo' ? oldValue : newValue
  } else {
    const updatedComponent = editor.components.find((c) => c.id === componentId) as any
    if (Array.isArray(key)) {
      key.forEach((keyName: string, index) => {
        updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[key] = type === 'undo' ? oldValue : newValue
    }
  }
}

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px'
}

const maxHistoryNumber = 20
const pushHistory = (
  editor: ReturnType<typeof reactive<EditProps>>,
  historyRecord: HistoryProps
) => {
  if (editor.historyIndex != -1) {
    editor.histories = editor.histories.slice(0, editor.historyIndex)
    editor.historyIndex = -1
  }

  if (editor.histories.length < maxHistoryNumber) {
    editor.histories.push(historyRecord)
  } else {
    editor.histories.shift()
    editor.histories.push(historyRecord)
  }
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

  const checkUndoDisable = computed(() => {
    return editor.histories.length === 0 || editor.historyIndex === 0
  })

  const checkRedoDisable = computed(() => {
    return (
      editor.histories.length === 0 ||
      editor.historyIndex === editor.histories.length ||
      editor.historyIndex === -1
    )
  })

  function undo() {
    if (editor.historyIndex === -1) {
      editor.historyIndex = editor.histories.length - 1
    } else {
      editor.historyIndex--
    }

    const history = editor.histories[editor.historyIndex]
    switch (history.type) {
      case 'add':
        editor.components = editor.components.filter((c) => c.id != history.componentId)
        break
      case 'delete':
        editor.components = insertAt(editor.components, history.index as number, history.data)
        break
      case 'modify':
        modifyHistory(editor, history, 'undo')
        break
      default:
        break
    }
  }

  function redo() {
    if (editor.historyIndex === -1) {
      return
    }

    const history = editor.histories[editor.historyIndex]
    switch (history.type) {
      case 'add':
        editor.components.push(history.data)
        break
      case 'delete':
        editor.components = editor.components.filter((c) => c.id != history.componentId)
        break
      case 'modify':
        modifyHistory(editor, history, 'redo')
        break
      default:
        break
    }

    editor.historyIndex++
  }

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
    pushHistory(editor, {
      id: uuidv4(),
      componentId: component.id,
      type: 'add',
      data: cloneDeep(component)
    })
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

        debounceChange(oldValue, () => {
          pushHistory(editor, {
            id: uuidv4(),
            componentId: id || editor.currentElement,
            type: 'modify',
            data: { oldValue: cachedOldValue, newValue: value, key }
          })
        })
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
        debounceChange(oldValue, () => {
          pushHistory(editor, {
            id: uuidv4(),
            type: 'modify',
            data: { oldValue: cachedOldValue, newValue: value, key }
          })
        })
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
    if (content && content.components) {
      editor.components = content.components
    }
    return data
  }

  async function saveWork(payload: any) {
    const { id, data } = payload
    if (data) {
      //
    } else {
      const { title, desc, props, coverImg, setting } = editor.page
      const postData = {
        title,
        desc,
        coverImg,
        content: {
          components: editor.components,
          props,
          setting
        }
      }

      await new Promise((resolve) => resolve(1))
      // post api  works/id
      editor.isDirty = false
      editor.page.updatedAt = new Date().toISOString()
    }
  }

  function moveComponent(data: { direction: MoveDirection; amount: number }) {
    const updatedComponent = editor.components.find((c) => c.id === editor.currentElement)
    if (updatedComponent) {
      const oldTop = parseInt(updatedComponent.props.top)
      const oldLeft = parseInt(updatedComponent.props.left)
      const { direction, amount } = data
      switch (direction) {
        case 'Down': {
          const newVal = oldTop + amount + 'px'
          updateComponent({ key: 'top', value: newVal, isProps: true })
          break
        }
        case 'Left': {
          const newVal = oldLeft - amount + 'px'
          updateComponent({ key: 'left', value: newVal, isProps: true })
          break
        }
        case 'Right': {
          const newVal = oldLeft + amount + 'px'
          updateComponent({ key: 'left', value: newVal, isProps: true })
          break
        }
        case 'Up': {
          const newVal = oldTop - amount + 'px'
          updateComponent({ key: 'top', value: newVal, isProps: true })
          break
        }
        default:
          break
      }
    }
  }

  function deleteComponent(id: string) {
    const componentData = editor.components.find((c) => c.id === id) as ComponentData
    const componentIndex = editor.components.findIndex((c) => c.id === id)
    editor.components = editor.components.filter((c) => c.id !== id)
    pushHistory(editor, {
      id: uuidv4(),
      componentId: componentData.id,
      type: 'delete',
      data: componentData,
      index: componentIndex
    })
    editor.isDirty = true
    editor.isChangedNotPublished = true
  }

  function copyComponent(id: string) {
    const currentComponent = editor.components.find((component) => component.id === id)
    if (currentComponent) {
      editor.copiedComponent = currentComponent
    }
  }

  function pastCopiedComponent() {
    if (editor.copiedComponent) {
      const clone = cloneDeep(editor.copiedComponent)
      clone.id = uuidv4()
      clone.layerName = clone.layerName + '副本'
      editor.components.push(clone)
      editor.isDirty = true
      editor.isChangedNotPublished = true
      pushHistory(editor, {
        id: uuidv4(),
        componentId: clone.id,
        type: 'add',
        data: cloneDeep(clone)
      })
    }
  }

  return {
    editor,
    addComponentToEditor,
    updateComponent,
    setActive,
    setEditing,
    updatePage,
    resetEditor,
    getWork,
    saveWork,
    checkRedoDisable,
    checkUndoDisable,
    undo,
    redo,
    moveComponent,
    deleteComponent,
    copyComponent,
    pastCopiedComponent
  }
})

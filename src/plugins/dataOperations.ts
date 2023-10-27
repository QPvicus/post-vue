import { useComponentStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { computed, type ComputedRef, type Ref } from 'vue'

interface OperationText {
  text: string
  shortcut: string
}

export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export default function dataOperations(componentId: ComputedRef<string> | Ref<string>) {
  const editorStore = useComponentStore()
  return {
    copy: () => {
      if (componentId.value) {
        editorStore.copyComponent(componentId.value)
        ElMessage({
          message: '已拷贝当前图层',
          duration: 1000
        })
      }
    },
    paste: () => {
      if (componentId.value && editorStore.editor.copiedComponent) {
        editorStore.pastCopiedComponent()
        ElMessage({
          message: '已粘贴当前图层',
          duration: 1000
        })
      }
    },
    delete: () => {
      if (componentId.value) editorStore.deleteComponent(componentId.value)
      ElMessage({
        message: '删除图层成功',
        duration: 1000
      })
    },
    cancel: () => {
      if (componentId.value) {
        editorStore.setActive('')
      }
    },
    undo: () => {
      const undoIsDisabled = computed(() => editorStore.checkUndoDisable)
      if (!undoIsDisabled.value) {
        editorStore.undo()
      }
    },
    redo: () => {
      const redoIsDisabled = computed(() => editorStore.checkRedoDisable)
      if (!redoIsDisabled.value) editorStore.redo()
    },
    move: (direction: MoveDirection, amount: number) => {
      if (componentId.value) {
        editorStore.moveComponent({ direction, amount })
      }
    }
  }
}

export const operationText: Record<string, OperationText> = {
  copy: {
    text: '拷贝图层',
    shortcut: '⌘C / Ctrl+C'
  },
  paste: {
    text: '粘贴图层',
    shortcut: '⌘V / Ctrl+V'
  },
  delete: {
    text: '删除图层',
    shortcut: 'Backspace / Delete'
  },
  cancel: {
    text: '取消选中',
    shortcut: 'ESC'
  },
  undo: {
    text: '撤销',
    shortcut: '⌘Z / Ctrl+Z'
  },
  redo: {
    text: '重做',
    shortcut: '⌘⇧Z / Ctrl+Shift+Z'
  },
  move: {
    text: '上下左右移动一像素',
    shortcut: '↑ ↓ → ←'
  },
  moveTen: {
    text: '上下左右移动十像素',
    shortcut: 'Shift + ↑ ↓ → ←'
  }
}

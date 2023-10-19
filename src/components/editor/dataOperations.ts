interface OperationText {
  text: string
  shortcut: string
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

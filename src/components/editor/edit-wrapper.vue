<script lang="ts" setup>
import { useStylePick } from '@/hooks'
import { nextTick, reactive, ref } from 'vue'

interface EditWrapperProps {
  id: string
  active?: boolean
  editing?: string
  props?: Record<string, any>
}
const props = defineProps<EditWrapperProps>()
const emit = defineEmits(['update-position', 'active'])
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}

const editWrapper = ref<HTMLElement>()
const moveWrapper = ref<HTMLElement>()

const styleProps = useStylePick(props.props || {}, ['position', 'top', 'left', 'width', 'height'])
function calculateSize(e: MouseEvent, direction: ResizeDirection, position: OriginalPositions) {
  const { left, right, top, bottom } = position
  const { pageX, pageY } = e
  const container = document.getElementById('canvas-area') as HTMLElement
  const rightWidth = pageX - left
  const bottomHeight = pageY - top
  const leftWidth = right - pageX
  const topHeight = bottom - pageY
  const leftOffset = pageX - container.offsetLeft
  const topOffset = pageY - container.offsetTop + container.scrollTop
  switch (direction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: topOffset,
        left: leftOffset
      }
    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset
      }
    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset
      }
    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight
      }
    default:
      break
  }
}

let size: any
const startResize = (event: Event, type: ResizeDirection) => {
  const currentElement = editWrapper.value as HTMLElement
  const moveElement = moveWrapper.value as HTMLElement
  const currentComponent = moveElement.firstElementChild as HTMLElement
  const resizeElements = [currentElement, currentComponent]
  const { left, top, bottom, right } = currentElement.getBoundingClientRect()
  const handleMove = (e: MouseEvent) => {
    if (currentElement) {
      size = calculateSize(e, type, { left, top, bottom, right })
      resizeElements.forEach((ele) => {
        const { style } = ele
        if (size) {
          if (size.left) style.left = size.left + 'px'
          if (size.top) style.top = size.top + 'px'
          style.width = size.width + 'px'
          style.height = size.height + 'px'
        }
      })
    }
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMove)
    emit('update-position', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

let isMoving = false
const gap = reactive({
  x: 0,
  y: 0
})

function calculatePosition(e: MouseEvent) {
  const container = document.getElementById('canvas-area') as HTMLElement
  const left = e.clientX - container.offsetLeft - gap.x
  const top = e.clientY - container.offsetTop - gap.y + container.scrollTop
  return {
    left,
    top
  }
}
const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value as HTMLElement
  gap.x = e.clientX - currentElement.getBoundingClientRect().left
  gap.y = e.clientY - currentElement.getBoundingClientRect().top
  const handleMove = (e: MouseEvent) => {
    isMoving = true
    const { left, top } = calculatePosition(e)
    currentElement.style.top = top + 'px'
    currentElement.style.left = left + 'px'
  }
  const handleMouseUp = (e: MouseEvent) => {
    const { left, top } = calculatePosition(e)
    document.removeEventListener('mousemove', handleMove)
    if (isMoving) {
      emit('update-position', { left, top, id: props.id })
      isMoving = false
    }
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function itemClick() {
  emit('active', props.id)
}
</script>

<template>
  <div
    class="edit-wrapper"
    :class="{ active }"
    ref="editWrapper"
    :style="styleProps"
    @click="itemClick"
  >
    <div class="move-wrapper" ref="moveWrapper" @mousedown="startMove">
      <slot />
    </div>
    <div class="resizers">
      <div class="resizer top-left" @mousedown="startResize($event, 'top-left')"></div>
      <div class="resizer top-right" @mousedown="startResize($event, 'top-right')"></div>
      <div class="resizer bottom-left" @mousedown="startResize($event, 'bottom-left')"></div>
      <div class="resizer bottom-right" @mousedown="startResize($event, 'bottom-right')"></div>
    </div>
  </div>
</template>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: border-box;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .l-text-component,
.edit-wrapper .l-image-component,
.edit-wrapper .l-shape-component {
  position: static !important;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #1890ff;
  position: absolute;
  display: block;
  box-sizing: border-box;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>

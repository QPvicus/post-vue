<script lang="ts" setup>
import dataOperations, { operationText } from '@/plugins/dataOperations'
import { clickInsideElement } from '@/utils'
import { map, pick } from 'lodash'
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['on-select'])
const menuRef = ref<HTMLElement>()
const componentId = ref('')
const operations = pick(dataOperations(componentId), ['copy', 'paste', 'delete', 'cancel'])
const actions = map(operations, (val, key) => {
  return {
    key,
    action: val
  }
})

const triggerContextMenu = (e: MouseEvent) => {
  const domEle = menuRef.value as HTMLElement
  e.preventDefault()
  const wrapperElement = clickInsideElement(e, 'edit-wrapper')
  if (wrapperElement) {
    domEle.style.display = 'block'
    domEle.style.top = e.pageY + 'px'
    domEle.style.left = e.pageX + 'px'
    const cid = wrapperElement.dataset.componentId
    if (cid) {
      componentId.value = cid
      emit('on-select', wrapperElement.dataset.componentId)
    }
  }
}

const handleClick = () => {
  const domEle = menuRef.value as HTMLElement
  domEle.style.display = 'none'
}

onMounted(() => {
  document.addEventListener('contextmenu', triggerContextMenu)
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', triggerContextMenu)
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <el-menu style="width: 220px">
      <el-menu-item v-for="action in actions" :key="action.key" @click="action.action()">
        <span class="item-text">{{ operationText[action.key].text }}</span>
        <span class="item-shortcut">{{ operationText[action.key].shortcut }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
}
.menu-container ::v-deep(.el-menu-item) {
  display: flex;
  justify-content: space-between;
  height: 40px;
}
.menu-container .el-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>

<script lang="ts" setup>
import type { ComponentData } from '@/stores/types'
import { View, Hide, Lock, Unlock } from '@element-plus/icons-vue'
import InputEdit from './input-edit.vue'
const props = withDefaults(
  defineProps<{
    list: ComponentData[]
    selectedId: string
  }>(),
  {
    selectedId: ''
  }
)
const emit = defineEmits(['change', 'select'])
function handleClick(id: string) {
  emit('select', id)
}

function handleChange(id: string, key: string, value: any) {
  const data = { id, key, value }
  emit('change', data)
}
</script>

<template>
  <div class="">
    <li
      class="list-item"
      v-for="item in list"
      :key="item.id"
      :class="{ active: item.id === selectedId }"
      @click="handleClick(item.id)"
    >
      <el-tooltip placement="top" :content="item.isHidden ? '显示' : '隐藏'">
        <el-button circle :icon="item.isHidden ? View : Hide" />
      </el-tooltip>
      <el-tooltip placement="top" :content="item.isLocked ? '解锁' : '锁定'">
        <el-button circle :icon="item.isLocked ? Unlock : Lock" />
      </el-tooltip>
      <input-edit
        :value="item.layerName!"
        @clicked="handleClick"
        @change="(val) => handleChange(item.id, 'layerName', val)"
      >
        <div>{{ item.layerName }}</div>
      </input-edit>
      <el-tooltip placement="top" content="拖曳排序">
        <el-button circle class="handle">
          <template #icon>
            <svg-icon name="drag"></svg-icon>
          </template>
        </el-button>
      </el-tooltip>
    </li>
  </div>
</template>

<style>
.list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  display: flex;
  justify-content: normal;
  align-items: center;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.list-item .handle {
  cursor: move;
  margin-left: auto;
}
.list-item.active {
  border: 1px solid #1890ff;
}
.list-item:hover {
  background: #e6f7ff;
}
.list-item > * {
  margin-right: 10px;
}
.list-item button {
  font-size: 12px;
}

.el-button + .el-button {
  margin-left: 0;
}
</style>

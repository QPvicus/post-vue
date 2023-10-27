<script lang="ts" setup>
import { computed, ref } from 'vue'
import { operationText } from '@/plugins/dataOperations'
import { useComponentStore } from '@/stores'
const modalVisible = ref(false)
const editorStore = useComponentStore()
const histories = computed(() => editorStore.editor.histories)
const historyIndex = computed(() => editorStore.editor.historyIndex)
</script>

<template>
  <div class="history-area">
    <el-dialog title="快捷键操作" v-model="modalVisible" width="400px">
      <ul class="shortcut-list">
        <li v-for="(item, key) in operationText" :key="key" class="shortcut-list-item">
          <span class="text">{{ item.text }}</span> <span class="bold">{{ item.shortcut }}</span>
        </li>
      </ul>
    </el-dialog>
    <div class="operation-list">
      <el-tooltip>
        <template #content> 快捷键提示 </template>
        <el-button circle @click="modalVisible = true">
          <template #icon>
            <svg-icon name="question"></svg-icon>
          </template>
        </el-button>
      </el-tooltip>
      <el-tooltip>
        <template #content> 撤销 </template>
        <el-button
          circle
          @click="() => editorStore.undo()"
          :disabled="editorStore.checkUndoDisable"
        >
          <template #icon>
            <svg-icon name="undo"></svg-icon>
          </template>
        </el-button>
      </el-tooltip>
      <el-tooltip>
        <template #content> 重做 </template>
        <el-button circle @click="editorStore.redo()" :disabled="editorStore.checkRedoDisable">
          <template #icon>
            <svg-icon name="redo"></svg-icon>
          </template>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style>
.history-area {
  position: absolute;
  right: 0;
}
.operation-list {
  display: flex;
}
.shortcut-list {
  list-style-type: none;
  padding: 0;
  width: 300px;
  margin: 0 auto;
}
.shortcut-list-item {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.shortcut-list .text {
  color: rgba(0, 0, 0, 0.45);
}
.operation-list button {
  margin-left: 10px !important;
}
.history-area .bold {
  font-weight: bold;
}
.shortcut-list .bold {
  color: #1890ff;
}
</style>
../../plugins/dataOperations

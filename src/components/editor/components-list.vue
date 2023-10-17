<script lang="ts" setup>
import { FileTextOutlined, FileImageOutlined, BuildOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="component-list">
    <a-tabs>
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <FileTextOutlined />
            文本
          </span>
        </template>
        文本组件
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <FileImageOutlined />
            图片
          </span>
        </template>
        图片组件
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>
          <span>
            <BuildOutlined />
            形状
          </span>
        </template>
        形状组件
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style></style>

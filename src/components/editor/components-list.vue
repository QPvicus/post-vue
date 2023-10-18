<script lang="ts" setup>
import { FileTextOutlined, FileImageOutlined, BuildOutlined } from '@ant-design/icons-vue'
import { textList, type CreateComponentType, shapeList } from './component'
import lText from './l-text.vue'
import lImage from './l-image.vue'
import lShape from './l-shape.vue'
import type { Component } from 'vue'
const emit = defineEmits(['item-click'])
const comp: Record<string, Component> = {
  'l-text': lText,
  'l-image': lImage,
  'l-shape': lShape
}
function generateResetCSS(name: string) {
  return {
    position: 'static',
    ...(name !== 'l-shape' && { height: '' })
  }
}

function onItemClick(item: CreateComponentType) {
  if (item.type != 'upload') emit('item-click', item)
}
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
        <div
          v-for="(item, index) in textList"
          :key="index"
          @click="onItemClick(item)"
          class="component-item"
        >
          <div class="component-wrapper">
            <component
              :is="comp[item.name]"
              v-bind="item.props"
              class="inside-component"
              :style="generateResetCSS(item.name)"
            ></component>
            <span v-if="item.text" class="tip-text">{{ item.text }}</span>
          </div>
        </div>
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
        <div
          v-for="(item, index) in shapeList"
          :key="index"
          @click="onItemClick(item)"
          class="component-item"
        >
          <div class="component-wrapper">
            <component
              :is="comp[item.name]"
              v-bind="item.props"
              class="inside-component"
              :style="generateResetCSS(item.name)"
            ></component>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style>
.component-wrapper {
  width: 100px;
  position: relative;
  display: flex;
  align-items: center;
}

.tip-text {
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
  margin-top: -10px;
}

.inside-component {
  width: 100px !important;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  width: 220px;
  margin: 20px auto;
}
.image-list img {
  max-height: 150px;
  object-fit: contain;
}
.item-image {
  margin-right: 10px;
}
.component-item {
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.create-component-list .uploader-container {
  padding: 10px;
  color: #ffffff;
  background: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.create-component-list .uploader-container:hover {
  background: #40a9ff;
}
.create-component-list .uploader-container h4 {
  color: #ffffff;
  margin-bottom: 0;
  margin-left: 10px;
}
.create-component-list .ant-tabs-tab {
  margin: 0;
}
</style>

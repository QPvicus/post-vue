<script lang="ts" setup>
import { textList, type CreateComponentType, shapeList } from './component'
import type { Component } from 'vue'
import { componentsDefaultProps } from './defaultProps'
const emit = defineEmits(['item-click'])

const textDefaultProps = componentsDefaultProps['l-text'].props
const imageDefaultProps = componentsDefaultProps['l-image'].props
const shapeDefaultProps = componentsDefaultProps['l-shape'].props
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
  <div class="create-component-list">
    <el-tabs class="tabs">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Document /></el-icon>
            <span>文本</span>
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
              :is="item.name"
              v-bind="item.props"
              class="inside-component"
              :style="generateResetCSS(item.name)"
            ></component>
            <span v-if="item.text" class="tip-text">{{ item.text }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Picture /></el-icon>
            <span>图片</span>
          </span>
        </template>
        图片组件
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Grid /></el-icon>
            <span>形状</span>
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
              :is="item.name"
              v-bind="item.props"
              class="inside-component"
              :style="generateResetCSS(item.name)"
            ></component>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
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
</style>

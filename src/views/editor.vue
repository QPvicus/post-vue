<script lang="ts" setup>
import ComponentsList from '@/components/editor/components-list.vue'
import TabArea from '@/components/editor/tab-area.vue'
import EditWrapper from '@/components/editor/edit-wrapper.vue'
import { useUserStore, useComponentStore } from '@/stores'
import type { ComponentData } from '@/stores/types'
import { computed } from 'vue'
import { mapValues, pickBy } from 'lodash'
const userStore = useUserStore()
const editorStore = useComponentStore()
const editor = editorStore.editor
const userInfo = computed(() => userStore.user)
const components = computed(() => editor.components)
const pageState = computed(() => editor.page)

const onItemCreated = (component: ComponentData) => {
  editorStore.addComponentToEditor({ id: '', name: component.name, props: { ...component.props } })
}
const updatePosition = (data: {
  left: number
  top: number
  id: string
  width: number
  height: number
}) => {
  const { id } = data
  // 将不是id 加个px
  const newPair = mapValues(
    pickBy(data, (v, k) => k != 'id'),
    (val) => {
      return val + 'px'
    }
  )

  const keysArr = Object.keys(newPair)
  const valuesArr = Object.values(newPair)

  editorStore.updateComponent({ key: keysArr, value: valuesArr, id, isProps: true })
}
</script>

<template>
  <div class="editor" id="editor-layout-main">
    <!-- <a-drawer placement="right" :width="400" title="设置面板">
      <p>内容1.。。。</p>
    </a-drawer> -->
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">头部header</div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">
            <a-button type="primary">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary">保存</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo" :smMode="true"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <components-list @item-click="onItemCreated"> </components-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container" id="canvas-area">
          <p>画布区域</p>
          <tab-area></tab-area>
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="pageState.props">
              <div v-for="item in components" :key="item.id">
                <edit-wrapper v-if="!item.isHidden" :id="item.id">
                  <component :is="item.name" v-bind="item.props" :isEditing="true"></component>
                </edit-wrapper>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff" class="settings-panel">
        右侧布局
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.preview-list.canvas-fix .l-text-component,
.preview-list.canvas-fix .l-image-component,
.preview-list.canvas-fix .l-shape-component {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
.sidebar-container {
  padding: 20px;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  background: url('~@/assets/phone-back.png') no-repeat;
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url('@/assets/loading.svg') 50% 50% no-repeat;
  background-size: 50px;
}
.settings-panel .ant-list-bordered {
  border-radius: 0;
}
.settings-panel .ant-collapse {
  border-radius: 0;
}
.ant-collapse-header,
.ant-collapse-item {
  border-radius: 0 !important;
}
.settings-panel .ant-tabs-tab {
  border-radius: 0 !important;
}
</style>

<script lang="ts" setup>
import { useUserStore, useComponentStore } from '@/stores'
import type { ComponentData } from '@/stores/types'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { mapValues, pickBy } from 'lodash'
import { imageDimensions, takeScreenshotAndUpload } from '@/utils'
import { initKeys } from '@/plugins/hotKeys'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

export type TabType = 'component' | 'layer' | 'page'
const route = useRoute()
const visible = ref(false)
const currentWorkId = route.params.id
const userStore = useUserStore()
const editorStore = useComponentStore()
const editor = editorStore.editor
const userInfo = computed(() => userStore.user)
const components = computed(() => editor.components)
const pageState = computed(() => editor.page)
const currentId = computed(() => editor.currentElement)
const currentEditing = computed(() => editor.currentEditing)
const isDirty = computed(() => editor.isDirty)
const activePanel = ref<TabType>('component')
const canvasFix = ref(false)
const currentElement = computed(() => components.value.find((c) => c.id === currentId.value))
const isPublishing = ref(false)
const isSaving = ref(false)

let timer: any

initKeys()
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

function setActive(id: string, notSwitchPanel = false) {
  editorStore.setActive(id)
  if (!notSwitchPanel) {
    activePanel.value = 'component'
  }
}
function setEdit(id: string) {
  editorStore.setEditing(id)
  activePanel.value = 'component'
  nextTick(() => {
    const ele = document.querySelector('#item-text textarea') as HTMLTextAreaElement
    if (ele) {
      ele.focus()
    }
  })
}

function setPageSetting(e: Event) {
  const currentTarget = e.target as HTMLElement
  if (currentTarget.classList.contains('body-container')) {
    editorStore.setActive('')
    activePanel.value = 'page'
  }
}

// clear component or page selection when clicking the gray area
function clearSelection(e: any) {
  const currentTarget = e.target as HTMLElement
  if (currentTarget.classList.contains('preview-container')) {
    editorStore.setActive('')
    activePanel.value = 'page'
  }
}

function handleChange(data: any) {
  editorStore.updateComponent(data)
}

function titleChange(val: string) {
  editorStore.updatePage({ key: 'title', value: val })
  nextTick(() => {
    saveWork()
  })
}

function adjustHeightOnUpload(event: any) {
  console.log('event', event)
  if (event.key === 'backgroundImage') {
    imageDimensions(event.data.file).then((dimension) => {
      console.log(dimension.height, dimension.width, 'ssss')
      const maxWidth = 375
      const rate = dimension.height / dimension.width
      if (rate > 1) {
        editorStore.updatePage({ key: 'height', value: rate * maxWidth + 'px', level: 'props' })
      }
    })
  }
}

async function publishWork() {
  isPublishing.value = true
  try {
    await takeScreenUpdate()
  } catch (e) {
    console.log(e)
  } finally {
    // TODO:
    editorStore.saveAndPublishWork({ id: currentWorkId as string })
    visible.value = true
    isPublishing.value = false
  }
}

function saveWork(showMessage = false) {
  isSaving.value = true
  return editorStore
    .saveWork({ id: currentWorkId })
    .then(() => {
      if (showMessage)
        ElMessage({
          message: '保存成功',
          duration: 2000,
          type: 'success'
        })
    })
    .finally(() => {
      isSaving.value = false
    })
}

function previewWork() {
  saveWork(true).then(() => (visible.value = true))
}

const takeScreenUpdate = async (checkSave = false) => {
  // remove select condition
  editorStore.setActive('')
  activePanel.value = 'component'
  // remove box shadow to fix html2canvas issue
  canvasFix.value = true
  await nextTick()
  try {
    const rawData = await takeScreenshotAndUpload('canvas-area')
    if (rawData) {
      editorStore.updatePage({ key: 'coverImg', value: rawData.data.urls[0] })
    }
  } catch (e) {
    console.error(e)
  } finally {
    canvasFix.value = false
    if (checkSave) {
      saveWork()
    }
  }
}

watch(activePanel, (newVal) => {
  if (newVal !== 'component') {
    editorStore.setActive('')
  }
})

onMounted(() => {
  editorStore.resetEditor()
  if (currentWorkId) {
    editorStore.getWork(currentWorkId as string)
  }

  timer = setInterval(() => {
    if (isDirty.value) saveWork()
  }, 1000 * 30)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="editor" id="editor-layout-main">
    <el-drawer direction="rtl" :size="400" title="设置面板" v-model="visible">
      <publish-form
        :isPublishing="isPublishing"
        :isSaving="isSaving"
        @panel-close="visible = false"
        @trigger-publish="publishWork"
        @trigger-save="saveWork(true)"
      >
      </publish-form>
    </el-drawer>
    <context-menu> </context-menu>
    <el-container style="flex-direction: column">
      <el-container>
        <el-header class="header">
          <div class="page-title">
            <el-icon @click.prevent="$router.push('/')" style="font-size: 32px; color: #fff"
              ><ArrowLeft
            /></el-icon>
            <input-edit :value="pageState.title" @change="titleChange">
              <h4>{{ pageState.title }}</h4>
            </input-edit>
          </div>
          <!-- <div style="flex: 1"></div> -->
          <el-menu
            mode="horizontal"
            style="height: 64px"
            background-color="#001529"
            :ellipsis="false"
            class="menu"
          >
            <el-menu-item>
              <el-button round type="primary" @click="previewWork">预览和设置</el-button>
            </el-menu-item>
            <el-menu-item>
              <el-button round type="primary" @click="saveWork(true)" :loading="isSaving"
                >保存</el-button
              >
            </el-menu-item>
            <el-menu-item>
              <el-button round type="primary" @click="publishWork" :loading="isPublishing"
                >发布</el-button
              >
            </el-menu-item>
            <el-menu-item>
              <user-profile :user="userInfo" smMode></user-profile>
            </el-menu-item>
          </el-menu>
        </el-header>
      </el-container>
      <el-container style="background-color: #f0f2f5">
        <el-aside width="300px" style="background: #fff">
          <div class="sidebar-container">
            <components-list @item-click="onItemCreated"> </components-list>
          </div>
        </el-aside>
        <el-container style="padding: 0 24px 24px">
          <el-main class="preview-container" @click="clearSelection">
            <p>画布区域</p>
            <tab-area></tab-area>
            <div
              class="preview-list"
              id="canvas-area"
              @click="setPageSetting"
              :class="{ active: activePanel === 'page', 'canvas-fix': canvasFix }"
            >
              <div class="body-container" :style="pageState.props">
                <div v-for="item in components" :key="item.id">
                  <edit-wrapper
                    v-if="!item.isHidden"
                    :id="item.id"
                    @update-position="updatePosition"
                    :props="item.props"
                    @active="setActive"
                    :active="currentId === item.id"
                    :editing="currentEditing"
                    @editing="setEdit"
                  >
                    <component :is="item.name" v-bind="item.props" :isEditing="true"></component>
                  </edit-wrapper>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
        <el-aside width="300px" style="background: #fff" class="settings-panel">
          <el-tabs stretch v-model="activePanel">
            <el-tab-pane label="属性设置" name="component">
              <template v-if="currentElement">
                <div v-if="!currentElement.isLocked">
                  <edit-group :props="currentElement.props"></edit-group>
                </div>
                <div v-else>
                  <el-empty description="该元素被锁定，无法编辑" />
                </div>
              </template>
              <template v-else>
                <el-empty description="在画布中选择元素并开始编辑" />
              </template>
            </el-tab-pane>
            <el-tab-pane label="图层设置" name="layer">
              <layer-list
                :list="components"
                @select="(id: string) => setActive(id, true)"
                @change="handleChange"
              ></layer-list>
            </el-tab-pane>
            <el-tab-pane label="页面设置" name="page">
              <div class="page-settings">
                <props-table
                  :props="pageState.props"
                  mutationName="updatePage"
                  :mutationExtraData="{ level: 'props' }"
                  @updated="adjustHeightOnUpload"
                ></props-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  background-color: #001529;
  height: 64px;
  line-height: 64px;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
  align-items: center;
}
.page-title .el-icon {
  margin-right: 10px;
}

.header h4 {
  color: #ffffff;
}

.menu {
  display: flex;
  align-items: center;
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
  overflow: hidden;
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

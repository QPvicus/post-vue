<script lang="ts" setup>
import ComponentsList from '@/components/editor/components-list.vue'
import { useUserStore } from '@/stores'
import { computed } from 'vue';
const userStore = useUserStore()
const userInfo = computed(() => userStore.user)
</script>

<template>
  <div class="editor">
    <a-drawer placement="right" :width="400" title="设置面板">
      <p>内容1.。。。</p>
    </a-drawer>
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
        <components-list> </components-list>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content> 画布区域 </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff"> 右侧布局 </a-layout-sider>
    </a-layout>
  </div>
</template>

<style>

.header {
  display: flex;
  justify-content: space-between;
}

.page-title {
  display: flex;
}
</style>

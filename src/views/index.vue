<script lang="ts" setup>
import userProfile from '@/components/user-profile.vue'
import { useStatusStore, useUserStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const statusStore = useStatusStore()
const userStore = useUserStore()
const status = computed(() => statusStore.status)
const userInfo = computed(() => userStore.user)
const isHomePage = computed(() => route.name == 'Home')
</script>

<template>
  <div class="container">
    <a-spin tip="读取中" v-if="status.loading"></a-spin>
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header" :class="{ 'transparent-header': isHomePage }">
        <div class="page-title">
          <router-link to="/">
            <!-- <img alt="Vue logo" src="../assets/logo2.png" class="logo-img" /> -->
          </router-link>
        </div>
        <div class="right-col">
          用户导航栏
          <user-profile :user="userInfo"></user-profile>
        </div>
      </a-layout-header>
      <a-layout-content v-if="isHomePage" class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-content style="padding: 0 50px" v-else>
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-content
            :style="{
              padding: '0 24px',
              minHeight: '85vh',
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%'
            }"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

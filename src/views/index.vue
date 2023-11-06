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
    <el-container :style="{ background: '#fff' }">
      <el-header class="header" :class="{ 'transparent-header': isHomePage }">
        <div class="page-title">
          <img alt="绘海报" src="../assets/logo3.png" class="logo-img" />
        </div>
        <div class="right-col">
          <user-profile :user="userInfo"></user-profile>
        </div>
      </el-header>
      <el-container v-if="isHomePage" class="home-layout">
        <router-view></router-view>
      </el-container>
      <el-main style="padding: 0 50px" v-else>
        <el-container style="padding: 24px 0; background: #fff">
          <el-main
            :style="{
              padding: '0 24px',
              minHeight: '85vh',
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%'
            }"
          >
            <router-view />
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  display: flex;
  widows: 250px;
}
.page-title img {
  width: 100%;
  object-fit: contain;
  height: 150px;
}
</style>

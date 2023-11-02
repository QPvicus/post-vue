<script lang="ts" setup>
import { useStatusStore, useUserStore, useWorkStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchText = ref('')
const userStore = useUserStore()
const workStore = useWorkStore()
const statusStore = useStatusStore()
const currentSearchText = computed(() => workStore.work.searchText)
const templates = computed(() => workStore.work.templates)
const works = computed(() => workStore.work.works)
const total = computed(() => workStore.work.totalWorks)
const isLogin = computed(() => userStore.user.isLogin)
const loading = computed(() => statusStore.status.loading)
const onSearch = () => {}

const clearSearch = () => {}

onMounted(() => {})
</script>

<template>
  <div class="homepage-container">
    <div class="banner">
      <img
        class="banner-img"
        src="../assets/background.png"
        style="background-color: rgb(0, 0, 0)"
      />
      <div class="banner-text">
        <h2 class="text-headline" style="color: rgb(255, 255, 255)">海量精彩设计 一键生成</h2>
        <el-input
          v-model="searchText"
          placeholder="搜索一下，快速找模版"
          enter-button
          @search="onSearch"
        >
          <template #append> <el-button :icon="Search" /> </template
        ></el-input>
      </div>
    </div>
    <div class="welcome-container">
      <div class="welcome-container-inner">
        <el-row>
          <el-col :span="8" class="feature-item">
            <Html5TwoTone />
            <h3>专注H5 始终如一</h3>
            <p>三年保持行业领先</p>
          </el-col>
          <el-col :span="8" class="feature-item">
            <BuildTwoTone />
            <h3>海量 H5 模版</h3>
            <p>一键生成，一分钟轻松制作</p>
          </el-col>
          <el-col :span="8" class="feature-item">
            <BulbTwoTone />
            <h3>极致体验</h3>
            <p>用户的一致选择</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-container">
      <el-row class="content-title">
        <h2 v-if="currentSearchText">{{ currentSearchText }}的结果</h2>
        <el-button
          shape="circle"
          size="small"
          v-if="currentSearchText"
          :style="{ marginLeft: '10px' }"
          @click="clearSearch"
        >
          ×
        </el-button>
        <div class="hot-title" v-else>
          <h2 class="hot-template">热门海报</h2>
          <p>只需替换文字和图片，一键自动生成H5</p>
        </div>
      </el-row>
      <el-row :gutter="16">
        <el-empty v-if="templates.length === 0 && !loading">
          <template #description>
            <span> 没找到任何海报 换个关键词试试 </span>
          </template>
        </el-empty>
        <template-list :list="templates" type="template"></template-list>
      </el-row>
      <el-row justify="center">
        <el-button type="primary" size="large" :loading="loading"> 加载更多 </el-button>
      </el-row>
      <div class="my-works" v-if="isLogin && works.length > 0">
        <el-row style="justify-content: space-between" class="content-title">
          <h2>我的作品</h2>
          <router-link to="/mywork">查看我的所有作品</router-link>
        </el-row>
        <el-row :gutter="16">
          <template-list :list="works"></template-list>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style>
.banner {
  display: flex;
  position: relative;
  height: 450px;
  width: 100%;
  overflow: hidden;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.banner-text .el-input {
  width: 40%;
  box-shadow: 0px 12px 24px 0px rgba(30, 29, 32, 0.8);
}
.banner-text .el-input {
  height: 40px;
  font-size: 17px;
  /* padding: 7px 15px;
  padding-right: 30px;
  border: 2px solid #3e7fff;
  border-right-width: 0px; */
}
.text-headline {
  margin-bottom: 10px;
  text-shadow:
    0 0 1px rgba(68, 92, 116, 0.02),
    0 2px 8px rgba(57, 76, 96, 0.15);
  font-size: 2rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.feature-item {
  text-align: center;
  padding: 20px 0;
}
.feature-item .anticon {
  font-size: 60px;
}
.feature-item p {
  color: #666;
}
.feature-item h3 {
  margin: 5px 0;
  font-size: 19px;
  color: #333;
}
.welcome-container {
  background: #f2f2f2;
}
.welcome-container-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.hot-title {
  margin: 0 auto;
  padding: 20px 0;
}
.hot-title p {
  text-align: center;
  font-size: 16px;
  color: #666;
}
.hot-template {
  font-size: 22px;
  color: #333;
}
.hot-template::before,
.hot-template::after {
  content: '';
  display: inline-block;
  width: 57px;
  height: 1px;
  margin: 0 26px;
  background-color: #d8d8d8;
  vertical-align: middle;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.content-title {
  min-height: 70px;
}
.content-title h2 {
  margin-bottom: 0px;
}
</style>

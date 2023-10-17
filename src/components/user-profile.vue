<script lang="ts" setup>
import { withDefaults } from 'vue'
withDefaults(
  defineProps<{
    user: UserProps
    smMode: boolean
  }>(),
  {
    smMode: false
  }
)
import type { UserProps } from '@/stores/types'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function createDesign() {}

function logout() {
  // 退出登录
  message.success('退出登录册成功，2秒后跳转到首页', 2)
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
</script>

<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component">
    <router-link to="/login">登录</router-link>
  </a-button>
  <div :class="{ 'user-operation': !smMode }" v-else>
    <a-button type="primary" @click="createDesign" v-if="!smMode"> 创建设计 </a-button>
    <a-button type="primary" class="user-profile-component" v-if="!smMode">
      <router-link to="/mywork">我的作品</router-link>
    </a-button>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.data.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="2" v-if="smMode"
            ><router-link to="/mywork">我的作品</router-link></a-menu-item
          >
          <a-menu-item key="3"><router-link to="/setting">个人设置</router-link></a-menu-item>
          <a-menu-item key="4" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<style></style>

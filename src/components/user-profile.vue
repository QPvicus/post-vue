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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCreateDesign } from '@/hooks'
const router = useRouter()

const createDesign = useCreateDesign()

function logout() {
  // 退出登录
  ElMessage({
    message: '退出登录成功,2秒后跳转到首页',
    duration: 2,
    type: 'success'
  })
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
</script>

<template>
  <el-button
    type="primary"
    v-if="!user.isLogin"
    @click="$router.push('/login')"
    class="user-profile-component"
  >
    登录
  </el-button>
  <div :class="{ 'user-operation': !smMode }" class="middle" v-else>
    <el-button round type="primary" v-if="!smMode" @click="createDesign"> 创建设计 </el-button>
    <el-button
      round
      type="primary"
      @click="router.push('/mywork')"
      class="user-profile-component"
      v-if="!smMode"
    >
      我的作品
    </el-button>
    <el-dropdown>
      <el-button type="primary" round>
        {{ user.data.nickName || '用户1' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push('/mywork')" v-if="smMode"
            >我的作品</el-dropdown-item
          >
          <el-dropdown-item @click="router.push('/setting')">个人设置</el-dropdown-item>
          <el-dropdown-item @click="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style>
.user-operation > * {
  margin-left: 30px !important;
}

.middle {
  display: flex;
  align-items: center;
}
</style>

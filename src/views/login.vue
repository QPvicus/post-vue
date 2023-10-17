<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { computed, reactive, ref, toRaw, watch } from 'vue'
import { isMobile } from '@/utils'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useStatusStore } from '@/stores'
import { message, Form } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const useForm = Form.useForm
const router = useRouter()
const statusStore = useStatusStore()
const counter = ref(60)
const rules: Record<string, Rule[]> = {
  username: [{ validator: cellnumberValidator, trigger: 'blur' }],
  password: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
}
const form = reactive({
  username: '13912345678',
  password: '1111'
})
const { validate } = useForm(form, rules)
//TODO:
const status = computed(() => statusStore.status)

async function cellnumberValidator(_rule: Rule, value: string) {
  if (value.trim() == '') return Promise.reject('手机号码不能为空')
  const passed = isMobile(value.trim())
  return passed ? Promise.resolve() : Promise.reject('手机号码格式不正确')
}

const codeButtonDisable = computed(() => {
  return !isMobile(form.username.trim()) || counter.value < 60
})
let timer: number
const startCounter = () => {
  counter.value--
  timer = setInterval(() => {
    counter.value--
  }, 1000)
}

const login = () => {
  validate()
    .then(() => {
      console.log(toRaw(form))
      message.success('登录成功 2秒后跳转到首页')
      setTimeout(() => {
        router.push('/')
      }, 2000);
    })
    .catch((e) => {
      console.log('error', e)
    })
}

const getCode = () => {
  // api
  message.success('验证码已发送,请注意查收', 5)
  startCounter()
}

watch(counter, (newVal) => {
  if (newVal == 0) {
    clearInterval(timer)
    counter.value = 60
  }
})
</script>

<template>
  <div class="login-page">
    <a-row>
      <a-col :span="12" class="aside">
        <div class="aside-inner">
          <router-link to="/">
            <!-- <img alt="Vue logo" src="../assets/logo2.png" class="logo-img" /> -->
          </router-link>
          <h2>绘海报</h2>
          <!-- <span class="text-white-70">王铁锤, Google</span> -->
        </div>
      </a-col>
      <a-col :span="12" class="login-area">
        <a-form :model="form" :rules="rules" ref="publishForm" layout="vertical">
          <h2>欢迎回来</h2>
          <p class="subTitle">使用手机号码和验证码登录到绘海报</p>
          <a-form-item label="手机号码" required name="username">
            <a-input v-model:value="form.username" placeholder="手机号码">
              <template #prefix>
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="验证码" required name="password">
            <a-input v-model:value="form.password" placeholder="四位验证码">
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="login"
              size="large"
              :loading="status.loading && status.opName === 'login'"
            >
              {{ status.loading ? '加载中' : '登录' }}
            </a-button>
            <a-button
              @click="getCode"
              size="large"
              :style="{ marginLeft: '20px' }"
              :disabled="codeButtonDisable"
              :loading="status.loading && status.opName === 'getCode'"
            >
              {{ counter === 60 ? '获取验证码' : `${counter}秒后重发` }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<style>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #1a1919;
  background-image: url('@/assets/login.png');
  background-size: cover;
  background-repeat: no-repeat;
}
.aside .logo-img {
  width: 200px;
  margin-bottom: 20px;
}
.aside h2 {
  color: #cccccc;
  font-size: 29px;
}
.aside-inner {
  width: 60%;
  text-align: center;
}
.login-area {
  height: 100vh;
}
.login-area .ant-form {
  width: 350px;
}
.text-white-70 {
  color: #999;
  display: block;
  font-size: 19px;
}
.aside,
.login-area {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.login-area .ant-form-item-label {
  display: none;
}
/* .login-area .ant-input-prefix {
  left: auto;
  right: 30px;
  font-size: 19px;
}
.login-area .ant-input {
  font-size: 17px;
  padding: 20px 45px 20px 30px;
  background-color: #ebf2ff;
  border-color: #ebf2ff;
} */
</style>

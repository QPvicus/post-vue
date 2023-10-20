<script lang="ts" setup>
import { computed, reactive, ref, toRaw, watch } from 'vue'
import { isMobile } from '@/utils'
import { useStatusStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, View } from '@element-plus/icons-vue'

const router = useRouter()
const statusStore = useStatusStore()
const counter = ref(60)
const form = reactive({
  username: '13912345678',
  password: '1111'
})
const ruleFormRef = ref<FormInstance>()

async function cellnumberValidator(rule: any, value: any, cb: any) {
  if (value.trim() == '') cb(new Error('手机号码不能为空'))
  else {
    const passed = isMobile(value.trim())
    if (passed) cb()
    else cb('手机格式不正确')
  }
}
const rules = reactive<FormRules<typeof form>>({
  // @ts-expect-error: 1
  username: [{ validator: cellnumberValidator, trigger: 'blur' }],
  password: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})

//TODO:
const status = computed(() => statusStore.status)

// async function cellnumberValidator(_rule: Rule, value: string) {
//   if (value.trim() == '') return Promise.reject('手机号码不能为空')
//   const passed = isMobile(value.trim())
//   return passed ? Promise.resolve() : Promise.reject('手机号码格式不正确')
// }

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
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage({
        message: '登录成功 2秒后跳转到首页',
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else return false
  })
}

const getCode = () => {
  // api
  ElMessage({
    message: '验证码已发送,请注意查收',
    duration: 5000,
    type: 'success'
  })
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
    <el-row>
      <el-col :span="12" class="aside">
        <div class="aside-inner">
          <router-link to="/"> </router-link>
          <h2>绘海报</h2>
        </div>
      </el-col>
      <el-col :span="12" class="login-area">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" layout="vertical">
          <h2>欢迎回来</h2>
          <p class="subTitle">使用手机号码和验证码登录到绘海报</p>
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="手机号码" :suffix-icon="User">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="四位验证码" :suffix-icon="View">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="login"
              size="large"
              :loading="status.loading && status.opName === 'login'"
            >
              {{ status.loading ? '加载中' : '登录' }}
            </el-button>
            <el-button
              @click="getCode"
              size="large"
              :style="{ marginLeft: '20px' }"
              :disabled="codeButtonDisable"
              :loading="status.loading && status.opName === 'getCode'"
            >
              {{ counter === 60 ? '获取验证码' : `${counter}秒后重发` }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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

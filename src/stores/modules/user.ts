import { defineStore } from 'pinia'
import type { User, UserProps } from '../types'
import { reactive, ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('post-user', () => {
  const user = reactive<UserProps>({
    isLogin: false,
    token: localStorage.getItem('token') || '',
    data: {}
  })

  async function fetchCurrentUser() {
    const { data } = await axios.get(`/users/getUserInfo`)
    user.data = data
    user.isLogin = true
    return data
  }

  function logout() {
    user.token = ''
    user.isLogin = false
    localStorage.removeItem('token')
    delete axios.defaults.headers.common.Authorization
  }

  async function login(payload: { phoneNumber: string; veriCode: string }) {
    const { data } = await axios.post('/users/loginByPhoneNumber', payload)
    const { token } = data.data
    user.token = token
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return data
  }

  function loginAndFetch(loginData: { phoneNumber: string; veriCode: string }) {
    return login(loginData).then(() => {
      return fetchCurrentUser()
    })
  }
  return { user, fetchCurrentUser, loginAndFetch, login, logout }
})

import { defineStore } from 'pinia'
import type { User, UserProps } from '../types'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('post-user', () => {
  const user = ref<UserProps>({
    isLogin: false,
    token: localStorage.getItem('token') || '',
    data: {}
  })

  function fetchCurrentUser(data: User) {
    user.value.isLogin = true
    user.value.data = data
  }

  async function login(payload: { phoneNumber: string; veriCode: string }) {
    console.log(payload)
    const { data } = await axios.post('/users/loginByPhoneNumber', payload)
    const { token } = data.data
    user.value.token = token
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return data
  }

  function loginAndFetch(loginData: { phoneNumber: string; veriCode: string }) {
    return login(loginData).then((data) => {
      // return fetchCurrentUser(data)
      return fetchCurrentUser(data.data)
    })
  }
  return { user, fetchCurrentUser, loginAndFetch, login }
})

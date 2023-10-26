import { defineStore } from 'pinia'
import type { User, UserProps } from '../types'
import { ref } from 'vue'

export const useUserStore = defineStore('post-user', () => {
  const user = ref<UserProps>({
    isLogin: true,
    token: localStorage.getItem('token') || '',
    data: {}
  })

  function fetchCurrentUser(data: User) {
    user.value.data = data
  }
  return { user, fetchCurrentUser }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Status } from '../types'

export const useStatusStore = defineStore('post-state', () => {
  const status = ref<Status>({ loading: false, error: { status: false, message: '' }, opName: '' })

  function setLoading(opt: Status) {
    status.value.loading = opt.loading
    if (opt.opName) {
      status.value.opName = opt.opName
    }
  }

  function setError(e: any) {
    status.value.error = e
  }

  return { status, setLoading, setError }
})

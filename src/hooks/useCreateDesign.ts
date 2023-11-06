import { useUserStore, useWorkStore } from '@/stores'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useCreateDesign() {
  const router = useRouter()
  const userStore = useUserStore()
  const workStore = useWorkStore()
  const user = computed(() => userStore.user)
  const createDesign = () => {
    if (user.value.isLogin) {
      const payload = {
        title: '未命名作品',
        desc: '未命名作品',
        coverImg:
          'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
      }

      workStore.createWork(payload).then(({ data }) => {
        router.push(`/editor/${data.id}`)
      })
    } else {
      router.push('/login')
    }
  }

  return createDesign
}

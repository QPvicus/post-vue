import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useClickOutside(elementRef: Ref<Element | null>, trigger: any = false) {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value && trigger.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

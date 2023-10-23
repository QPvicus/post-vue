<script lang="ts" setup>
import { ref, defineOptions } from 'vue'
defineProps<{
  value: string
}>()
defineOptions({
  name: 'textarea-fix'
})
const emit = defineEmits(['change'])
const areaRef = ref<HTMLTextAreaElement>()
let triggerFlag = false
const onInput = (e: Event) => {
  console.log(e)
  emit('change', e)
}
const onStart = () => {
  triggerFlag = true
}
const onEnd = () => {
  triggerFlag = false
  if (areaRef.value) {
    areaRef.value.dispatchEvent(new Event('input'))
  }
}
</script>

<template>
  <textarea
    class="textarea-content"
    :model-value="value"
    ref="areaRef"
    v-bind="$attrs"
    rows="3"
    @input="onInput"
  >
  </textarea>
</template>

<style>
.textarea-content {
  overflow: auto;
  resize: vertical;
  max-width: 100%;
  height: auto;
  min-height: 32px;
  line-height: 1.5715;
  vertical-align: bottom;
  transition:
    all 0.3s,
    height 0s;
}
</style>

<script lang="ts" setup>
import { emitChangeFn } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useClickOutside, useHotKey } from '@/hooks'
const props = defineProps<{
  value: string
}>()

const emit = defineEmits(['clicked', 'change'])
const wrapper = ref()
const innerValue = ref(props.value)
const isEditing = ref(false)
const error = ref(false)
const isOutside = useClickOutside(wrapper, isEditing)
const validateCheck = computed(() => innerValue.value.trim() !== '')

watch(
  () => props.value,
  () => {
    innerValue.value = props.value
  }
)
function handleClick() {
  setTimeout(() => {
    isEditing.value = true
    emit('clicked')
  }, 200)
}

watch(isOutside, (newVal) => {
  if (!validateCheck.value) return
  if (newVal && isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
    error.value = false
    isOutside.value = false
  }
})

useHotKey('enter, return', () => {
  if (!validateCheck.value) return
  if (isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})

useHotKey('esc', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = props.value
  }
})
</script>

<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <el-input
      v-if="isEditing"
      v-model="innerValue"
      :class="{ 'input-error': !validateCheck }"
      placeholder="文本不能为空"
    ></el-input>
    <slot v-else></slot>
  </div>
</template>

<style>
.inline-edit {
  cursor: pointer;
}
.input-error {
  border: 1px solid #f5222d;
}
.input-error:focus {
  border-color: #f5222d;
}
.input-error::placeholder {
  color: #f5222d;
}
</style>

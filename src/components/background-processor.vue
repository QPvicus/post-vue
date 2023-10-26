<script lang="ts" setup>
import { ElMessage } from 'element-plus'

defineProps({
  value: {
    type: String,
    required: true
  },
  ratio: {
    type: Number
  }
})
const emit = defineEmits(['change', 'uploaded'])

function handleFileUploaded(data: any) {
  ElMessage.success('上传成功')
  //TODO: xx
  emit('change', URL.createObjectURL(data))
  emit('uploaded', data)
}

function updateUrl(value: string) {
  emit('change', value)
}

function triggerUploaded(data: any) {
  emit('uploaded', data)
}
</script>

<template>
  <div class="background-processor">
    <styled-uploader v-if="!value" @file-uploaded="handleFileUploaded"></styled-uploader>
    <image-process
      v-else
      showDelete
      :ratio="ratio"
      :value="value"
      @change="updateUrl"
      @uploaded="triggerUploaded"
    >
    </image-process>
  </div>
</template>

<style>
.delete-uploaded {
  margin-top: 10px;
  display: block;
}

.background-processor {
  width: 268px;
}
</style>

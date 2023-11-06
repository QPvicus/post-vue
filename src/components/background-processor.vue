<script lang="ts" setup>
import type { UploadImgProps } from '@/utils'
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

function handleFileUploaded(uploadedData: UploadImgProps) {
  ElMessage.success('上传成功')
  //TODO: xx
  emit('change', uploadedData.data.urls[0])
  emit('uploaded', uploadedData)
}

function updateUrl(value: string) {
  emit('change', value)
}

function triggerUploaded(uploadedData: UploadImgProps) {
  console.log(uploadedData, 'nackground-processor dd')
  emit('uploaded', uploadedData)
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

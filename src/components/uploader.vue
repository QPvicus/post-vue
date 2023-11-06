<script lang="ts" setup>
import axios from 'axios'
import { ref, type PropType, watch } from 'vue'
defineOptions({
  name: 'uploader',
  inheritAttrs: false
})
const props = defineProps({
  action: {
    type: String,
    required: true
  },
  beforeUpload: {
    type: Function as PropType<CheckFunction>
  },
  uploaded: {
    type: Object
  }
})
const emit = defineEmits(['file-uploaded', 'file-uploaded-error'])
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

const fileInput = ref<HTMLInputElement>()
const uploadedData = ref(props.uploaded)
const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')

function triggerUpload() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileChange(e: Event) {
  const currentTarget = e.target as HTMLInputElement
  if (currentTarget.files) {
    const files = Array.from(currentTarget.files)
    if (props.beforeUpload) {
      const result = props.beforeUpload(files[0])
      if (!result) {
        return
      }
    }
    fileStatus.value = 'loading'
    const formData = new FormData()
    formData.append('file', files[0])
    axios
      .post(props.action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((resp) => {
        fileStatus.value = 'success'
        uploadedData.value = resp.data
        resp.data.file = files[0]
        emit('file-uploaded', resp.data)
      })
      .catch((error) => {
        fileStatus.value = 'error'
        emit('file-uploaded-error', { error })
      })
      .finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
  }
}

watch(
  () => props.uploaded,
  (newVal) => {
    if (newVal) {
      fileStatus.value = 'success'
      uploadedData.value = newVal
    } else {
      fileStatus.value = 'ready'
    }
  }
)
</script>

<template>
  <div class="file-upload">
    <div class="file-upload-container" v-bind="$attrs" @click.prevent="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传中</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange" />
  </div>
</template>

<style>
.file-input {
  display: none;
}
</style>

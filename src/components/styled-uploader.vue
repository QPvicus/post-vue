<script lang="ts" setup>
import { commonUploadCheck } from '@/utils'
defineProps({
  text: {
    type: String,
    default: '上传背景图片'
  },
  uploaded: {
    type: Object
  }
})

const emit = defineEmits(['file-uploaded'])

function handleFileUploaded(data: any) {
  emit('file-uploaded', data)
}
</script>

<template>
  <div class="styled-upload-component">
    <uploader
      action="/utils/upload-img"
      :beforeUpload="commonUploadCheck"
      :uploaded="uploaded"
      @file-uploaded="handleFileUploaded"
    >
      <div class="uploader-container">
        <el-icon><PictureFilled style="font-size: 32px" /></el-icon>
        <h4>{{ text }}</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploader-container">
          {{ dataProps }}
          <img :src="dataProps.url" />
        </div>
      </template>
    </uploader>
  </div>
</template>

<style scoped>
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 2px dotted #efefef;
  color: #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #999;
  transition: all 0.25s ease-in-out;
}
.uploader-container:hover h4 {
  color: #1890ff;
}
.uploader-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

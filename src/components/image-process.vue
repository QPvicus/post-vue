<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { UploadFilled, Scissor, Delete } from '@element-plus/icons-vue'
import { commonUploadCheck, type UploadImgProps } from '@/utils'
import { ElMessage } from 'element-plus'
import Cropper from 'cropperjs'
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  ratio: {
    type: Number
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'uploaded'])
const showModal = ref(false)
const backgroundUrl = computed(() => `url(${props.value})`)
const baseImageUrl = computed(() => props.value)

let cropperData: any
let cropper: Cropper
watch(showModal, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const image = document.getElementById('processed-image') as HTMLImageElement
      cropper = new Cropper(image, {
        checkCrossOrigin: false,
        crop(event) {
          const { x, y, width, height } = event.detail
          cropperData = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height)
          }
        },
        ...(props.ratio && { aspectRatio: props.ratio })
      })
    })
  } else {
    if (cropper) cropper.destroy()
  }
})

function handleConfirm() {
  const { x, y, width, height } = cropperData
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  const image = document.createElement('img')
  image.src = baseImageUrl.value
  image.onload = () => {
    ctx?.drawImage(image, x, y, width, height, 0, 0, image.width, image.height)
    canvas.toBlob((croppedBlob) => {
      const blobUrl = URL.createObjectURL(croppedBlob!)
      emit('change', blobUrl)
      emit('uploaded', { url: blobUrl })
    })
  }
  showModal.value = false
}

function handleFileUpload(uploadedData: UploadImgProps) {
  ElMessage.success('上传成功')
  emit('change', uploadedData.data.urls[0])
  emit('uploaded', uploadedData)
}

function handleDelete() {
  emit('change', '')
}
</script>

<template>
  <div class="image-processor">
    <el-dialog title="裁剪图片" v-model="showModal" append-to-body>
      <div class="image-cropper">
        <img :src="baseImageUrl" id="processed-image" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="image-preview" :style="{ backgroundImage: backgroundUrl }"></div>
    <div class="image-process">
      <uploader
        action="/utils/upload-img"
        :before-upload="commonUploadCheck"
        @file-uploaded="handleFileUpload"
      >
        <div class="uploader-container">
          <el-button>
            <template #icon
              ><el-icon><UploadFilled /></el-icon></template
            >更换图片
          </el-button>
        </div>
        <template #loading>
          <div class="uploader-container">
            <el-button>
              <template #icon
                ><el-icon><UploadFilled /></el-icon></template
              >上传中
            </el-button>
          </div>
        </template>
        <template #uploaded>
          <el-button>
            <template #icon><UploadFilled /></template>更换图片
          </el-button>
        </template>
      </uploader>
      <el-button @click="showModal = true">
        <template #icon>
          <el-icon><Scissor /></el-icon>
        </template>
        裁剪图片
      </el-button>
      <el-button v-if="showDelete" type="danger" @click="handleDelete">
        <template #icon>
          <Delete />
        </template>
        删除图片
      </el-button>
    </div>
  </div>
</template>

<style>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.image-processor {
  display: flex;
  justify-content: space-between;
  width: 261px;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
.image-preview.extraHeight {
  height: 110px;
}

.image-cropper {
  width: 475px;
  height: 315px;
}
.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
.image-process {
  padding: 5px 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

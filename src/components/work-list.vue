<script lang="ts" setup>
import type { WorkProp } from '@/stores'
import { computed, type PropType } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { downloadImage } from '@/utils'
const props = defineProps({
  list: {
    type: Array as PropType<WorkProp[]>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  transferStatus: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['on-copy', 'on-delete', 'on-send'])

const router = useRouter()

const listWithBarcode = computed(() => {
  return props.list.map((item) => {
    item.barcodeUrl = `http://182.92.168.192:8082/p/${item.id}-${item.uuid}`
    return item
  })
})

console.log(listWithBarcode.value)

function copy(id: string) {
  emit('on-copy', id)
}

function deleteClick(id: string) {
  ElMessageBox.confirm('确定要删除该作品吗', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('on-delete', id)
  })
}

const saveImg = (id: string) => {
  downloadImage(id)
}
</script>

<template>
  <div class="template-list-component">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in listWithBarcode" :key="item.id" class="col-item">
        <el-card shadow="hover" class="card-item" style="position: relative">
          <div class="card-cover">
            <img :src="item.coverImg" v-if="item.coverImg" />
            <img
              src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"
              v-else
            />
          </div>
          <div class="footer" style="padding: 10px">
            <div class="text">{{ item.title }}</div>
          </div>
          <div class="mask"></div>
          <div class="hover-item">
            <el-col>
              <div
                :id="`barcode-${item.id}`"
                class="barcode-container"
                v-if="item.status === '2'"
              ></div>
              <el-button type="primary" round v-else @click="router.push(`/editor/${item.id}`)"
                >继续编辑该作品</el-button
              >
            </el-col>
          </div>
          <div class="icon-footer">
            <div class="icon-left" @click="router.push(`/editor/${item.id}`)">
              <el-icon><Edit></Edit></el-icon>
            </div>
            <div class="icon-right">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <svg-icon name="ellipsis"></svg-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.prevent="copy(item.id)">
                      <el-icon><DocumentCopy /></el-icon>
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item @click.prevent="deleteClick(item.id)">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item @click.prevent="saveImg(item.coverImg)">
                      <el-icon><Download /></el-icon>
                      下载图片
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
        <div class="tag">
          <el-tag round effect="plain" type="" v-if="item.status === '1'">未发布</el-tag>
          <el-tag round effect="plain" type="success" v-else>已发布</el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.col-item {
  margin-bottom: 16px;
}

.barcode-container {
  width: 80px;
  height: 80px;
}
.overlay-dropdown {
  border-radius: 2px !important;
}

.card-item img {
  display: block;
  width: 100%;
  object-fit: cover;
  aspect-ratio: 282 / 485;
}

.hover-item {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}
.col-item:hover .hover-item {
  display: flex;
}

.icon-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-left {
  font-size: 24px;
  text-align: center;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.col-item {
  position: relative;
  margin-bottom: 20px;
}
.col-item .el-card {
  border-radius: 12px;
}

.tag {
  position: absolute;
  top: -1px;
  left: 4px;
}
</style>

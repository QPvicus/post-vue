<script lang="ts" setup>
import { useComponentStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

defineProps({
  isSaving: Boolean,
  isPublishing: Boolean
})

const emit = defineEmits(['trigger-publish', 'trigger-save', 'panel-close'])

const editorStore = useComponentStore()
const publishForm = ref<FormInstance>()
const pageData = computed(() => editorStore.editor.page)
const form = reactive({
  title: pageData.value.title || '',
  subTitle: pageData.value.desc || '',
  uploaded: { data: { url: (pageData.value.setting && pageData.value.setting.shareImg) || 'xxx' } }
})

const rules: FormRules<typeof form> = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  subTitle: [{ required: true, message: '副标题不能为空', trigger: 'blur' }]
}

watch(
  () => pageData.value.title,
  (newTitle) => {
    if (newTitle) form.title = newTitle
  }
)

function updatePage(key: string, value: string, settings = false) {
  editorStore.updatePage({ key, value, level: settings ? 'setting' : false })
}

const validate = () => publishForm.value?.validate()

function checkAndpublish() {
  validate()?.then(() => emit('trigger-publish', true))
}

function saveWork() {
  validate()?.then(() => emit('trigger-save', true))
}

function cancelEdit() {
  validate()?.then(() => emit('panel-close', true))
}
</script>

<template>
  <div class="publish-form-container">
    <el-row :style="{ marginBottom: '20px' }">
      <el-col :span="6"> 扫码预览： </el-col>
      <el-col :span="10">
        <div id="preview-barcode-container"></div>
      </el-col>
    </el-row>
    <el-form
      :model="form"
      :rules="rules"
      ref="publishForm"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="标题" required name="title">
        <el-input v-model="form.title" @change="updatePage('title', form.title)" />
      </el-form-item>
      <el-form-item label="副标题" required name="subTitle">
        <el-input v-model="form.subTitle" @change="updatePage('desc', form.subTitle)" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkAndpublish" :loading="isPublishing">
          发布
        </el-button>
        <el-button style="margin-left: 10px" @click="saveWork" :loading="isSaving">
          保存
        </el-button>
        <el-button style="margin-left: 10px" @click="cancelEdit"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style></style>

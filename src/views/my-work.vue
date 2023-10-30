<script lang="ts" setup>
import { useStatusStore, useWorkStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useCreateDesign } from '@/hooks'
defineProps<{
  modelValue?: boolean
}>()

const statusStore = useStatusStore()
const workEditor = useWorkStore()
const createDesign = useCreateDesign()
const works = computed(() => workEditor.work.works)
const total = computed(() => workEditor.work.totalWorks)
const searchText = ref('')
const currentSearchText = computed(() => workEditor.work.searchText)
const loading = computed(() => statusStore.status.loading)
const currentPage = ref(1)
const isTemplate = ref(0)

function clearSearch() {}

function onSearch() {
  console.log('dd')
}

function changeCategory() {}

onMounted(() => {
  workEditor.fetchWorks()
})
</script>

<template>
  <div class="mywork-container">
    <el-row justify="space-between" class="poster-title">
      <el-col :span="8">
        <div v-if="currentSearchText" class="searchResult">
          <h2>{{ currentSearchText }}的结果</h2>
          <el-button circle size="small" :style="{ marginLeft: '10px' }" @click="clearSearch">
            ×
          </el-button>
        </div>
        <h2 v-else>我的作品和模版</h2>
      </el-col>
      <el-col :span="8">
        <el-input v-model="searchText" size="large" placeholder="搜索我的作品或者模版">
          <template #suffix>
            <el-icon style="cursor: pointer" @click="onSearch"><Search></Search></el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <el-tabs @change="changeCategory">
      <el-tab-pane label="我的作品"> </el-tab-pane>
      <el-tab-pane label="我的模版"> </el-tab-pane>
    </el-tabs>
    <el-empty v-if="works.length === 0 && !loading">
      <template #description>
        <span>还没有任何作品</span>
      </template>
      <el-button type="primary" size="large" @click="createDesign">
        创建你的第一个设计 🎉
      </el-button>
    </el-empty>

    <work-list :list="works"> </work-list>
  </div>
</template>

<style>
.searchResult {
  display: flex;
  align-items: center;
}
#main-chart {
  position: relative;
}
.chart-loading {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>

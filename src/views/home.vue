<template>
  <div>
    <h1>首页</h1>
    <div>
      <el-radio-group v-model="radio1" size="large">
        <el-radio-button label="New York" />
        <el-radio-button label="Washington" />
        <el-radio-button label="Los Angeles" />
        <el-radio-button label="Chicago" />
      </el-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const radio1 = ref('New York')
</script>

<style></style>

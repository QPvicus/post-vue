<script lang="ts" setup>
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  tip: {
    type: String
  }
})

const emit = defineEmits(['change'])

function handleClick() {
  emit('change', !props.checked)
}
</script>

<template>
  <div class="icon-template" @click.prevent="handleClick">
    <el-tooltip placement="top">
      <template #content>
        {{ tip }}
      </template>
      <el-button circle :type="checked ? 'primary' : ''">
        <template #icon>
          <svg-icon :name="iconName"></svg-icon>
        </template>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style></style>

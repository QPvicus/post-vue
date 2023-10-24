<template>
  <div>
    <svg aria-hidden="true" class="svg-icon">
      <use :href="symbolId" :fill="color" />
    </svg>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  }
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style scoped>
.svg-icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor;
  margin-left: 10px;
  margin-right: 10px;
}
</style>

<script lang="ts" setup>
import { map } from 'lodash'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    props: Record<string, any>
    mutationName: string
    mutationExtraData: Record<string, any>
  }>(),
  {
    mutationName: 'updateComponent'
  }
)

const finalProps = computed(() => {
  return map(props.props, (key, value) => {})
})
</script>

<template>
  <div class="props-table">
    <li></li>
  </div>
</template>

<style></style>

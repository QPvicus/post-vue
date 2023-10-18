<script lang="ts" setup>
import { useComponentClick, useStylePick } from '@/hooks'
import { transformToComponentProps, componentsDefaultProps, isEditingProp } from './defaultProps'
defineOptions({
  name: 'l-image'
})
const props = defineProps(
  transformToComponentProps(componentsDefaultProps['l-image'].props, isEditingProp)
)
const styleProps = useStylePick(props)
const handleClick = useComponentClick(props)
</script>

<template>
  <img
    :src="imageSrc"
    :style="styleProps"
    @click.prevent="handleClick"
    class="l-image-component"
    :draggable="false"
  />
</template>

<style scoped>
.l-image-component {
  max-width: 100%;
}
</style>

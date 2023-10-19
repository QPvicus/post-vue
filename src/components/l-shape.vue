<script lang="ts" setup>
import { useComponentClick, useStylePick } from '@/hooks'
import componentsDefaultProps, {
  isEditingProp,
  transformToComponentProps
} from './editor/defaultProps'

const props = defineProps(
  transformToComponentProps(componentsDefaultProps['l-shape'].props, isEditingProp)
)

const styleProps = useStylePick(props)
const handleClick = useComponentClick(props)
</script>

<template>
  <div
    @click.prevent="handleClick"
    :style="styleProps"
    class="l-shape-component"
    :draggable="false"
  ></div>
</template>

<style></style>

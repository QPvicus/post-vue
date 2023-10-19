<script lang="ts" setup>
import { useComponentClick, useStylePick } from '@/hooks'
import componentsDefaultProps, {
  transformToComponentProps,
  isEditingProp
} from './editor/defaultProps'
defineOptions({
  name: 'l-text'
})
const props = defineProps(
  transformToComponentProps(componentsDefaultProps['l-text'].props, {
    tag: {
      type: String,
      default: 'p'
    },
    ...isEditingProp
  })
)
const styleProps = useStylePick(props)
const handleClick = useComponentClick(props)
</script>

<template>
  <component :is="tag" @click.prevent="handleClick" :style="styleProps" class="l-text-component">
    {{ text }}
  </component>
</template>

<style scoped>
h2.l-text-component,
p.l-text-component {
  margin-bottom: 0;
}
button.l-text-component {
  padding: 5px 10px;
  cursor: pointer;
}
.l-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
}
</style>

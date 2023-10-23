<script lang="ts" setup>
import { map } from 'lodash'
import { computed } from 'vue'
import maps from './propsMap'
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
const emit = defineEmits(['updated'])

function handleCommit(data: any) {
  const finalData = props.mutationExtraData ? { ...data, ...props.mutationExtraData } : data
  // commit
}
const finalProps = computed(() => {
  return map(props.props, (value, key) => {
    const {
      component,
      initialTransform,
      afterTransform,
      eventName,
      text,
      valueProp,
      options,
      subComponent,
      extraProps = {},
      parent,
      extraEvent
    } = maps[key]
    let isHidden = false
    if (parent) {
      isHidden = !props.props.isHidden
    }
    return {
      key,
      component,
      text,
      valueProp,
      isHidden,
      value: initialTransform(value),
      extraProps,
      events: {
        [eventName]: (e: any) => {
          handleCommit({ value: afterTransform(e), key })
        },
        ...(extraEvent && {
          [extraEvent]: (data: any) => {
            emit('updated', { data, key })
          }
        })
      },
      options,
      subComponent
    }
  })
})

console.log('finalProps', finalProps.value)
</script>

<template>
  <div class="props-table">
    <li class="prop-item" v-for="(item, k) in finalProps" :key="k">
      <span class="label" v-if="item.text">{{ item.text }}</span>
      <div :class="`prop-component component-${item.component}`">
        <component
          v-if="!item.options"
          :is="item.component"
          v-bind="item.extraProps"
          v-on="item.events"
          :[item.valueProp]="item.value"
        ></component>
        <component v-else :is="item.component" v-on="item.events" :[item.valueProp]="item.value">
          <component
            v-for="option in item.options"
            :is="item.subComponent"
            :key="option.label"
            :label="option.label"
            :value="option.value"
          >
          </component>
        </component>
        <!-- <component
          v-else
          :is="item.subComponent"
          v-for="(option, k) in item.options"
          :key="k"
          :value="option.value"
          :label="option.label"
        >
        </component> -->
      </div>
    </li>
  </div>
</template>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.hide-item {
  display: none;
}
.label {
  width: 20%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-fontWeight {
  margin-left: 28%;
}
.prop-component {
  width: 70%;
}
</style>

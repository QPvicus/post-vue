<script lang="ts" setup>
import { difference } from 'lodash'
import { computed, ref } from 'vue'
import { defaultEditGroups, type GroupProps } from './defaultProps'
import { checkboxGroupContextKey } from 'element-plus'

const props = withDefaults(
  defineProps<{
    props: Record<string, any>
    groups: GroupProps[]
  }>(),
  {
    groups: () => {
      return defaultEditGroups
    }
  }
)

const currentKey = ref(props.groups.length ? props.groups[0].text : '')
const newGroups = computed(() => {
  const allNormalProps = defaultEditGroups.reduce((prev, current) => {
    return [...prev, ...current.items]
  }, [] as string[])
  // tag 不能编辑，把它过滤掉
  allNormalProps.push('tag')
  allNormalProps.push('right')
  allNormalProps.push('position')
  // 计算每一个组件的独特属性，也就是把通用属性都去掉以后的属性
  const specialProps = difference(Object.keys(props.props), allNormalProps)
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  currentKey.value = '基本属性'
  return [
    {
      text: '基本属性',
      items: specialProps
    },
    ...props.groups
  ]
})
const editGroup = computed(() => {
  return newGroups.value.map((group) => {
    const propsMap = {} as { [key: string]: any }
    group.items.forEach((item) => {
      propsMap[item] = props.props[item]
    })
    return {
      ...group,
      props: propsMap
    }
  })
})
console.log(editGroup.value)
</script>

<template>
  <el-collapse v-model="currentKey" class="edit-group">
    <el-scrollbar>
      <el-collapse-item
        class="collapse-item"
        v-for="item in editGroup"
        :title="item.text"
        :key="item.text"
        :name="item.text"
      >
        <props-table :props="item.props" :mutationExtraData="{isProps: true}"></props-table>
        {{ JSON.stringify(item) }}
      </el-collapse-item>
    </el-scrollbar>
  </el-collapse>
</template>

<style>
.edit-group {
  height: calc(100vh - 40px);
}
.collapse-item {
  padding-left: 15px;
}
</style>

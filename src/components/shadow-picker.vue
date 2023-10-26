<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change'])
const values = computed(() => props.value.split(' '))

function updateValue(newValue: number | string, index: number | number[]) {
  const newValues = computed(() => {
    return values.value.map((item, i) => {
      if (typeof index == 'number' && i == index) {
        return typeof newValue === 'number' ? newValue + 'px' : newValue
      } else if (Array.isArray(index) && index.includes(i)) {
        return typeof newValue === 'number' ? newValue + 'px' : newValue
      } else {
        return item
      }
    })
  })
  emit('change', newValues.value.join(' '))
}
</script>

<template>
  <div class="component-shadow-picker">
    <div class="shadow-item">
      <span>阴影颜色:</span>
      <div class="shadow-component">
        <color-picker
          :value="values[3]"
          @change="
            (v: any) => {
              updateValue(v, 3)
            }
          "
        ></color-picker>
      </div>
    </div>
    <div class="shadow-item">
      <span>阴影大小:</span>
      <div class="shadow-component">
        <el-slider
          :model-value="parseInt(values[0])"
          :min="0"
          :max="20"
          @input="
            (v: any) => {
              updateValue(v, [0, 1])
            }
          "
        ></el-slider>
      </div>
    </div>
    <div class="shadow-item">
      <span>阴影模糊:</span>
      <div class="shadow-component">
        <el-slider
          :model-value="parseInt(values[2])"
          :min="0"
          :max="20"
          @input="
            (v: any) => {
              updateValue(v, 2)
            }
          "
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<style>
.shadow-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.shadow-item span {
  width: 28%;
}
.shadow-component {
  width: 70%;
}
</style>

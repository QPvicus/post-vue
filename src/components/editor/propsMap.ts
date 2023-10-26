// this file map the component props to ant-design-vue form element
// every prop should have five props
// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 initialTransform 初始值的变换，有些初始值需要处理以后在传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
// 6 给组件赋值的时候 属性的名称，一般是 value，也有可能是另外的，比如 checkbox 就是 checked

import { h, type VNode } from 'vue'

interface PropDetailType {
  component: string
  eventName: string
  initialTransform: (v: any) => any
  afterTransform: (v: any) => any
  text?: string
  valueProp: string
  subComponent?: string
  options?: any[]
  extraProps?: { [key: string]: any }
  // 该属性有可能和其他联动，由改父属性控制它的行为
  parent?: string
  // 可能还要向外传递更多事件
  extraEvent?: string
}

interface MapTypes {
  [key: string]: PropDetailType
}

const defaultMap = {
  component: 'el-input',
  eventName: 'update:modelValue',
  valueProp: 'modelValue',
  initialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}

const numberToPxHandle = {
  ...defaultMap,
  component: 'el-input-number',
  initialTransform: (v: string) => (v ? parseInt(v) : 0),
  afterTransform: (e: number) => (e ? `${e}px` : '0')
}
const fontFamilyArr = [
  { label: '宋体', value: '"SimSun","STSong"' },
  { label: '黑体', value: '"SimHei","STHeiti"' },
  { label: '楷体', value: '"KaiTi","STKaiti"' },
  { label: '仿宋', value: '"FangSong","STFangsong"' },
  { label: 'Arial', value: '"Arial", sans-serif' },
  { label: 'Arial Black', value: '"Arial Black", sans-serif' },
  { label: 'Comic Sans MS', value: '"Comic Sans MS"' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Georgia', value: '"Georgia", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' }
]

function calcAlign(text: string) {
  switch (text) {
    case '左':
      return 'left'
    case '中':
      return 'center'
    case '右':
      return 'right'
    default:
      return ''
  }
}

const mapPropsToComponents: MapTypes = {
  text: {
    ...defaultMap,
    component: 'textarea-fix',
    afterTransform: (e: any) => e.target.value,
    text: '文本',
    valueProp: 'value',
    eventName: 'change',
    extraProps: { rows: 3 }
  },
  href: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: '链接'
  },
  fontSize: {
    ...numberToPxHandle,
    text: '字号'
  },
  fontFamily: {
    ...defaultMap,
    component: 'el-select',
    subComponent: 'el-option',
    text: '字体',
    options: fontFamilyArr,
    extraProps: { placeholder: '请选择字体' }
  },
  fontWeight: {
    ...defaultMap,
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => (e ? 'bold' : undefined),
    valueProp: 'checked',
    eventName: 'change',
    extraProps: { iconName: 'bold', tip: '加粗' }
  },
  fontStyle: {
    ...defaultMap,
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => (e ? 'italic' : 'normal'),
    valueProp: 'checked',
    eventName: 'change',
    extraProps: { iconName: 'italic', tip: '斜体' }
  },
  textDecoration: {
    ...defaultMap,
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => (e ? 'underline' : undefined),
    valueProp: 'checked',
    eventName: 'change',
    extraProps: { iconName: 'underline', tip: '下划线' }
  },
  lineHeight: {
    ...defaultMap,
    component: 'el-slider',
    text: '行高',
    initialTransform: (v: string) => (v ? parseFloat(v) : 0),
    afterTransform: (e: number) => e,
    extraProps: { min: 0, max: 3, step: 0.1, 'show-tooltip': true }
  },
  textAlign: {
    ...defaultMap,
    component: 'el-radio-group',
    subComponent: 'el-radio-button',
    afterTransform: (value: any) => calcAlign(value),
    text: '对齐',
    options: [{ label: '左' }, { label: '中' }, { label: '右' }]
  },
  color: {
    ...defaultMap,
    component: 'color-picker',
    text: '文字颜色',
    valueProp: 'value',
    eventName: 'change'
  },
  backgroundColor: {
    ...defaultMap,
    component: 'color-picker',
    text: '背景颜色',
    valueProp: 'value',
    eventName: 'change'
  },
  // actions  //TODO: ddd
  actionType: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '点击',
    options: [
      { value: '', text: '无' },
      { value: 'to', text: '跳转到 URL' }
    ]
  },
  url: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: '链接',
    parent: 'actionType'
  },
  // sizes
  height: {
    ...defaultMap,
    component: 'el-input-number',
    initialTransform: (v: string) => (v ? parseInt(v) : ''),
    afterTransform: (e: number) => (e ? `${e}px` : ''),
    text: '高度'
  },
  width: {
    ...defaultMap,
    component: 'el-input-number',
    initialTransform: (v: string) => (v ? parseInt(v) : ''),
    afterTransform: (e: number) => (e ? `${e}px` : ''),
    text: '宽度'
  },
  paddingLeft: {
    ...numberToPxHandle,
    text: '左边距'
  },
  paddingRight: {
    ...numberToPxHandle,
    text: '右边距'
  },
  paddingTop: {
    ...numberToPxHandle,
    text: '上边距'
  },
  paddingBottom: {
    ...numberToPxHandle,
    text: '下边距'
  },
  // border types
  borderStyle: {
    ...defaultMap,
    component: 'el-select',
    subComponent: 'el-option',
    text: '边框类型',
    options: [
      { value: 'none', label: '无' },
      { value: 'solid', label: '实线' },
      { value: 'dashed', label: '破折线' },
      { value: 'dotted', label: '点状线' }
    ]
  },
  borderColor: {
    ...defaultMap,
    component: 'color-picker',
    text: '边框颜色',
    valueProp: 'value',
    eventName: 'change'
  },
  borderWidth: {
    ...defaultMap,
    component: 'el-slider',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + 'px',
    text: '边框宽度',
    extraProps: { min: 0, max: 20 }
  },
  borderRadius: {
    ...defaultMap,
    component: 'el-slider',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + 'px',
    text: '边框圆角',
    extraProps: { min: 0, max: 200 }
  },
  // shadow and opactiy
  opacity: {
    ...defaultMap,
    component: 'el-slider',
    text: '透明度',
    initialTransform: (v: number) => (v ? v * 100 : 100),
    afterTransform: (e: number) => e / 100,
    extraProps: { min: 0, max: 100, reverse: true }
  },
  boxShadow: {
    ...defaultMap,
    component: 'shadow-picker',
    valueProp: 'value',
    eventName: 'change'
  },
  position: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '定位',
    options: [
      { value: '', text: '默认' },
      { value: 'absolute', text: '绝对定位' }
    ]
  },
  left: {
    ...numberToPxHandle,
    text: 'X轴坐标'
  },
  top: {
    ...numberToPxHandle,
    text: 'Y轴坐标'
  },
  imageSrc: {
    ...defaultMap,
    component: 'image-process',
    valueProp: 'value',
    eventName: 'change'
  },
  backgroundImage: {
    ...defaultMap,
    component: 'background-processer',
    initialTransform: (v: string) => {
      if (v) {
        const matches = v.match(/\((.*?)\)/)
        if (matches && matches.length > 1) {
          return matches[1].replace(/('|")/g, '')
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    afterTransform: (e: string) => (e ? `url('${e}')` : ''),
    extraProps: { ratio: 8 / 15, showDelete: true },
    extraEvent: 'uploaded'
  },
  backgroundSize: {
    ...defaultMap,
    component: 'el-select',
    subComponent: 'el-option',
    text: '背景大小',
    options: [
      { value: 'contain', label: '自动缩放' },
      { value: 'cover', label: '自动填充' },
      { value: '', label: '默认' }
    ]
  },
  backgroundRepeat: {
    ...defaultMap,
    component: 'el-select',
    subComponent: 'el-option',
    text: '背景重复',
    options: [
      { value: 'no-repeat', label: '无重复' },
      { value: 'repeat-x', label: 'X轴重复' },
      { value: 'repeat-y', label: 'Y轴重复' },
      { value: 'repeat', label: '全部重复' }
    ]
  }
}

export default mapPropsToComponents

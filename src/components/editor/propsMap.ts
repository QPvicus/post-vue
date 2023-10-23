// this file map the component props to ant-design-vue form element
// every prop should have five props
// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 intialTransform 初始值的变换，有些初始值需要处理以后在传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
// 6 给组件赋值的时候 属性的名称，一般是 value，也有可能是另外的，比如 checkbox 就是 checked

interface PropDetailType {
  component: string
  eventName: string
  initialTransform: (v: any) => any
  afterTransform: (v: any) => any
  text?: string
  valueProp: string
  subComponent?: string
  options?: { text: string | VNode; value: any }[]
  extraProps?: { [key: string]: any }
  // 该属性有可能和其他联动，由改父属性控制它的行为
  parent?: string
  // 可能还要向外传递更多事件
  extraEvent?: string
}

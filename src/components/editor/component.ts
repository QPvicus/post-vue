import { textDefaultProps, imageDefaultProps, componentsDefaultProps } from './defaultProps'

export interface CreateComponentType {
  name: string
  text?: string
  type?: string
  props: Record<string, any>
}

// the component name list
export const textPropsList = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2'
  },
  {
    text: '楷体副标题',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: '"KaiTi","STKaiti"',
    tag: 'h2'
  },
  {
    text: '正文内容',
    tag: 'p'
  },
  {
    text: '宋体正文内容',
    tag: 'p',
    fontFamily: '"SimSun","STSong"'
  },
  {
    text: 'Arial style',
    tag: 'p',
    fontFamily: '"Arial", sans-serif'
  },
  {
    text: 'Comic Sans',
    tag: 'p',
    fontFamily: '"Comic Sans MS"'
  },
  {
    text: 'Courier New',
    tag: 'p',
    fontFamily: '"Courier New", monospace'
  },
  {
    text: 'Times New Roman',
    tag: 'p',
    fontFamily: '"Times New Roman", serif'
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p'
  },
  {
    text: '按钮内容',
    color: '#ffffff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    tag: 'button',
    textAlign: 'center'
  }
]

export const textList: CreateComponentType[] = textPropsList.map((prop) => {
  return {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      ...prop
    }
  }
})

export const imageSourceList = [
  'http://static.imooc-lego.com/upload-files/frame-096161.png',
  'http://static.imooc-lego.com/upload-files/text-449964.png',
  'http://static.imooc-lego.com/upload-files/text2-288504.png',
  'http://static.imooc-lego.com/upload-files/money-664239.png',
  'http://static.imooc-lego.com/upload-files/bag-904186.png'
]

export const imageList: CreateComponentType[] = imageSourceList.map((url) => {
  return {
    name: 'l-image',
    props: {
      ...imageDefaultProps,
      imageSrc: url,
      width: '150px'
    }
  }
})

export const shapePropList = [
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '50px'
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: '100px',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#36cfc9',
    width: '100px',
    height: '50px'
  },
  {
    backgroundColor: '#40a9ff',
    borderRadius: '100px',
    width: '100px',
    height: '100px'
  },
  {
    backgroundColor: '#9254de',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px'
  }
]

export const shapeList: CreateComponentType[] = shapePropList.map((prop) => {
  return {
    name: 'l-shape',
    props: {
      ...componentsDefaultProps['l-shape'].props,
      ...prop
    }
  }
})

// const renderComponentMap = {
// 'el-button':
// }

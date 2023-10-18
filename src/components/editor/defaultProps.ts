import { mapValues } from 'lodash'

interface DefaultPropsType {
  [key: string]: {
    props: object
    extraProps?: Record<string, any>
  }
}

export type isEditing = boolean

export const commonDefaultProps = {
  // actions
  actionType: '',
  url: '',
  // size
  height: '',
  width: '',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: 1,
  // position and x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0'
}

export const textDefaultProps = {
  // basic props - font styles
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps,
  width: '318px'
}

export const imageDefaultProps = {
  imageSrc: '',
  ...commonDefaultProps
}

export const componentsDefaultProps: DefaultPropsType = {
  'l-text': {
    props: {
      text: '正文内容',
      ...textDefaultProps,
      fontSize: '14px',
      width: '125px',
      height: '36px',
      left: 320 / 2 - 125 / 2 + 'px',
      top: 500 / 2 - 36 / 2 + 'px'
    }
  },
  'l-image': {
    props: {
      ...imageDefaultProps
    }
  },
  'l-shape': {
    props: {
      backgroundColor: '',
      ...commonDefaultProps
    }
  }
}

export const isEditingProp = {
  isEditing: {
    type: Boolean,
    default: false
  }
}

export const transformToComponentProps = (
  props: Record<string, any>,
  extraProps?: {[key: string]: any}
) => {
  const mapProps = mapValues(props, (item) => {
    return {
      type: item.constructor,
      default: item
    }
  }) as Record<string, any>
  if (extraProps) return { ...mapProps, ...extraProps }
  return mapProps
}

export default componentsDefaultProps

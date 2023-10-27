export interface User {
  id?: string
  username?: string
  phoneNumber?: string
  nickName?: string
  description?: string
  updatedAt?: string
  createdAt?: string
  iat?: number
  exp?: number
  picture?: string
  gender?: string
}

export interface UserProps {
  isLogin: boolean
  token: string
  data: User
}

export interface Status {
  loading: boolean
  error: any
  opName?: string
}

export interface ComponentData {
  id: string
  props: Record<string, any>
  name: string
  layerName?: string
  isHidden?: boolean
  isLocked?: boolean
}

export interface PageData {
  props: Record<string, any>
  setting: Record<string, any>
  id?: string
  title?: string
  desc?: string
  coverImg?: string
  uuid?: string
  latestPublishAt?: string
  updatedAt?: string
  isTemplate?: boolean
  isHot?: boolean
  isNew?: boolean
  author?: string
  copiedCount?: number
  status?: string
  user?: {
    gender: string
    nickName: string
    picture: string
    userName: string
  }
}

export interface ChannelProps {
  id: number
  name: string
  workId: number
}

export interface HistoryProps {
  id: string
  componentId?: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface EditProps {
  // 页面所有组件
  components: ComponentData[]
  // 当前 work 的数据
  page: PageData
  // 当前被选中的组件 id
  currentElement: string
  // 当前数据已经被修改
  isDirty: boolean
  // 当前模版是否修改但未发布
  isChangedNotPublished: boolean
  // 当前正在 inline editing 的组件
  currentEditing: string
  // 当前操作的历史记录
  histories: HistoryProps[]
  // 当前历史记录的操作位置
  historyIndex: number
  // 当前 work 的 channels
  channels: ChannelProps[]
}

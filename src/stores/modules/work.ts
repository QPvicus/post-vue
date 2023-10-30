import { defineStore } from 'pinia'
import type { PageData } from '../types'
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { objToQueryString } from '@/utils'
import { works } from './mockData'
export type WorkProp = Required<Omit<PageData, 'props' | 'setting'>> & {
  barcodeUrl?: string
}

export interface StaticProps {}

export interface WorkProps {
  templates: WorkProp[]
  works: WorkProp[]
  statics: { id: number; name: string; list: StaticProps[] }[]
  totalWorks: number
  totalTemplates: number
  searchText: string
}

export const useWorkStore = defineStore('post-work', () => {
  const work = reactive<WorkProps>({
    templates: [],
    works: [],
    totalTemplates: 0,
    totalWorks: 0,
    searchText: '',
    statics: []
  })

  async function createWork(payload: any) {
    //  发送请求
    const data: Record<string, any> = {
      isTemplate: false,
      copiedCount: 0,
      status: 1,
      channels: [],
      _id: '653b06b43c38490fbb8' + uuidv4(),
      title: '未命名作品',
      desc: '未命名作品',
      coverImg:
        'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png',
      user: '65276d463c02c3488c82e694',
      author: '13175087561',
      uuid: uuidv4(),
      createdAt: '2023-10-27T00:39:16.912Z',
      updatedAt: '2023-10-27T00:39:16.912Z',
      id: 6242,
      __v: 0
    }
    await new Promise((resolve) => resolve(1))
    // @ts-ignore
    work.works.unshift(data)
    return data
  }

  async function fetchWorks(opt = { pageIndex: 0, pageSize: 8, title: '' } as any) {
    if (!opt.title) {
      delete opt.title
    }

    const queryString = objToQueryString(opt)
    await new Promise((resolve) => resolve(1))
    const extraData = { pageIndex: opt.pageIndex, searchText: opt.title }
    const { pageIndex, searchText } = extraData
    const { list, count } = works.data
    work.works = list
    work.totalWorks = count
    work.searchText = searchText || ''
    return works
  }
  return {
    work,
    createWork,
    fetchWorks
  }
})

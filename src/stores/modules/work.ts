import { defineStore } from 'pinia'
import type { PageData } from '../types'
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { objToQueryString } from '@/utils'
import { works } from './mockData'
import axios, { type AxiosRequestConfig } from 'axios'
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
    const { data } = await axios.post(`/works/`, payload)
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

  async function deleteWork(id: string) {
    // const newConfig: AxiosRequestConfig & { mutationName: string } = {
    //   method: 'delete',
    //   mutationName: 'deleteWork'
    // }
    // const { data } = await axios(`/works/${id}`, newConfig)
    await new Promise((res) => res(200))
    work.works = work.works.filter((w) => w.id != id)
  }
  return {
    work,
    createWork,
    fetchWorks,
    deleteWork
  }
})

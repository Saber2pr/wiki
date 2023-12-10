import { ResponseConfig } from '@saber2pr/request'

import { origin } from '../config'
import { axios, memoGet } from './axios'

export const request = async (type: keyof typeof origin.data): Promise<any> => {
  if(type === 'wiki') {
    if(window.__wiki) {
      return window.__wiki
    }
  }

  let url = origin.data[type]
  let res: ResponseConfig<any>

  // version no-cache
  if (type === 'version') {
    // no memo
    url += `?t=${Date.now()}`
    res = await axios.get(url)
  } else {
    if (origin.isWiki) {
      res = await memoGet<string>('/' + origin.repo + url)
    } else {
      // memo get
      res = await memoGet<string>(url)
    }
  }

  return res.data
}

export const requestContent = async (url: string) => {
  if(window.__blog) {
    return decodeURIComponent(window.__blog)
  }
  let res: ResponseConfig<any>
  if (origin.isWiki) {
    res = await memoGet<string>('/' + origin.repo + url)
  } else {
    // memo get
    res = await memoGet<string>(url)
  }
  if (!res) throw new Error('错误：请求的资源未找到！')
  return res.data
}

import { whenInDEV } from './../utils/whenInDEV'
import { axios } from '../request/axios'
import { ApiUrls } from './apiUrls'
import { IV } from './interface'
import { origin } from '../config'
import config from '../../app.json'

const disableIV =
  whenInDEV() ||
  localStorage.getItem(origin.constants.disable_iv) ||
  config.userId !== 'saber2pr'

export const pushIV = (action: IV['action']) => {
  if (disableIV) return
  if (typeof returnCitySN !== 'undefined') {
    const data: IV = {
      ...returnCitySN,
      date: Date.now(),
      action,
    }
    axios.post(ApiUrls.v, {
      params: data,
    })
    if(action.type === '页面访问'){
      axios.post(ApiUrls.pv, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          pagePath: action.payload
        }
      })
    }
  }
}

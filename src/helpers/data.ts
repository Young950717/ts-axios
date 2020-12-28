import { isPlainObject } from './utils'

/**
 * 格式化请求的data数据
 * @param data 
 */
const transformRequest = function (data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 格式化响应的data数据
 * @param data 
 */
const trahsformResponse = function (data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // console.log(e)
    }
  }
  return data
}
export {
  transformRequest,
  trahsformResponse
}
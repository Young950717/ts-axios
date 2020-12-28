import { Method } from '../types'
import { deepMerge, isPlainObject } from './utils'

/**
 * 辅助函数，配置Content-Type字符串的格式
 * @param headers 
 * @param normalizedName 
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && normalizedName.toUpperCase() === name.toUpperCase()) {
      headers[normalizedName] = headers[name]
      // Reflect.deleteProperty(headers, 'name')
      delete headers[name]
    }
  })
}

/**
 * 如果data的值为普通对象，则自动配置headers里Content-Type的值为application/json;charset=utf-8
 * @param headers 
 * @param data post请求的data值
 */
const processHeaders = function (headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 格式化响应headers,变成key-value的格式
 * @param headers 
 */
const parserHeaders = function (headers: string): any {
  let parsed = Object.create(null)
  if (!headers) return parsed
  headers.split('\r\n').forEach(row => {
    let [key, val] = row.split(':')
    if (!key) return
    key = key.trim().toLowerCase()
    val && (val = val.trim())
    parsed[key] = val
  })
  return parsed
}

/**
 * 合并后的headers是个多级的对象,提取所需要的值
 * @param headers 合并的headers
 * @param method config中的method
 */
const flattenHeaders = function (headers: any, method: Method): any {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['get', 'post', 'put', 'head', 'options', 'patch', 'common', 'delete']
  methodsToDelete.forEach(method => {
    Reflect.deleteProperty(headers, method)
  })

  return headers
}

export {
  processHeaders,
  parserHeaders,
  flattenHeaders
}
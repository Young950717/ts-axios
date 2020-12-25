import { isPlainObject } from './utils'

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
export {
  processHeaders
}
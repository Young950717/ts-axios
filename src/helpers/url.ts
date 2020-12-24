import { isDate, isObject } from './utils'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
/**
 * 处理url格式的工具函数
 * 1. 正常拼接 => get?a=1&b=2
 * 2. 参数为数组 => get?foo[]=bar&foo[]=baz'
 * 3. 参数为对象 => foo=%7B%22bar%22:%22baz%22%7D 需encode
 * 4. 参数为Date => get?date=2019-04-01T05:55:39.030Z 需调用Date.prototype.toISOString()方法
 * 5. 特殊字符串的处理 => 转义
 * 6. 空值忽略
 * 7. 丢弃 url 中的哈希标记
 * 8. 保留 url 中已存在的参数
 * @param url 请求地址
 * @param params 请求参数
 */
const buildURL = function (url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (key === null || typeof key === 'undefined') {
      // 空值跳过
      return
    }
    let values
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]

    }
    values.forEach(v => {
      if (isDate(v)) {
        v = v.toISOString()
      } else if (isObject(v)) {
        v = JSON.stringify(v)
      }
      parts.push(`${encode(key)}=${encode(v)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markidx = url.indexOf('#')
    if (markidx !== -1) {
      url = url.slice(0, markidx)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  console.log('url===============', url)

  return url
}
export {
  buildURL
}
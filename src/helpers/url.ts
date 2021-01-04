/**
 * @description 对url做拼接或者格式化处理
 */

interface URLOrigin {
  host: string
  protocol: string
}

import { isDate, isPlainObject, isURLSearchParams } from './utils'

/**
 * 对特殊字符的转义
 * @param val
 */
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
const buildURL = function (url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
        } else if (isPlainObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(`${encode(key)}=${encode(v)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  if (serializedParams) {
    const markidx = url.indexOf('#')
    if (markidx !== -1) {
      url = url.slice(0, markidx)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

const isURLSameOrigin = function (requestUrl: string): boolean {
  const parsedOrigin = resolveURL(requestUrl)
  return (parsedOrigin.protocol === currentOrigin.protocol)
    && (parsedOrigin.host === currentOrigin.host)
}
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { host, protocol } = urlParsingNode
  return {
    host,
    protocol
  }
}

const isAbsoluteURL = function (url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

const combineURL = function (baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export {
  buildURL,
  isURLSameOrigin,
  isAbsoluteURL,
  combineURL
}

/**
 * @description 底层基于XMLHttpRequest发送请求的方法
 */
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parserHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utils'
import cookie from '../helpers/cookie'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      data = null,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    // 1.创建实例
    const xhr = new XMLHttpRequest()
    // 2.初始化
    xhr.open(method.toUpperCase(), url!, true)
    // 3.配置xhr对象
    configureRequest()
    // 4.添加xhr一些事件处理函数
    addEvents()
    // 5.添加处理headers的逻辑
    processHeaders()
    // 6.添加请求取消的逻辑
    processCancel()
    // 7.发送请求
    xhr.send(data)

    function configureRequest(): void {
      responseType && (xhr.responseType = responseType)

      timeout && (xhr.timeout = timeout)

      withCredentials && (xhr.withCredentials = withCredentials)
    }
    function addEvents(): void {
      xhr.onreadystatechange = function handleLoad() {
        if (xhr.readyState !== 4) {
          return
        }
        if (xhr.status === 0) {
          // 网络超时或者错误
          return
        }
        const responseHeaders = xhr.getAllResponseHeaders()
        const responseData = responseType !== 'text' ? xhr.response : xhr.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parserHeaders(responseHeaders),
          config,
          request: xhr
        }
        handleResponse(response)
      }

      xhr.onerror = function handleError() {
        reject(createError('netweork error', config, null, xhr))
      }

      xhr.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED', xhr))
      }

      onDownloadProgress && (xhr.onprogress = onDownloadProgress)

      onUploadProgress && (xhr.upload.onprogress = onUploadProgress)
    }
    function processHeaders(): void {
      if (isFormData(data)) {
        Reflect.deleteProperty(headers, 'Content-Type')
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsfrValue = cookie.read(xsrfCookieName)
        if (xsfrValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsfrValue
        }
      }
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          Reflect.deleteProperty(headers, 'name')
          // delete headers[name]
        } else {
          xhr.setRequestHeader(name, headers[name])
        }
      })
    }
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          xhr.abort()
          reject(reason)
        })
      }
    }
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            xhr,
            response
          )
        )
      }
    }
  })
}

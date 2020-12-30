/**
 * @description 底层基于XMLHttpRequest发送请求的方法
 */
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parserHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
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
      xsrfHeaderName
    } = config

    const xhr = new XMLHttpRequest()

    responseType && (xhr.responseType = responseType)

    timeout && (xhr.timeout = timeout)

    withCredentials && (xhr.withCredentials = withCredentials)

    xhr.open(method.toUpperCase(), url!, true)

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

    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsfrValue = cookie.read(xsrfCookieName)
      if (xsfrValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsfrValue
      }
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        Reflect.deleteProperty(headers, 'name')
        // delete headers[name]
      } else {
        xhr.setRequestHeader(name, headers[name])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        xhr.abort()
        reject(reason)
      })
    }

    xhr.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status <= 300) {
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

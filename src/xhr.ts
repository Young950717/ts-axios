
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index'
import { parserHeaders } from './helpers/headers'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {

    const { url, data = null, method = 'get', headers, responseType } = config

    const xhr = new XMLHttpRequest()

    responseType && (xhr.responseType = responseType)

    xhr.open(method.toUpperCase(), url, true)

    xhr.onreadystatechange = function handleLoad() {
      if (xhr.readyState !== 4) {
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
      resolve(response)
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        // Reflect.deleteProperty(headers, 'name')
        delete headers[name]
      } else {
        xhr.setRequestHeader(name, headers[name])
      }
    })

    xhr.send(data)
  })

}

import { AxiosRequestConfig } from './types/index'
export default function xhr(config: AxiosRequestConfig): void {
  const { url, data = null, method = 'get', headers } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url, true)
  Object.keys(headers).forEach(name => {
    if (data === null && name.toLowerCase() === 'content-type') {
      // Reflect.deleteProperty(headers, 'name')
      delete headers[name]
    } else {
      xhr.setRequestHeader(name, headers[name])
    }
  })
  xhr.send(data)
}

/**
 * @description 发送请求前的处理函数
 */
import xhr from './xhr'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
// import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders } from '../helpers/headers' // processHeaders
import transform from './transform'
function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  thorwIfCancellationRequest(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // config.headers = transformHeaders(config)

  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}
function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer) // url断言 不为空
}
// function transformRequestData(config: AxiosRequestConfig): any {
//   const { data } = config
//   return transformRequest(data)
// }
// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }
function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function thorwIfCancellationRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.thorwIfRequest()
  }
}


export default dispatchRequest
export { transformUrl }

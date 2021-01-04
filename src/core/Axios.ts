/**
 * @description Axios类
 */
import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  RejectedFn,
  ResolveFn
} from '../types'
import dispatchRequest, { transformUrl } from './dispatchRequest'
import InterceptorManager from '../core/InterceptorManager'
import mergeConfig from './mergeConfig'
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
  resolve: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  private requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }
  private requestMethodWithData(
    method: Method,
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)
    const chain: PromiseChain<any>[] = [
      {
        resolve: dispatchRequest,
        rejected: undefined
      }
    ]
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolve, rejected } = chain.shift()!
      promise = promise.then(resolve, rejected)
    }
    return promise
  }
  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('head', url, config)
  }
  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData('options', url, config)
  }
  post(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('post', url, data, config)
  }
  put(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('patch', url, data, config)
  }
  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config!)
    return transformUrl(config)
  }
}

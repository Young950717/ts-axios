/**
 * @description 工厂模式 返回混合类型的axios实例
 */
import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaultsConfig from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
/**
 * 创建一个混合类型，让axios实例即可以axios(config)这样子调用,也可以axios.request() qxios.get()这样子调用
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}
const axios = createInstance(defaultsConfig)
axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaultsConfig, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
axios.all = function (promises) {
  return Promise.all(promises)
}
axios.spread = function (callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios
export default axios

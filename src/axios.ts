
import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

/**
 * 创建一个混合类型，让axios实例即可以axios(config)这样子调用,也可以axios.request() qxios.get()这样子调用
 */
function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}
const axios = createInstance()
export default axios
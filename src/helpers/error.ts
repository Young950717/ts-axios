/**
 * @description 统一建立Axios error之后的具体信息
 */
import { AxiosRequestConfig, AxiosResponse } from '../types'
class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 解决ts的一些问题，如instanc of异常 继承Error类后实例方法无法调用的问题
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * 工厂模式，返回一个AxiosError对象
 * @param message 错误信息提示
 * @param config config
 * @param code 错误code
 * @param request
 * @param response
 */
const createError = function(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
export { createError }

/**
 * @description 拦截器管理类
 */
import { ResolveFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolve: ResolveFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }
  use(resolve: ResolveFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolve,
      rejected
    })
    return this.interceptors.length - 1
  }
  // 内部调用的forEach方法，作用是操作拦截器数组里面的拦截器
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}

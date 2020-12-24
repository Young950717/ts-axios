import { isPlainObject } from './utils'
const transformRequest = function (data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
export {
  transformRequest
}
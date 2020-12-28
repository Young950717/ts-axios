import { AxiosRequestConfig } from './types'

const defaluts: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}
const methodsWithNodata = ['delete', 'get', 'options', 'head']
const methodsWithdata = ['post', 'put', 'patch']
methodsWithNodata.forEach(m => {
  defaluts.headers[m] = {}
})
methodsWithdata.forEach(m => {
  defaluts.headers[m] = {
    'Content-type': 'application/x-www-form-urlencoded'
  }
})
export default defaluts
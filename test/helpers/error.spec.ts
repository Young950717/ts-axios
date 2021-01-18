import { describe, expect, test } from '@jest/globals'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'
import { createError } from '../../src/helpers/error'

describe('helper:error', () => {
  test('should create an Error with message config code request response and AxiosError', () => {
    const xhr = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: null,
      request: xhr,
      config,
      data: {
        foo: 'bar'
      }
    }
    const error = createError('galigeigei', config, 'failed', xhr, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.config).toBe(config)
    expect(error.message).toBe('galigeigei')
    expect(error.request).toBe(xhr)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
    expect(error.code).toBe('failed')
  })
})
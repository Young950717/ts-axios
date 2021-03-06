import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'
import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals'
describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('shoule treat method value as lowercase string', () => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on errorNet', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    jasmine.Ajax.uninstall()
    return axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(rejectSpy instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('netweork error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))
      jasmine.Ajax.install()
    }
  })


  test('should reject when timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(e => {
      e = err
    })
    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000ms exceeded')
        done()
      }, 100)
    })
  })


  test('should reject when validateStatus return false', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response.status).toBe(500)
    }
  })


  test('should reject when validateStatus return true', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(reason.config.url).toBe('/foo')
    }
  })


  test('should return JSON when resolve', done => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"error":0}'
      })
    })
    setTimeout(() => {
      expect(response.data).toEqual({ error: 0 })
      done()
    }, 100)
  })

  test('should return JSON when reject', done => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "Bad USERNAME", "code": -1}'
      })
    })
    setTimeout(() => {
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('Bad USERNAME')
      expect(response.data.code).toBe(-1)
      done()
    }, 100)
  })


  test('should supply correct response', done => {
    let response: AxiosResponse
    axios('/foo').then(res => {
      response = res
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo":"bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
    setTimeout(() => {
      expect(response.data.foo).toBe('bar')
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('bar')
      expect(response.headers['content-type']).toBe('application/json')
      done()
    })
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    let response: AxiosResponse
    axios.post(
      '/foo',
      {
        prop: 'value'
      },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    ).then(res => {
      response = res
    })
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['content-type']).toBe('application/json')
    })
  })
})
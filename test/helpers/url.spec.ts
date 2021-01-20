import { describe, expect, test, jest } from '@jest/globals'
import {
  buildURL,
  isURLSameOrigin,
  isAbsoluteURL,
  combineURL
} from '../../src/helpers/url'

describe('helper:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(buildURL('/foo', {
        name: 'testName'
      })).toBe('/foo?name=testName')
    })
    test('should ignore if some params is null', () => {
      expect(buildURL('/foo', {
        name: 'testName',
        data: null
      })).toBe('/foo?name=testName')
    })
    test('should ignore if the only param value is null', () => {
      expect(
        buildURL('/foo', {
          baz: null
        })
      ).toBe('/foo')
    })
    test('should support object params', () => {
      expect(buildURL('/foo', {
        obj: {
          name: 'testName'
        }
      })).toBe(`/foo?obj=${encodeURI('{"name":"testName"}')}`)
    })
    test('should support date params', () => {
      const date = new Date()
      expect(buildURL('/foo', {
        date
      })).toBe(`/foo?date=${date.toISOString()}`)
    })
    test('should support any params', () => {
      expect(buildURL('/foo', {
        name: ['mike', 'sam']
      })).toBe('/foo?name[]=mike&name[]=sam')
    })
    test('should support chart params', () => {
      expect(buildURL('/foo', {
        name: '@:$, '
      })).toBe('/foo?name=@:$,+')
    })
    test('should support existing params', () => {
      expect(buildURL('/foo?name=sam', {
        age: 18
      })).toBe('/foo?name=sam&age=18')
    })
    test('should support correct discard url hash mark', () => {
      expect(buildURL('/foo?name=sam#has', {
        data: 'one'
      })).toBe('/foo?name=sam&data=one')
    })
    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled() // 函数被调用了
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('foo=baz'))).toBe('/foo?foo=baz')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })
})

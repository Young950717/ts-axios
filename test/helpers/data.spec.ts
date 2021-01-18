import { describe, expect, test } from '@jest/globals'
import { transformRequest, transformResponse } from '../../src/helpers/data'
describe('helper:data', () => {
  describe('transformRequest', () => {
    test('should transform request if data is a PlainObject', () => {
      const obj = { a: 1 }
      expect(transformRequest(obj)).toBe('{"a":1}')
    })
    test('do nothing if data is not a PlainObject', () => {
      const obj = new URLSearchParams('a=b')
      expect(transformRequest(obj)).toBe(obj)
    })
  })
  describe('transformResponse', () => {
    test('should transform response if data is not a PlainObject', () => {
      const obj = '{"a":1}'
      expect(transformResponse(obj)).toEqual({ a: 1 })
    })
    test('should do nothing if data is a string but not a JSON string', () => {
      const str = '{a:1}'
      expect(transformResponse(str)).toBe(str)
    })
    test('should do nothing if data is not a string', () => {
      const obj = { a: 2 }
      expect(transformResponse(obj)).toBe(obj)
    })
  })
})
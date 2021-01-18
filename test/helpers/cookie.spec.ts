import { describe, expect, test } from '@jest/globals'
import cookie from '../../src/helpers/cookie'
describe('helper: cookie', () => {
  test('shoule read cookie', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })
  test('shoule be null if cookie is not exist', () => {
    expect(cookie.read('abc')).toBeNull()
  })
})
const checkFn = Object.prototype.toString

/**
 * 判断是否为Date类型的值
 * @param val 
 */
const isDate = function (val: any): val is Date {
  return checkFn.call(val) === '[object Date]'
}

/**
 * 判断是否为Object类型的值
 * @param val 
 */
// const isObject = function (val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

/**
 * 判断是否为一个普通对象
 * @param val 
 */
const isPlainObject = function (val: any): val is Object {
  return checkFn.call(val) === '[object Object]'
}

// 创造一个混入类型
const extend = function <T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export {
  isDate,
  // isObject,
  isPlainObject,
  extend
}

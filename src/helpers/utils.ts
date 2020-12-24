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

export {
  isDate,
  // isObject,
  isPlainObject
}
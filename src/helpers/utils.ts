const checkFn = Object.prototype.toString
const isDate = function (val: any): val is Date {
  return checkFn.call(val) === '[object Date]'
}
const isObject = function (val: any): val is Object {
  return val !== null && typeof val === 'object'
}
export {
  isDate,
  isObject
}
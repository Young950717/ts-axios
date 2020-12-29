export default class Cancel {
  message?: string
  constructor(message: string = '') {
    this.message = message
  }
}
const isCancel = function (value: any): boolean {
  return value instanceof Cancel
}
export {
  isCancel
}
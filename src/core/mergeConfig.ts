import { isPlainObject, deepMerge } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

// 默认策略，有谁选谁
function defalutStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只选val2的策略
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}

/**
 * 类似headers参数的复杂合并策略
 * @param val1 默认配置
 * @param val2 用户传入配置
 */
function deppMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const starts = new Map()
const startKeysFromValue = ['data', 'url', 'params']
startKeysFromValue.forEach(key => {
  starts.set(key, fromVal2Strat)
})
const startKeysDeepMerge = ['headers']
startKeysDeepMerge.forEach(key => {
  starts.set(key, deppMergeStrat)
})
export default function mergeConfig(config1: AxiosRequestConfig, config2: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (const key in config2) {
    mergeField(key)
  }
  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string) {
    const strat = starts.get(key) || defalutStrat
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
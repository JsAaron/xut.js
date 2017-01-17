import flowConfig from './flow'
/**
 * 结果缓存
 * @type {Object}
 */
let _cache = {}

/**
 * flow类型标记
 * @type {String}
 */
const FLOWTYPE = 'flow'


export function setFlowTranslate(...arg) {
    return flowConfig.translate(...arg)
}



export function adapterDestory(...arg) {
    _cache = {}
}

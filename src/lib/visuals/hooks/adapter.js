import flowConfig from './flow'
import defaultConfig from './default'

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

/**
 * 获取flow页面布局数据
 * @param  {[type]} config         [description]
 * @param  {[type]} fullProportion [description]
 * @return {[type]}                [description]
 */
export function getFlowView() {
    return _cache[FLOWTYPE] ? _cache[FLOWTYPE] : _cache[FLOWTYPE] = flowConfig.view()
}


export function setFlowTranslate(...arg) {
    return flowConfig.translate(...arg)
}



export function adapterDestory(...arg) {
    _cache = {}
}

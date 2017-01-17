import { config, dynamicView, dynamicProportion } from '../config/index'

/**
 * 设置默认的样式
 * @return {[type]} [description]
 */

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    return 'translate(' + offset + 'px,0px)' + translateZ
}

/**
 * 混入钩子处理
 * @param  {[type]} original [description]
 * @param  {[type]} hook     [description]
 * @return {[type]}          [description]
 */
const mixHooks = function(original, hook) {
    if (hook) {
        let newValue = hook(original)
        if (newValue !== undefined) {
            return newValue
        }
    }
    return original
}

/**
 * 检测页面是否宽度溢出
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getStyle = function(pageIndex) {
    let pageObj = Xut.Presentation.GetPageObj(pageIndex)
    return pageObj && pageObj.getStyle
}






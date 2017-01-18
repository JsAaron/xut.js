import { config, dynamicProportion } from '../../config/index'

/**
 * 修复动态的缩放比
 * @return {[type]} [description]
 */
export function visualProportion(data) {
    if(data.needRecalculate) {
        //如果是模式3，缩放比的尺寸数据需要对调
        if(data.dynamicVisualMode === 4) {
            let subViewSize = data.subViewSize
            return dynamicProportion({
                width: subViewSize.viewWidth,
                height: subViewSize.viewHeight,
                top: subViewSize.viewTop,
                left: subViewSize.viewLeft
            })
        }
        return dynamicProportion({
            width: data.viewWidth,
            height: data.viewHeight,
            top: data.viewTop,
            left: data.viewLeft
        })
    } else {
        return config.proportion
    }
}

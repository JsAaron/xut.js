import { config, dynamicProportion } from '../../config/index'

/**
 * 修复动态的缩放比
 * @return {[type]} [description]
 */
export function visualProportion(data) {
    if (data.needRecalculate) {
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

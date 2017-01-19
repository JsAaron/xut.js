import { config, dynamicProportion } from '../../config/index'

/**
 * 修复动态的缩放比
 * @return {[type]} [description]
 */
export function visualProportion(data) {
    if(data.needRecalculate) {
        return dynamicProportion({
            width: data.visualWidth,
            height: data.visualHeight,
            top: data.visualTop,
            left: data.visualLeft
        })
    } else {
        return config.proportion
    }
}

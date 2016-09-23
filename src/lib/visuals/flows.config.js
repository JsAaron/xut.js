import { config } from '../config/index'

/**
 * flow页面的style设置
 * @return {[type]} [description]
 */
export default function styleConfig() {

    //默认值全屏
    //config.visualMode === 0
    const data = {
        containerWidth: config.screenSize.width,
        containerHeight: config.screenSize.height,
        dcontainerTop: 0
    }

    //宽度100%的情况下
    //如果是flow页面处理,全屏
    if (config.visualMode === 2) {

        if (config.pptVertical) {
            //其他页面上下压缩，左右100%
            //flows页面宽高都是100%
            if (config.screenVertical) {
                data.containerWidth = config.screenSize.width
                data.containerHeight = config.screenSize.height
                data.containerTop = 0
            } else {
                data.containerWidth = config.viewSize.width
                data.containerHeight = config.viewSize.height
                data.containerTop = 0
            }
        }

    }

    //高度100%的情况下
    //flow下,设置容易宽度
    if (config.visualMode === 3) {
        if (config.pptVertical) {
            if (config.screenVertical) {
            } else {

            }
        }
    }

    return data
}

import { config } from '../config/index'

/**
 * flow页面的style单独设置
 * @return {[type]} [description]
 */
export default function getFlowStyle() {

    let newViewWidth = config.screenSize.width
    let newViewHeight = config.screenSize.height
    let newViewTop = 0


    //宽度100%的情况下
    //如果是flow页面处理,全屏
    if (config.visualMode === 2) {

        if (config.pptVertical) {
            //其他页面上下压缩，左右100%
            //flows页面宽高都是100%
            if (config.screenVertical) {
                newViewWidth = config.screenSize.width
                newViewHeight = config.screenSize.height
                newViewTop = 0
            } else {
                newViewWidth = config.viewSize.width
                newViewHeight = config.viewSize.height
                newViewTop = 0
            }
        }

    }

    //高度100%的情况下
    //flow下,设置容易宽度
    if (config.visualMode === 3) {

        if (config.pptVertical) {
            //竖版竖版
            //高度100%,宽度会存在溢出
            //所以需要修复flow页面是全屏状态
            if (config.screenVertical) {
                newViewWidth = config.screenSize.width
                    // data.containerLeft = (config.viewSize.width - config.screenSize.width) / 2
            } else {

            }
        }

    }



    //默认值全屏
    //config.visualMode === 0
    return {
        newViewWidth,
        newViewHeight,
        newViewTop
    }
}

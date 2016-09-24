const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 全局可视区域布局处理
 * @param  {[type]} () [description]
 * @return {[type]}    [description]
 */
export default function getViewSize(config, fullProportion) {

    const screenWidth = config.screenSize.width
    const screenHeight = config.screenSize.height

    let newWidth = screenWidth
    let newHeight = screenHeight
    let newTop = 0
    let newLeft = 0

    /**
     * 宽度100%
     * 正比缩放高度
     * @param  {[type]} config.visualMode [description]
     * @return {[type]}                   [description]
     */
    if (config.visualMode === 2) {
        //竖版PPT
        if (config.pptVertical) {

            //竖版显示
            if (config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
            }
            //横版显示
            else {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
        }
    }

    /**
     * 高度100%
     * 正比缩放宽度
     * @param  {[type]} config.visualMode [description]
     * @return {[type]}                   [description]
     */
    if (config.visualMode === 3) {
        //竖版PPT
        if (config.pptVertical) {

            //竖版显示
            //高度100%，宽度溢出
            if (config.screenVertical) {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
            //横版显示
            else {

            }
        }
    }

    /**
     * 默认全屏
     * config.visualMode === 0
     * @return {[type]}
     */
    return {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop
    }
    
}

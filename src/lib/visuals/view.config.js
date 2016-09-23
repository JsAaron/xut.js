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
     * 默认全屏
     * @return {[type]}
     */
    if (config.visualMode === 0) {
        return {
            width: newWidth,
            height: newHeight,
            left: newTop,
            top: newLeft
        }
    }


    if (config.visualMode === 1) {
        // return {
        //     width: screenWidth,
        //     height: screenHeight,
        //     left: 0,
        //     top: 0
        // }
    }


    /**
     * 宽度100%
     * 高度自适应
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

    return {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop
    }

    /**
     * 虚拟模式并且是竖版
     * @return {[type]}
     */
    // if (config.virtualMode && screenHeight > screenWidth) {
    //     return {
    //         width: _newWidth,
    //         height: _newHeight,
    //         left: (screenWidth - _newWidth / 2) / 2,
    //         top: (screenHeight - _newHeight) / 2
    //     }
    // }

}

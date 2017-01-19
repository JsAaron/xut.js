import { $$warn } from '../util/debug'

const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 全局可视区域布局处理
 * 4种可选模式，1/2/3/4
 */
export function getVisualLayout(config, fullProportion, setVisualMode) {

    let screenWidth = config.screenSize.width
    let screenHeight = config.screenSize.height

    let newWidth = screenWidth
    let newHeight = screenHeight
    let newTop = 0
    let newLeft = 0

    if(!setVisualMode){
        $$warn('getVisualLayout没有提供setVisualMode')
    }

    /**
     * 模式2：
     * 宽度100%，正比缩放高度
     */
    if(setVisualMode === 2) {

        //竖版PPT
        if(config.pptVertical) {
            //竖版显示
            if(config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
            }
            //横版显示
            else {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
        }

        //横版PPT
        if(config.pptHorizontal) {
            //竖版显示(宽度100%。上下自适应，显示居中小块)
            if(config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
            }
        }

        /**
         * 2016.12.13增加
         * 保证模式2高度不能溢出分辨率最大距离
         * @return {[type]}            [description]
         */
        if(newHeight > screenHeight) {
            newHeight = screenHeight
            newTop = 0
        }
    }

    /**
     * 模式3：
     * 高度100%,宽度溢出可视区隐藏
     */
    if(setVisualMode === 3) {

        //竖版PPT
        if(config.pptVertical) {
            //竖版显示，正向显示
            if(config.screenVertical) {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
            //横版显示，反向显示
            else {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
        }

        //横版PPT
        if(config.pptHorizontal) {
            //竖版显示(宽度100%。上下自适应，显示居中小块)
            if(config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
            }
        }

    }


    /**
     * 模式2.3.4
     * config.visualMode === 1
     * @return {[type]}
     */
    return {
        width: CEIL(newWidth),
        height: CEIL(newHeight),
        left: CEIL(newLeft),
        top: CEIL(newTop)
    }

}

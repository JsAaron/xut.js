const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 全局可视区域布局处理
 * @param  {[type]} () [description]
 * @return {[type]}    [description]
 */
export default function setView(config, fullProportion) {

    const screenWidth = config.screenSize.width
    const screenHeight = config.screenSize.height

    let newWidth = screenWidth
    let newHeight = screenHeight
    let newTop = 0
    let newLeft = 0

    /**
     * 画轴拼接模式
     * 高度100%，正比缩放宽度，然后设置父容器溢出不隐藏了
     * 可以看到是连续拼接的页面
     * @param  {[type]} config.visualMode [description]
     * @return {[type]}                   [description]
     */
    if (config.visualMode === 1) {

        const designWidth = fullProportion.pptWidth
        const designHeight = fullProportion.pptHeight

        //竖版PPT
        if (config.pptVertical) {
            //横版显示
            //比如模式3的处理是一致的。只是父容易溢出吧隐藏了
            if (config.screenHorizontal) {
                newWidth = fullProportion.pptWidth * fullProportion.height
                newLeft = (screenWidth - newWidth) / 2
            }
            //竖版显示
            //正常全屏显示，类似模式0
            //config.screenVertical
        }

        //横版ppt
        if (config.pptHorizontal) {
            //横版设计，在竖版手机上显示，强制分2页，虚拟一页
            //假如启用了画轴模式，看看是不是竖版的情况，需要切半模版virtualMode
            //word是两栏，竖版需要强制分开
            if (config.screenVertical) {
                //启动虚拟双页模式
                // config.doublePageMode = true
            }

            //横版显示，默认0全屏
            //config.screenHorizontal
        }


        // if (config.doublePageMode && !config.screenHorizontal) {
        //     //假设高度不会溢出,按两倍屏宽计算
        //     var _prop = 2 * screenWidth / designWidth;
        //     offsetLeft = 0;
        //     scaleHeight = designHeight * _prop;
        //     offsetTop = (screenHeight - scaleHeight) / 2;

        //     //如果高度溢出,按屏高计算
        //     if (scaleHeight > screenHeight) {
        //         _prop = screenHeight / designHeight;
        //         scaleWidth = designWidth * _prop;

        //         offsetTop = 0;
        //         offsetLeft = (2 * screenWidth - scaleWidth) / 2;
        //     }

        //     widthProp = heightProp = _prop;
        // }
    }

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

        //横版PPT
        if (config.pptHorizontal) {
            //竖版显示(宽度100%。上下自适应，显示居中小块)
            if (config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
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
        }

        //横版PPT
        if (config.pptHorizontal) {
            //竖版显示(宽度100%。上下自适应，显示居中小块)
            if (config.screenVertical) {
                newHeight = fullProportion.pptHeight * fullProportion.width
                newTop = (screenHeight - newHeight) / 2
            }
        }

    }

    /**
     * 默认全屏
     * config.visualMode === 0
     * @return {[type]}
     */
    return {
        width: CEIL(newWidth),
        height: CEIL(newHeight),
        left: CEIL(newLeft),
        top: CEIL(newTop)
    }

}

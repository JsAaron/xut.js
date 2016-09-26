/**
 * 默认ppt尺寸
 * @type {Number}
 */
const PPTWIDTH = 1024
const PPTHEIGHT = 768


/**
 * 获取默认全屏比值关系
 * 用来设置新的view尺寸
 * @param  {[type]} config    [description]
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
export function getFullProportion(config, pptWidth, pptHeight) {
    //设备分辨率
    let screenWidth = config.screenSize.width
    let screenHeight = config.screenSize.height

    let screenHorizontal = config.screenHorizontal

    //默认ppt尺寸
    let designWidth = pptWidth ? pptWidth : screenHorizontal ? PPTWIDTH : PPTHEIGHT
    let designHeight = pptHeight ? pptHeight : screenHorizontal ? PPTHEIGHT : PPTWIDTH

    //当前屏幕的尺寸与数据库设计的尺寸，比例
    let widthProp = screenWidth / designWidth
    let heightProp = screenHeight / designHeight

    return {
        width: widthProp,
        height: heightProp,
        left: widthProp,
        top: heightProp,
        pptWidth: designWidth,
        pptHeight: designHeight
    }
}


/**
 * 计算真正的缩放比
 * 依照真正的view尺寸设置
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
export function getRealProportion(config, viewSize, fullProportion) {
    let widthProp = viewSize.width / fullProportion.pptWidth
    let heightProp = viewSize.height / fullProportion.pptHeight

    //布局的偏移量，可能是采用了画轴模式，一个可视区可以容纳3个页面
    let offsetTop = 0
    let offsetLeft = 0
    let scaleWidth
    let scaleHeight

    //画轴模式，缩放比重新处理
    if (config.visualMode === 1) {

        //设备分辨率
        const screenWidth = config.screenSize.width
        const screenHeight = config.screenSize.height
        const designWidth = fullProportion.pptWidth
        const designHeight = fullProportion.pptHeight

        /**
         * 画轴模式
         * 正比缩放,可以看到左右拼接
         */
        if (config.scrollPaintingMode) {
            //    Dw       screenWidth - 2 * left
            //   ----  =  -------------------
            //    Dh       screenHeight - 2 * top
            if (config.screenHorizontal) {
                scaleWidth = designWidth * heightProp;
                offsetLeft = (screenWidth - scaleWidth) / 2;
                widthProp = heightProp
            } else {
                scaleHeight = designHeight * heightProp;
                offsetTop = (screenHeight - scaleHeight) / 2;
                heightProp = widthProp
            }
        }

        /**
         * 横版设计，在竖版手机上显示，强制分2页，虚拟一页
         * word是两栏，竖版需要强制分开
         */
        if (config.virtualMode && !config.screenHorizontal) {
            //假设高度不会溢出,按两倍屏宽计算
            var _prop = 2 * screenWidth / designWidth;
            offsetLeft = 0;
            scaleHeight = designHeight * _prop;
            offsetTop = (screenHeight - scaleHeight) / 2;

            //如果高度溢出,按屏高计算
            if (scaleHeight > screenHeight) {
                _prop = screenHeight / designHeight;
                scaleWidth = designWidth * _prop;

                offsetTop = 0;
                offsetLeft = (2 * screenWidth - scaleWidth) / 2;
            }

            widthProp = heightProp = _prop;
        }
    }

    return {
        width: widthProp,
        height: heightProp,
        left: widthProp,
        top: heightProp,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft
    }
}

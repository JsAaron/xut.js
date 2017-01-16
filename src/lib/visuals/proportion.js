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
 * 获取浮动页面缩放比
 * 这个比较特殊
 * 在模式3下面
 * 母版是依赖的页面，如果页面是flow那么母版中的元素的缩放比需要调整
 * config, viewSize, fullProportion
 */
export function getFlowProportion(...arg) {
    return getRealProportion(...arg)
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

    return {
        width: widthProp,
        height: heightProp,
        left: widthProp,
        top: heightProp,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft
    }
}

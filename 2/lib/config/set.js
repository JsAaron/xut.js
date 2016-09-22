const isBrowser = Xut.plat.isBrowser
const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 屏幕尺寸
 * @return {[type]} [description]
 */
export function getSize() {
    //如果是IBooks模式处理
    if (Xut.IBooks.Enabled) {
        const screen = Xut.IBooks.CONFIG.screenSize;
        if (screen) {
            return {
                "width": screen.width,
                "height": screen.height
            }
        }
    }
    return {
        "width": $(window).width(),
        "height": $(window).height()
    }
}


/**
 * 排版判断
 * @return {[type]} [description]
 */
export function getLayerMode(screenSize) {
    return screenSize.width > screenSize.height ? "horizontal" : "vertical"
}


/**
 * 初始缩放比例
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
const getProportion = function(config, pptWidth, pptHeight) {

    let scaleWidth, scaleHeight

    //设备分辨率
    let screenWidth = config.screenSize.width
    let screenHeight = config.screenSize.height

    // 根据设备判断设备的横竖屏 1 横板 0 竖版
    let screenHorizontal = screenWidth > screenHeight ? 1 : 0

    //数据ppt排版设计
    //是否为ppt制作横版
    let pptHorizontal = pptWidth > pptHeight ? 1 : 0

    //默认ppt尺寸
    let designWidth = pptWidth ? pptWidth : screenHorizontal ? 1024 : 768
    let designHeight = pptHeight ? pptHeight : screenHorizontal ? 768 : 1024

    //布局的偏移量，可能是采用了画轴模式，一个可视区可以容纳3个页面
    let offsetTop = 0
    let offsetLeft = 0

    //当前屏幕的尺寸与数据库设计的尺寸，比例
    //默认config.visualMode === 0
    let widthProp = screenWidth / designWidth
    let heightProp = screenHeight / designHeight

    /**
     * config.visualMode处理
     */
    if (pptWidth && pptHeight && config.visualMode) {

        //宽高正比缩放
        if (config.visualMode === 1) {
            //如果ppt设计的排版与当前的播放不符
            if (pptHorizontal != screenHorizontal) {
                if (pptHorizontal === 1) {
                    heightProp = widthProp
                } else {
                    widthProp = heightProp
                }
            }
        }

        //宽度100% ，自适应缩放高度
        if (config.visualMode === 2) {
            //ppt与屏幕设计显示一致
            if (pptHorizontal === screenHorizontal) {
                if (pptHorizontal) {
                    //横板PPT横板显示(宽度100%，高度溢出，只显示中间布局，整体拉高)
                    heightProp = widthProp
                } else {
                    //竖版ppt竖版显示(宽度100%。上下空白，显示居中，整体缩短)
                    heightProp = widthProp
                }
            }
            //ppt制作方向与显示方向相反
            else {
                if (pptHorizontal) {
                    //横板PPT竖版显示(宽度100%。上下空白，显示居中，整体缩短)
                    heightProp = widthProp
                } else {
                    //竖版ppt在横版显示(高度100%，缩放宽度，左右留边)
                    widthProp = heightProp
                }
            }
        }

        //高度100% ，自适应宽度缩放
        if (config.visualMode === 3) {
            //ppt与屏幕设计显示一致
            if (pptHorizontal === screenHorizontal) {
                if (pptHorizontal) {
                    //横板PPT横板显示(高度100%，显示居中，左右空白，整体缩短)
                    widthProp = heightProp
                } else {
                    //竖版ppt竖版显示(高度100%。宽度溢出，只显示中间部分，整体拉长)
                    widthProp = heightProp
                }
            }
            //ppt制作方向与显示方向相反
            else {
                if (pptHorizontal) {
                    //横板PPT竖版显示(高度100%。宽度溢出，只显示中间部分，整体拉长)
                    widthProp = heightProp
                } else {
                    //竖版ppt在横版显示(高度100%，显示居中，左右空白，整体缩短)
                    widthProp = heightProp
                }
            }
        }
    }


    /**
     * 画轴模式
     * 正比缩放,可以看到左右拼接
     */
    if (config.scrollPaintingMode) {
        //    Dw       screenWidth - 2 * left
        //   ----  =  -------------------
        //    Dh       screenHeight - 2 * top
        if (screenHorizontal) {
            scaleWidth = designWidth * heightProp;
            offsetLeft = (screenWidth - scaleWidth) / 2;
            widthProp = heightProp;
        } else {
            scaleHeight = designHeight * heightProp;
            offsetTop = (screenHeight - scaleHeight) / 2;
            heightProp = widthProp;
        }
    }

    /**
     * 横版设计，在竖版手机上显示，强制分2页，虚拟一页
     * word是两栏，竖版需要强制分开
     */
    if (config.virtualMode && !screenHorizontal) {
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


    return {
        width: widthProp,
        height: heightProp,
        left: widthProp,
        top: heightProp,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft,
        pptWidth: pptWidth,
        pptHeight: pptHeight
    }
}


/**
 * 修复缩放比
 * 如果PPT有编辑指定的宽度与高度
 */
export function fixProportion(config, pptWidth, pptHeight) {

    /**
     * 计算新的缩放比
     * @type {[type]}
     */
    const proportion = getProportion(config, pptWidth, pptHeight)

    /**
     * 计算容器的宽高比
     * @param  {[type]} () [description]
     * @return {[type]}    [description]
     */
    proportion.calculateContainer = (() => {
        const pptWidth = proportion.pptWidth
        const pptHeight = proportion.pptHeight
        const scaleWidth = proportion.width
        const scaleHeight = proportion.height
        return (width, height, left, top) => {
            const screenSize = config.screenSize

            width = width || screenSize.width
            height = height || screenSize.height
            left = left || 0
            top = top || 0

            //如果数据库有ppt尺寸设置
            //按照ppt尺寸处理设置缩放比
            if (pptWidth && pptHeight) {
                //维持竖版的缩放比
                var _width = scaleWidth * pptWidth;
                var _height = scaleHeight * pptHeight;

                //虚拟模式并且是竖版
                if (config.virtualMode && height > width) {
                    return {
                        width: FLOOR(_width),
                        height: FLOOR(_height),
                        left: FLOOR((width - _width / 2) / 2),
                        top: FLOOR((height - _height) / 2)
                    }
                }
                //横版模式
                return {
                    width: FLOOR(_width),
                    height: FLOOR(_height),
                    left: FLOOR((width - _width) / 2),
                    top: FLOOR((height - _height) / 2)
                }
            } else {
                return {
                    width: FLOOR(width),
                    height: FLOOR(height),
                    left: FLOOR(left),
                    top: FLOOR(top)
                }
            }
        }
    })()

    /**
     * 计算元素的缩放比
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    proportion.calculateElement = (data) => {
        var data = _.extend({}, data)
        data.width = CEIL(data.width * proportion.width);
        data.height = CEIL(data.height * proportion.height);
        data.top = FLOOR(data.top * proportion.top);
        data.left = FLOOR(data.left * proportion.left);
        return data;
    }

    return proportion
}

const isBrowser = Xut.plat.isBrowser
const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 屏幕尺寸
 * @return {[type]} [description]
 */
export function _screen() {
    //如果是IBooks模式处理
    if (Xut.IBooks.Enabled) {
        var screen = Xut.IBooks.CONFIG.screenSize;
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
export function _layer(screenSize) {
    return screenSize.width > screenSize.height ? "horizontal" : "vertical"
}


/**
 * 缩放比例
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
export function _scale(config, pptWidth, pptHeight) {
    var dbmode, scaleWidth, scaleHeight,
        width = config.screenSize.width,
        height = config.screenSize.height,
        // 根据设备判断设备的横竖屏 1 横板 0 竖版
        horizontalMode = width > height ? 1 : 0,

        //默认ppt尺寸
        defaultWidth = pptWidth ? pptWidth : horizontalMode ? 1024 : 768,
        defaultHeight = pptHeight ? pptHeight : horizontalMode ? 720 : 976,

        //当前屏幕的尺寸与数据库设计的尺寸，比例
        wProp = width / defaultWidth,
        hProp = height / defaultHeight,

        //布局的偏移量，可能是采用了画轴模式，一个可视区可以容纳3个页面
        offsetTop = 0,
        offsetLeft = 0;

    if (pptWidth && pptHeight && isBrowser) {
        dbmode = pptWidth > pptHeight ? 1 : 0; // 根据数据库判断横杂志的竖屏 1 横板 0 竖版
        if (dbmode != horizontalMode) {
            if (dbmode === 1) {
                hProp = wProp;
            } else {
                wProp = hProp;
            }
        }
    }

    //画轴模式
    if (config.scrollPaintingMode) {
        //    Dw       width - 2 * left 
        //   ----  =  -------------------
        //    Dh       height - 2 * top

        if (horizontalMode) {
            scaleWidth = defaultWidth * hProp;
            offsetLeft = (width - scaleWidth) / 2;
            wProp = hProp;
        } else {
            scaleHeight = defaultHeight * hProp;
            offsetTop = (height - scaleHeight) / 2;
            hProp = wProp;
        }
    }

    //word模式下的竖版
    if (config.virtualMode && !horizontalMode) {
        //假设高度不会溢出,按两倍屏宽计算
        var _prop = 2 * width / defaultWidth;
        offsetLeft = 0;
        scaleHeight = defaultHeight * _prop;
        offsetTop = (height - scaleHeight) / 2;

        //如果高度溢出,按屏高计算
        if (scaleHeight > height) {
            _prop = height / defaultHeight;
            scaleWidth = defaultWidth * _prop;

            offsetTop = 0;
            offsetLeft = (2 * width - scaleWidth) / 2;
        }

        wProp = hProp = _prop;
    }

    return {
        width: wProp,
        height: hProp,
        left: wProp,
        top: hProp,
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
export function _fixProportion(config, pptWidth, pptHeight) {

    /**
     * 计算新的缩放比
     * @type {[type]}
     */
    let proportion = config.proportion = _scale(config, pptWidth, pptHeight);

    /**
     * 计算容器的宽高比
     * @param  {[type]} () [description]
     * @return {[type]}    [description]
     */
    proportion.calculateContainer = (() => {
        var pptWidth = proportion.pptWidth
        var pptHeight = proportion.pptHeight
        var scaleWidth = proportion.width
        var scaleHeight = proportion.height
        return (width, height, left, top) => {
            var screenSize = config.screenSize
            width = width || screenSize.width
            height = height || screenSize.height
            left = left || 0
            top = top || 0

            if (pptWidth && pptHeight && isBrowser) {
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
                };
            } else {
                return {
                    width: FLOOR(width),
                    height: FLOOR(height),
                    left: FLOOR(left),
                    top: FLOOR(top)
                }
            }
        }
    })();

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

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
        "width": document.documentElement.clientWidth || $(window).width(),
        "height": document.documentElement.clientHeight || $(window).height()
    }
}



/**
 * 排版判断
 * @return {[type]} [description]
 */
export function getLayerMode(screenSize) {
    return screenSize.width > screenSize.height ? "horizontal" : "vertical"
}

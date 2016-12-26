/**
 * 屏幕尺寸
 * @return {[type]} [description]
 */
export function getSize() {
    //如果是IBooks模式处理
    if (Xut.IBooks.Enabled) {
        let screen = Xut.IBooks.CONFIG.screenSize;
        if (screen) {
            return {
                "width": screen.width,
                "height": screen.height
            }
        }
    }

    let clientWidth = document.documentElement.clientWidth || $(window).width()
    let clientHeight = document.documentElement.clientHeight || $(window).height()

    //启动模式
    if (Xut.launchConfig && Xut.launchConfig.appViewTop) {
        clientHeight = clientHeight -  Xut.launchConfig.appViewTop
    }

    return {
        "width": clientWidth,
        "height": clientHeight
    }
}


/**
 * 排版判断
 * @return {[type]} [description]
 */
export function getLayerMode(screenSize) {
    return screenSize.width > screenSize.height ? "horizontal" : "vertical"
}

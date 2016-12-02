/**
 * 关闭按钮
 * @param  {[type]} right [description]
 * @param  {[type]} top   [description]
 * @return {[type]}       [description]
 */
const createCloseIcon = function(right, top) {
    let html
    const screenSize = Xut.config.screenSize
    const width = screenSize.width
    const height = screenSize.height
    if (width > height) {
        //横屏
        html =
            `<div class="si-icon ionicons ion-ios-close"
                  style="font-size:6vw;position: absolute;right:${right}px;top:${top}px;width:6vw;height:6vw;">
                <div class="ionicons ion-ios-close-outline"
                     style="position:absolute;top:0;">
                </div>
            </div>`
    } else {
        //竖屏
        html =
            `<div class="si-icon ionicons ion-ios-close"
                  style="font-size:6vh;position: absolute;right:${right}px;top:${top}px;width:6vh;height:6vh;">
                <div class="ionicons ion-ios-close-outline"
                     style="position:absolute;top:0;">
                </div>
            </div>`
    }
    return $(String.styleFormat(html))
}



/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export default function pinchButton(callback, right = 0, top = 0) {
    const $closeNode = createCloseIcon(right + 4, top + 8)
    $closeNode.on("touchend mouseup", function() {
        callback();
    });
    return $closeNode
}

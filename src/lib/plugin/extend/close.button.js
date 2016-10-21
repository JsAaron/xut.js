/**
 * 关闭按钮
 * @param  {[type]} right [description]
 * @param  {[type]} top   [description]
 * @return {[type]}       [description]
 */
const createCloseIcon = function(right, top) {
    const html =
        `<div class="page-pinch-close" style="right:${right}px;top:${top}px;">
           <div class="si-icon icomoon icon-close" style="font-size:6vh;background:white;border-radius:6vh;width:6vh;height:6vh;position:absolute;right:0;"></div>
        </div>`
    return $(String.styleFormat(html))
}



/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export default function pinchButton(callback, right = 0, top = 0) {
    const $closeNode = createCloseIcon(right, top)
    $closeNode.on("touchend mouseup", function() {
        callback();
    });
    return $closeNode
}

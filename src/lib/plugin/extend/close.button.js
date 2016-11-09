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
    if(width > height) {
          html=
        `<div class="page-pinch-close" style="position: absolute;right:${right}px;top:${top}px;">
           <div class="si-icon icomoon icon-close" style="font-size:5vw;background-color:white;width:5vw;height:5vw;border-radius:50%;right:0"></div>
        </div>`
    }else {
          html=
        `<div class="page-pinch-close" style="position: absolute;right:${right}px;top:${top}px;">
           <div class="si-icon icomoon icon-close" style="font-size:5vh;background-color:white;width:5vh;height:5vh;border-radius:50%;right:0"></div>
        </div>`
    }
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

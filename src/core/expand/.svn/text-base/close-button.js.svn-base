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
    html =
      `<div class="page-scale-close" style="position: absolute;right:${right}px;top:${top}px;">
           <div class="si-icon Flaticon xut-flaticon-error" style="font-size:5.3vw;border-radius:50%;right:0">
           </div>
        </div>`
  } else {
    html =
      `<div class="page-scale-close" style="position: absolute;right:${right}px;top:${top}px;">
             <div class="si-icon Flaticon xut-flaticon-error" style="font-size:5.3vh;border-radius:50%;right:0;"></div>
        </div>`
  }
  return $(String.styleFormat(html))
}



/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export function closeButton(callback, right = 0, top = 0) {
  const $closeNode = createCloseIcon(right + 4, top + 8)
  $closeNode.on("touchend mouseup", function() {
    callback();
  });
  return $closeNode
}

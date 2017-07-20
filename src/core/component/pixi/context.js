/*******************************************
/*******************************************
 *   canvas处理模块
 *   2016.2新增机制
 *   扩充pixi动画
 *                                      *
 ******************************************/

/**
 * 创建pixi上下文
 * @param  {[type]} canvasContainer [description]
 * @param  {[type]} wrapObj         [description]
 * @return {[type]}                 [description]
 */
export function Context(data, dom, pageIndex) {

  var renderer = PIXI.autoDetectRenderer(data.scaleWidth, data.scaleHeight, {
    transparent: true,
    view: dom
  });

  var mark = ''
  if(data.category) {
    var cats = data.category.split(",")
    var len = cats.length
    if(len) {
      while(len--) {
        mark += cats[len]
      }
    }
  }
  mark = mark.toLowerCase()

  var prefix = "canvas_" + pageIndex + "_" + data._id;

  //位置
  renderer.view.style.position = "absolute"
  renderer.view.style.zIndex = data.zIndex
  renderer.view.style.left = data.scaleLeft + "px"
  renderer.view.style.top = data.scaleTop + "px"

  renderer.view.setAttribute('data-ctype', mark)
  renderer.view.setAttribute('id', prefix)


  dom.renderer = renderer

  return renderer

}
/*******************************************
/*******************************************
 *   canvas处理模块
 *   2016.2新增机制
 *   扩充pixi动画
 *                                      *
 ******************************************/

/**
 * 制作uuid
 * @return {[type]} [description]
 */
function makeGuid() {
    return Xut.guid('rAF');
}


/**
 * 创建pipx容器
 * @param  {[type]} canvasContainer [description]
 * @param  {[type]} wrapObj         [description]
 * @return {[type]}                 [description]
 */
export function Container(data, rootelement) {

    var renderer = PIXI.autoDetectRenderer(data.scaleWidth, data.scaleHeight, {
        transparent: true
    });

    var mark = ''
    if (data.category) {
        var cats = data.category.split(",")
        var len = cats.length
        if (len) {
            while (len--) {
                mark += cats[len]
            }
        } 
    }
    mark = mark.toLowerCase()

    //位置
    renderer.view.style.position = "absolute"
    renderer.view.style.zIndex   = data.zIndex
    renderer.view.style.left     = data.scaleLeft + "px"
    renderer.view.style.top      = data.scaleTop + "px"

    renderer.view.setAttribute('id',  mark + '-' + data._id)

    //放入容器
    rootelement.append(renderer.view)

    return renderer

}

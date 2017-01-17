import { config, dynamicView, dynamicProportion } from '../config/index'

/**
 * 设置默认的样式
 * @return {[type]} [description]
 */

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    return 'translate(' + offset + 'px,0px)' + translateZ
}

/**
 * 混入钩子处理
 * @param  {[type]} original [description]
 * @param  {[type]} hook     [description]
 * @return {[type]}          [description]
 */
const mixHooks = function(original, hook) {
    if(hook) {
        let newValue = hook(original)
        if(newValue !== undefined) {
            return newValue
        }
    }
    return original
}

/**
 * 检测页面是否宽度溢出
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getStyle = function(pageIndex) {
    let pageObj = Xut.Presentation.GetPageObj(pageIndex)
    return pageObj && pageObj.getStyle
}


/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export default {

    /**
     * 默认视图
     * @return {[type]} [description]
     */
    view(dynamicVisualMode, direction) {

        //默认的config.visualMode
        let viewSize
        let overflowLeft = 0
        let needResetProportion = false

        //如果需要重新设置当前页面模式
        //visualMode结构需要变动，必须重置
        if(dynamicVisualMode && dynamicVisualMode != config.visualMode || dynamicVisualMode === 3) {
            viewSize = dynamicView(dynamicVisualMode)
            if(dynamicVisualMode === 3) { //宽度模式，有偏离量
                overflowLeft = viewSize.left
            }
            needResetProportion = true
        } else {
            viewSize = config.viewSize
        }

        return {
            viewWidth: viewSize.width,
            viewHeight: viewSize.height,
            viewTop: viewSize.top,
            viewLeft: 0,
            overflowLeft, //实际偏移量
            needResetProportion //扩展
        }
    }

    /**
     * 修复动态的缩放比
     * @return {[type]} [description]
     */
    , proportion(data) {
        if(data.needResetProportion) {
            return dynamicProportion({
                width: data.viewWidth,
                height: data.viewHeight,
                top: data.viewTop,
                left: data.viewLeft
            })
        }
    }

    /**
     * 默认样式
     * @param  {Object} options.hooks [description]
     * @param  {[type]} createIndex   [description]
     * @param  {Object} currIndex                     } [description]
     * @return {[type]}               [description]
     */
    , translate({
        hooks = {},
        createIndex,
        currIndex,
        direction,
        viewWidth,
        overflowLeft,
        dynamicVisualMode
    }) {

        let translate
        let offset
        let offsetLeft
        let offsetMiddle
        let offsetRight

        viewWidth = viewWidth || config.viewSize.width

        switch(direction) {
            case 'before':
                if(dynamicVisualMode === 3) {
                    offsetLeft = -viewWidth + overflowLeft
                } else {
                    offsetLeft = -viewWidth
                }
                offsetLeft = mixHooks(offsetLeft, hooks.left)
                translate = createTranslate(offsetLeft)
                offset = offsetLeft
                break;
            case 'middle':
                if(dynamicVisualMode === 3) {
                    offsetMiddle = overflowLeft
                } else {
                    offsetMiddle = 0
                }
                offsetMiddle = mixHooks(offsetMiddle, hooks.middle)
                translate = createTranslate(offsetMiddle)
                offset = offsetMiddle
                break;
            case 'after':
                if(dynamicVisualMode === 3) {
                    offsetRight = viewWidth + overflowLeft
                } else {
                    offsetRight = viewWidth
                }
                offsetRight = mixHooks(offsetRight, hooks.right)
                translate = createTranslate(offsetRight)
                offset = offsetRight
                break;
        }

        return {
            translate,
            offset
        }
    }

    /**
     * 滑动距离
     * @return {[type]} [description]
     */
    , distance() {
        return {
            flipMove: {
                /**
                 * 左滑动
                 */
                left(offset) {
                    let middleStyle = getStyle(offset.middleIndex);

                    //中间溢出页面,左边溢出页面
                    if(middleStyle.overflowLeft) {
                        offset.middle = offset.middle + middleStyle.overflowLeft;
                        //左边也是溢出页面
                        let leftStyle = getStyle(offset.leftIndex)
                        if(leftStyle.overflowLeft) {
                            offset.left = offset.left + (middleStyle.overflowLeft * 3)
                        }
                    } else {
                        //中间正常页面，左边溢出页面
                        let leftStyle = getStyle(offset.leftIndex)
                        if(leftStyle.overflowLeft) {
                            offset.left = offset.left + (leftStyle.overflowLeft * 2)
                        }
                    }
                },
                /**
                 * 右滑动
                 */
                right(offset) {
                    //右边滑动，如果当前页面宽度是溢出的
                    //那么滑动需要加上溢出宽度
                    let middleStyle = getStyle(offset.middleIndex)
                    if(middleStyle.overflowLeft) {
                        offset.middle = offset.middle + middleStyle.overflowLeft;
                        offset.right = offset.right + middleStyle.overflowLeft;
                    }
                }
            },
            /**
             * 反弹是反向设置，这个需要注意
             */
            flipRebound: {
                /**
                 * 左边滑动，往右边反弹
                 */
                left(offset) {
                    let middleStyle = getStyle(offset.middleIndex)
                    if(middleStyle.overflowLeft) {
                        let overLeft = middleStyle.overflowLeft
                        offset.middle = overLeft;
                        //判断左边页面
                        let leftStyle = getStyle(offset.leftIndex)
                        if(leftStyle.overflowLeft) {
                            offset.left = -leftStyle.viewWidth + overLeft
                        } else {
                            offset.left = -(leftStyle.viewWidth - overLeft)
                        }
                        //右边页面
                        let rightStyle = getStyle(offset.rightIndex)
                        if(rightStyle.overflowLeft) {
                            offset.right = middleStyle.viewWidth + middleStyle.overflowLeft
                        }
                    } else {
                        //中间正常页面，左边溢出页面
                        let leftStyle = getStyle(offset.leftIndex)
                        if(leftStyle.overflowLeft) {
                            offset.left = offset.left + (leftStyle.overflowLeft * 2)
                        }
                    }
                },
                /**
                 * 往右边滑动，往左边反弹
                 */
                right(offset) {
                    let middleStyle = getStyle(offset.middleIndex)
                    if(middleStyle.overflowLeft) {
                        offset.middle = middleStyle.overflowLeft
                        offset.left = -(middleStyle.viewWidth - middleStyle.overflowLeft)
                        offset.right = middleStyle.viewWidth + middleStyle.overflowLeft
                    }
                }
            },
            flipOver: {
                /**
                 * 前翻页(左翻页)
                 */
                left(offset) {
                    let leftStyle = getStyle(offset.leftIndex)
                    if(leftStyle.overflowLeft) {
                        offset.left = leftStyle.overflowLeft
                        let middleStyle = getStyle(offset.middleIndex)
                        if(middleStyle.overflowLeft) {
                            offset.middle = middleStyle.viewWidth + middleStyle.overflowLeft
                        }
                    }
                },
                /**
                 * 后翻页(右翻页)
                 */
                right(offset) {
                    let rightStyle = getStyle(offset.rightIndex)

                    //如果右边是溢出页面
                    if(rightStyle.overflowLeft) {
                        offset.right = rightStyle.overflowLeft
                        let middleStyle = getStyle(offset.middleIndex)
                        if(middleStyle.overflowLeft) {
                            offset.middle = -middleStyle.viewWidth + middleStyle.overflowLeft
                        }
                    }
                    //如果当前是溢出页面
                    //但是右边是正常页面
                    //设置当前页面溢出自己的宽度
                    else {
                        let middleStyle = getStyle(offset.middleIndex)
                        if(middleStyle.overflowLeft) {
                            offset.middle = (-middleStyle.viewWidth)
                        }
                    }
                }
            }

        }
    }

}

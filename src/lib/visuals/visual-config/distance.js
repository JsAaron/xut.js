

/**
 * 滑动距离
 * @return {[type]} [description]
 */
export function visualDistance() {
    return {
        flipMove: {
            /**
             * 左滑动
             */
            left(offset) {
                let middleStyle = getStyle(offset.middleIndex);

                //中间溢出页面,左边溢出页面
                if (middleStyle.overflowLeft) {
                    offset.middle = offset.middle + middleStyle.overflowLeft;
                    //左边也是溢出页面
                    let leftStyle = getStyle(offset.leftIndex)
                    if (leftStyle.overflowLeft) {
                        offset.left = offset.left + (middleStyle.overflowLeft * 3)
                    }
                } else {
                    //中间正常页面，左边溢出页面
                    let leftStyle = getStyle(offset.leftIndex)
                    if (leftStyle.overflowLeft) {
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
                if (middleStyle.overflowLeft) {
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
                if (middleStyle.overflowLeft) {
                    let overLeft = middleStyle.overflowLeft
                    offset.middle = overLeft;
                    //判断左边页面
                    let leftStyle = getStyle(offset.leftIndex)
                    if (leftStyle.overflowLeft) {
                        offset.left = -leftStyle.viewWidth + overLeft
                    } else {
                        offset.left = -(leftStyle.viewWidth - overLeft)
                    }
                    //右边页面
                    let rightStyle = getStyle(offset.rightIndex)
                    if (rightStyle.overflowLeft) {
                        offset.right = middleStyle.viewWidth + middleStyle.overflowLeft
                    }
                } else {
                    //中间正常页面，左边溢出页面
                    let leftStyle = getStyle(offset.leftIndex)
                    if (leftStyle.overflowLeft) {
                        offset.left = offset.left + (leftStyle.overflowLeft * 2)
                    }
                }
            },
            /**
             * 往右边滑动，往左边反弹
             */
            right(offset) {
                let middleStyle = getStyle(offset.middleIndex)
                if (middleStyle.overflowLeft) {
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
                if (leftStyle.overflowLeft) {
                    offset.left = leftStyle.overflowLeft
                    let middleStyle = getStyle(offset.middleIndex)
                    if (middleStyle.overflowLeft) {
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
                if (rightStyle.overflowLeft) {
                    offset.right = rightStyle.overflowLeft
                    let middleStyle = getStyle(offset.middleIndex)
                    if (middleStyle.overflowLeft) {
                        offset.middle = -middleStyle.viewWidth + middleStyle.overflowLeft
                    }
                }
                //如果当前是溢出页面
                //但是右边是正常页面
                //设置当前页面溢出自己的宽度
                else {
                    let middleStyle = getStyle(offset.middleIndex)
                    if (middleStyle.overflowLeft) {
                        offset.middle = (-middleStyle.viewWidth)
                    }
                }
            }
        }

    }
}

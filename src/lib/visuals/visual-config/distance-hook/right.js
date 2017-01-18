/************************
 * right页面钩子
 * distance -1 -2 -3 -N 递减
 *************************/
export const rightPageHook = {
    flipMove: {
        prev() {},
        /**
         * 右滑动
         * distance -1 -> -N 递减
         */
        next(distance, pageStyles) {

            let middlePageStyle = pageStyles.middle
            let rightPageStyle = pageStyles.right

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return distance + rightPageStyle.viewWidth
                }
                //右边：正常
                else {
                    return distance + middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
            }
            //中间：正常
            else {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return distance + middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger
                }
                //右边：正常
                else {
                    return distance + rightPageStyle.viewWidth
                }
            }
        }
    },
    flipRebound: {
        prev() {},
        next(distance, pageStyles) {

            let middlePageStyle = pageStyles.middle
            let rightPageStyle = pageStyles.right

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return rightPageStyle.viewWidth
                }
                //右边：正常
                else {
                    return middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
            }
            //中间：正常
            else {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger
                }
                //右边：正常
                else {
                    return middlePageStyle.viewWidth
                }
            }
        }
    },
    flipOver: {
        prev() {},
        next() {
            return 0
        }
    }
}

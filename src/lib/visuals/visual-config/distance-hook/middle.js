/************************
 * 中间页面钩子
 *************************/
export const middlePageHook = {
    flipMove: {
        prev() {},
        next() {}
    },
    flipOver: {
        /**
         * 左翻页结束
         */
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return middlePageStyle.viewWidth
                }
                //左边：正常
                else {
                    return middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
            }
            //中间：正常
            else {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return middlePageStyle.viewWidth + leftPageStyle.viewLeftInteger
                }
                //左边：正常
                else {
                    return middlePageStyle.viewWidth
                }
            }
        },
        /**
         * 右翻页结束
         */
        next(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let rightPageStyle = pageStyles.right

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return -middlePageStyle.viewWidth
                }
                //右边：正常
                else {
                    return -(middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger)
                }
            }
            //中间：正常
            else {
                //右边：溢出
                if (rightPageStyle && rightPageStyle.viewLeftInteger) {
                    return -(middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger)
                }
                //右边：正常
                else {
                    return -rightPageStyle.viewWidth
                }
            }
        }
    }
}

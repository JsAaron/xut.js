/************************
 * 中间页面钩子
 *************************/
export const middlePageHook = {
    flipMove: {
        prev(distance, pageStyles) {},
        next(distance, pageStyles) {}
    },
    flipOver: {
        /**
         * 左翻页结束
         */
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //左边：溢出
            if(leftPageStyle && leftPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return middlePageStyle.viewWidth
                }
                //中间：正常
                else {
                    return middlePageStyle.viewWidth + leftPageStyle.viewLeftInteger
                }
            }
            //左边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
                //中间：正常
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

            //左边：溢出
            if(rightPageStyle && rightPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return -middlePageStyle.viewWidth
                }
                //中间：正常
                else {
                    return -(middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger)
                }
            }
            //左边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return -(middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger)
                }
                //中间：正常
                else {
                    return -rightPageStyle.viewWidth
                }
            }
        }
    }
}

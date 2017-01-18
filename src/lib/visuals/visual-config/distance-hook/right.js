/************************
 * right页面钩子
 *************************/
export const rightPageHook = {
    flipMove: {
        /**
         * 左滑动
         */
        prev(pageStyle) {},
        /**
         * right => 右滑动
         * 判断自己与中间页面的情况
         * distance -1 -> -N 递减
         */
        next(distance, pageStyles) {

            let middlePageStyle = pageStyles.middle
            let rightPageStyle = pageStyles.right

            //右边：溢出
            if(rightPageStyle && rightPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return distance + rightPageStyle.viewWidth
                }
                //中间：正常
                else {
                    return distance + middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger
                }
            }
            //右边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return distance + middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
                //中间：正常
                else {
                    return distance + rightPageStyle.viewWidth
                }
            }
        }
    },
    flipRebound: {
        prev(distance, pageStyles) {
            //左翻页反弹
            //右页面不动
        },
        next(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let rightPageStyle = pageStyles.right

            //右边：溢出
            if(rightPageStyle && rightPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return rightPageStyle.viewWidth
                }
                //中间：正常
                else {
                    return middlePageStyle.viewWidth + rightPageStyle.viewLeftInteger
                }
            }
            //右边：正常
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
        }
    },
    flipOver: {
        prev(distance, pageStyles) {
            //上翻页，最右边的页面是直接销毁的
            //跳过计算
        },
        next(distance, pageStyles) {
            return 0
        }
    }
}

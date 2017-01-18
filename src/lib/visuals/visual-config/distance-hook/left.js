/************************
 * 左边页面钩子
 *     distance 正数，1-2-3-4 -> N 变化
 *     pageStyles：3个页面的style配置
 *************************/
export const leftPageHook = {
    flipMove: {
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return -leftPageStyle.viewWidth + distance
                }
                //左边：正常
                else {
                    return distance - leftPageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
            }
            //中间：正常
            else {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return distance - leftPageStyle.viewWidth + leftPageStyle.viewLeftInteger
                }
                //左边：正常
                else {
                    return distance - leftPageStyle.viewWidth
                }
            }
        },
        next() {}
    },
    flipRebound: {
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //中间：溢出
            if (middlePageStyle && middlePageStyle.viewLeftInteger) {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return -leftPageStyle.viewWidth
                }
                //左边：正常
                else {
                    return -(leftPageStyle.viewWidth + middlePageStyle.viewLeftInteger)
                }
            }
            //中间：正常
            else {
                //左边：溢出
                if (leftPageStyle && leftPageStyle.viewLeftInteger) {
                    return -(leftPageStyle.viewWidth - leftPageStyle.viewLeftInteger)
                }
                //左边：正常
                else {
                    return -leftPageStyle.viewWidth
                }
            }

        },
        next() {}
    },
    flipOver: {
        prev() {
            return 0
        },
        next() {}
    }
}

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

            //左边：溢出
            if(leftPageStyle && leftPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return -leftPageStyle.viewWidth + distance
                }
                //中间：正常
                else {
                    return distance - leftPageStyle.viewWidth + leftPageStyle.viewLeftInteger
                }
            }
            //左边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return distance - leftPageStyle.viewWidth - middlePageStyle.viewLeftInteger
                }
                //中间：正常
                else {
                    return distance - leftPageStyle.viewWidth
                }
            }
        },
        next(distance, pageStyles) {}
    },
    flipRebound: {
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //左边：溢出
            if(leftPageStyle && leftPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return -leftPageStyle.viewWidth
                }
                //中间：正常
                else {
                    return -(leftPageStyle.viewWidth - leftPageStyle.viewLeftInteger)
                }
            }
            //左边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return -leftPageStyle.viewWidth
                }
                //中间：正常
                else {
                    return -leftPageStyle.viewWidth
                }
            }
        },
        next() {
            //右翻页反弹
            //左边页面不动
        }
    },
    flipOver: {
        prev(distance, pageStyles) {
            let middlePageStyle = pageStyles.middle
            let leftPageStyle = pageStyles.left

            //左边：溢出
            if(leftPageStyle && leftPageStyle.viewLeftInteger) {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return 0
                }
                //中间：正常
                else {
                    return 0
                }
            }
            //左边：正常
            else {
                //中间：溢出
                if(middlePageStyle && middlePageStyle.viewLeftInteger) {
                    return 0
                }
                //中间：正常
                else {
                    return 0
                        // return distance + middlePageStyle.viewWidth + middlePageStyle.viewLeftInteger
                }
            }

        },
        next(distance, pageStyles) {

        }
    }
}

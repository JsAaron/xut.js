import { config } from '../../config/index'


export default {

    view() {

        let viewWidth = config.screenSize.width
        let viewHeight = config.screenSize.height
        let viewTop = 0
        let viewLeft = 0

        //宽度100%的情况下
        //如果是flow页面处理,全屏
        if (config.visualMode === 2) {
            if (config.pptVertical) {
                //其他页面上下压缩，左右100%
                //flows页面宽高都是100%
                if (config.screenVertical) {
                    viewWidth = config.screenSize.width
                    viewHeight = config.screenSize.height
                    viewTop = 0
                } else {
                    viewWidth = config.viewSize.width
                    viewHeight = config.viewSize.height
                    viewTop = 0
                }
            }
            return {
                viewWidth,
                viewHeight,
                viewTop
            }
        }

        //高度100%的情况下
        //flow下,设置容易宽度
        if (config.visualMode === 3) {
            if (config.pptVertical) {
                //竖版竖版
                //高度100%,宽度会存在溢出
                //所以需要修复flow页面是全屏状态
                if (config.screenVertical) {
                    viewWidth = config.screenSize.width
                } else {

                }
            }
        }

        return {
            viewWidth,
            viewHeight,
            viewTop,
            viewLeft
        }
    }


    /**
     * 容器样式钩子处理
     * @param  {[type]} data       [description]
     * @param  {[type]} usefulData [description]
     * @return {[type]}            [description]
     */
    , translate(data, usefulData) {
        return {
            left(offsetLeft) {
                if (config.visualMode === 3) {
                    const middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {
                        return -(middle.viewWidth + middle.offset)
                    }
                }
            },
            middle(originalOffset) {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                        return -config.viewSize.left
                    }
                }
            },
            right(originalOffset) {
                if (config.visualMode === 3) {
                    //获取上一页的styles状态
                    //如果上一页是通过flow方式处理过的
                    //当前页面小姐要不去重新处理
                    const middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {
                        return middle.viewWidth + middle.offset
                    }
                }
            }
        }
    }


    /**
     * 滑动值
     * @return {[type]} [description]
     */
    , distance() {
        return {
            flipMove: {
                next(data) {

                }
            },
            flipOver: {
                prev(data) {
                    // if (config.visualMode === 3) {
                    //     const currFlows = data.$$checkFlows(currIndex)
                    //     const nextFlows = data.$$checkFlows(leftIndex)
                    //         //当前flow，下一页正常
                    //     if (currFlows && !nextFlows) {}
                    //     //当前正常页面，下一页flow
                    //     if (!currFlows && nextFlows) {
                    //         data.left = -data.$$veiwLeft
                    //     }
                    // }
                },
                next(data) {
                    // if (config.visualMode === 3) {
                    //     const currFlows = data.$$checkFlows(currIndex)
                    //     const nextFlows = data.$$checkFlows(rightIndex)
                    //         //当前flow，下一页正常
                    //     if (currFlows && !nextFlows) {
                    //         console.log(2)
                    //     }
                    //     //当前正常页面，下一页flow
                    //     if (!currFlows && nextFlows) {
                    //         data.left = -2 * data.$$veiwWidth
                    //         data.middle = -getFlowView().viewWidth
                    //         data.right = -data.$$veiwLeft
                    //         console.log(data.middle)
                    //     }
                    // }
                }
            }
        }
    }
}

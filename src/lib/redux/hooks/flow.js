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
            //竖版PPT
            if (config.pptVertical) {
                //竖版竖版
                //存在溢出或者未填满全屏(ipad)的情况
                if (config.screenVertical) {
                    //溢出强制全屏
                    //iphone情况
                    if (config.viewSize.overflowWidth) {
                        viewWidth = config.screenSize.width
                    }
                    //如果没有填满采用可视区大小
                    //ipad的情况
                    if (config.viewSize.notFillWidth) {
                        viewWidth = config.viewSize.width
                    }
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
     * 容器translate的规则
     * @param  {[type]} data       [description]
     * @param  {[type]} usefulData [description]
     * @return {[type]}            [description]
     */
    , translate(data, usefulData) {
        //如果是溢出了宽度
        //模式3 在iphone移动手机端的情况
        if (config.viewSize.overflowWidth) {
            return {
                /**
                 * 初始化左边页面的translate坐标
                 * 初始化处理需要考虑前后相邻的页面之间的依赖
                 * 1.如果中间页面是flow
                 * 2.处理left页面是flow的情况
                 * 3.处理本身(middle)是正常页面，后面(middle)是flow的的情况
                 */
                left() {
                    let middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {
                        if (usefulData.hasFlow('before')) {
                            return -config.screenSize.width + config.viewSize.overflowLeftPositive
                        }
                        return -(middle.viewWidth + middle.offset)
                    }
                },
                /**
                 * 初始化中间页面的translate坐标
                 */
                middle() {
                    if (data.isFlows) {
                        return -config.viewSize.left
                    }
                },
                /**
                 * 初始化右边页面的translate坐标
                 * 初始化处理需要考虑前后相邻的页面之间的依赖
                 * 1.如果中间页面是flow
                 * 2.处理right页面是flow的情况
                 * 3.处理本身(middle)是正常页面，前面(middle)是flow的的情况
                 */
                right() {
                    let middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {
                        if (usefulData.hasFlow('after')) {
                            return config.screenSize.width + config.viewSize.overflowLeftPositive
                        }
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
        if (config.viewSize.overflowWidth) {
            return {
                flipMove: {
                    /**
                     * 左滑动
                     */
                    left(offset) {
                        if (offset.hasFlow(offset.leftIndex)) {
                            offset.left = offset.left + config.viewSize.overflowWidth
                        }
                    },
                    /**
                     * 右滑动
                     */
                    right(offset) {
                        if (offset.hasFlow(offset.middleIndex)) {
                            offset.right = offset.right - config.viewSize.overflowWidth
                        }
                    }
                },
                /**
                 * 反弹是反向设置，这个需要注意
                 * @type {Object}
                 */
                flipRebound: {
                    /**
                     * 左边滑动，往右边反弹
                     * 1 判断当前页面是不是flow
                     * 2 修正左边页面flow的情况
                     * 3 修正右边正常页面的情况
                     */
                    left(offset) {
                        if (offset.hasFlow(offset.middleIndex)) {
                            let overLeft = config.viewSize.overflowLeftPositive
                            offset.middle = overLeft
                            if (offset.hasFlow(offset.leftIndex)) {
                                offset.left = -config.screenSize.width + overLeft
                            } else {
                                offset.left = -(config.viewSize.width - overLeft)
                            }
                        }
                    },
                    /**
                     * 右边滑动，往左边反弹
                     * 1 判断当前页面是不是flow
                     * 2 修正右边页面flow与正常页面的情况
                     * 3 修正右边页面是正常页面的情况
                     */
                    right(offset) {
                        if (offset.hasFlow(offset.middleIndex)) {
                            let overLeft = config.viewSize.overflowLeftPositive
                            offset.middle = overLeft;
                            //因为中间页面是flow，所有右边页面是不是flow与正常页面都无所谓，都是一样的处理
                            offset.right = config.screenSize.width + overLeft
                        }
                    }
                },
                flipOver: {
                    /**
                     * 前翻页，这里涉及了页面的转换
                     * left=>middle
                     * middle=>right
                     * 1.如果当前flow页面
                     * 2.left=>middle，只需要给出溢出值
                     * 3.middle=>right，因为中间是flow，所以right是screenSize+overLeft
                     */
                    left(offset) {
                        if (offset.hasFlow(offset.leftIndex)) {
                            let overLeft = config.viewSize.overflowLeftPositive
                            offset.left = overLeft
                            if (offset.hasFlow(offset.middleIndex)) {
                                offset.middle = config.screenSize.width + overLeft
                            }
                        }
                    },
                    /**
                     * 后翻页，这里涉及了页面的转换
                     * right =》middle
                     * middle =》right
                     * 1.如果当前是flow
                     * 2.right =》middle，所以当前页面的最终只是溢出的left
                     * 3.middle =》right，所以右边页面的溢出值，
                     */
                    right(offset) {
                        if (offset.hasFlow(offset.rightIndex)) {
                            let overLeft = config.viewSize.overflowLeftPositive
                            offset.right = overLeft
                            if (offset.hasFlow(offset.middleIndex)) {
                                offset.middle = -config.screenSize.width + overLeft
                            }
                        }

                    }
                }
            }
        }
    }
}

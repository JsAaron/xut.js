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
                 */
                left() {
                    //如果中间页面有flow
                    let middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {

                        //如果本身页面是flow类型
                        //本身与后面一页面连续flow出现
                        if (usefulData.hasFlow('before')) {
                            return -config.screenSize.width + config.viewSize.overflowLeftPositive
                        }

                        //本身不是flow
                        //后面一页是flow
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
                 */
                right() {
                    //获取上一页的styles状态
                    //如果上一页是通过flow方式处理过的
                    //当前页面小姐要不去重新处理
                    let middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {

                        //如果本身页面是flow类型
                        //前面与本身连续flow出现
                        if (usefulData.hasFlow('after')) {
                            return config.screenSize.width + config.viewSize.overflowLeftPositive
                        }

                        //本身不是flow
                        //前面一页是flow
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
                    left(offset) {
                        //往右边滑动反弹，所以left为左边处理
                        //而且只修正当期那是flow
                        if (offset.hasFlow(offset.middleIndex)) {
                            //中间页面是flow
                            let overLeft = config.viewSize.overflowLeftPositive
                            offset.middle = overLeft

                            if (offset.hasFlow(offset.leftIndex)) {
                                //如果左边页面是flow，那么反弹的时候要处理
                                offset.left = -config.screenSize.width + overLeft
                            }
                        }
                    },
                    right(offset) {
                        //中间flow
                        if (offset.hasFlow(offset.middleIndex)) {
                            offset.middle = config.viewSize.overflowLeftPositive

                            //右边flow
                            if (offset.hasFlow(offset.rightIndex)) {
                                //如果左边页面是flow，那么反弹的时候要处理
                                offset.right = config.screenSize.width - config.viewSize.left
                            }
                        }
                    }
                },
                flipOver: {
                    /**
                     * 前翻页
                     */
                    left(offset) {
                        if (offset.hasFlow(offset.leftIndex)) {
                            offset.left = config.viewSize.overflowLeftPositive

                            if (offset.hasFlow(offset.middleIndex)) {
                                offset.middle = config.screenSize.width + config.viewSize.overflowLeftPositive
                            }
                        }
                    },
                    /**
                     * 后翻页
                     */
                    right(offset) {
                        //当前正常页面，下一页flow
                        if (offset.hasFlow(offset.rightIndex)) {
                            offset.right = config.viewSize.overflowLeftPositive
                            if (offset.hasFlow(offset.middleIndex)) {
                                offset.middle = -config.screenSize.width + config.viewSize.overflowLeftPositive
                            }
                        }

                    }
                }
            }
        }
    }
}

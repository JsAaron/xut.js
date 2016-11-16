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
                left(offsetLeft) {
                    const middle = usefulData.getStyle('middle')
                    if (middle && middle.isFlows) {
                        return -(middle.viewWidth + middle.offset)
                    }
                },
                /**
                 * 初始化中间页面的translate坐标
                 */
                middle(originalOffset) {
                    if (data.isFlows) {
                        return -config.viewSize.left
                    }
                },
                /**
                 * 初始化右边页面的translate坐标
                 */
                right(originalOffset) {
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
        if (config.viewSize.overflowWidth) {
            return {
                flipMove: {
                    left(data) {
                        const leftFlow = data.$$checkFlows(data.$$leftIndex)
                        if (leftFlow) {
                            data.left = data.$$left + Math.abs(config.viewSize.left) * 2
                        }
                    },
                    right(data) {
                        const middleFlow = data.$$checkFlows(data.$$middleIndex)
                        if (middleFlow) {
                            data.right = data.$$right - Math.abs(config.viewSize.left) * 2
                        }
                    }
                },
                /**
                 * 反弹是反向设置，这个需要注意
                 * @type {Object}
                 */
                flipRebound: {
                    left(data) {
                        //往右边滑动反弹，所以left为左边处理
                        //而且只修正当期那是flow
                        let middleFlow = data.$$checkFlows(data.$$middleIndex)
                        if (middleFlow) {
                            //中间页面是flow
                            let overLeft = Math.abs(config.viewSize.left)
                            data.middle = overLeft

                            let leftFlow = data.$$checkFlows(data.$$leftIndex)
                            if (leftFlow) {
                                //如果左边页面是flow，那么反弹的时候要处理
                                data.left = -config.screenSize.width + overLeft
                            }
                        }
                    },
                    right(data) {
                        const middleFlow = data.$$checkFlows(data.$$middleIndex)
                        if (middleFlow) {
                            data.middle = Math.abs(config.viewSize.left)

                            let rightFlow = data.$$checkFlows(data.$$rightIndex)
                            if (rightFlow) {
                                //如果左边页面是flow，那么反弹的时候要处理
                                data.right = config.screenSize.width - config.viewSize.left
                            }
                        }
                    }
                },
                flipOver: {
                    /**
                     * 前翻页
                     */
                    left(data) {
                        const leftFlow = data.$$checkFlows(data.$$leftIndex)
                        if (leftFlow) {
                            data.left = -config.viewSize.left
                            const middleFlow = data.$$checkFlows(data.$$middleIndex)
                            if (middleFlow) {
                                data.middle = config.screenSize.width + Math.abs(config.viewSize.left)
                            }
                        }
                    },
                    /**
                     * 后翻页
                     */
                    right(data) {
                        const rightFlow = data.$$checkFlows(data.$$rightIndex)
                            //当前正常页面，下一页flow
                        if (rightFlow) {
                            data.right = Math.abs(config.viewSize.left)
                            const middleFlow = data.$$checkFlows(data.$$middleIndex)
                            if (middleFlow) {
                                data.middle = -config.screenSize.width + Math.abs(config.viewSize.left)
                            }
                        }

                    }
                }
            }
        }
    }
}

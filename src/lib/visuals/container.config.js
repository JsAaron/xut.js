import defaultView from './overwrite/default.view.config'
import defaultStyle from './overwrite/defalut.style.config'
import { getFlowView } from './overwrite/type.page.config'

import { config } from '../config/index'



/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export default function styleConfig({
    action,
    usefulData
} = {}) {

    _.each(usefulData, function(data, index) {

        /**
         * 默认尺寸
         */
        _.extend(data, defaultView(config))

        /**
         * 提供可自定义配置接口
         * @param  {[type]} data.isFlows [description]
         * @return {[type]}              [description]
         */
        if (data.isFlows) {
            _.extend(data, getFlowView())
        }

        /**
         * 容器钩子
         * @type {Object}
         */
        const hooks = {
            left(offsetLeft) {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                        offsetLeft = offsetLeft - config.viewSize.left
                        return offsetLeft
                    }
                }
            },
            middle(offsetMiddle) {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                        offsetMiddle = -config.viewSize.left
                        return offsetMiddle
                    }
                }
            },
            right() {
                if (config.visualMode === 3) {
                    if (data.isFlows) {}
                }
            }
        }

        //设置容器的样式
        defaultStyle({
            data,
            // hooks,
            createIndex: data.pid,
            currIndex: data.visiblePid
        })
    })
    console.log(usefulData)
    return usefulData
}

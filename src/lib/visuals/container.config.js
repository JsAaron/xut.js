import containerConfig from './overwrite/container.type.config'
import Stack from '../util/stack'

import {
    getFlowView,
    setFlowTranslate
} from './overwrite.config'

/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export default function styleConfig({
    action,
    hasFlow,
    usefulData
} = {}) {

    /**
     * 获取指定页面样式
     * @return {[type]} [description]
     */
    usefulData.getStyle = function(pageName) {
        return this[this['_' + pageName]]
    }

    const compile = new Stack()

    _.each(usefulData, function(data, index) {

        //跳过getStyle
        if (_.isFunction(data)) {
            return
        }

        //确保中间页第一个解析
        compile[data.direction == 'middle' ? 'shift' : 'push'](function() {

            /**
             * 默认尺寸
             */
            _.extend(data, containerConfig.view())

            /**
             * 提供可自定义配置接口
             * @param  {[type]} data.isFlows [description]
             * @return {[type]}              [description]
             */
            if (data.isFlows) {
                _.extend(data, getFlowView())
            }

            /**
             * 设置容器的样式
             * @type {[type]}
             */
            const hooks = hasFlow ? setFlowTranslate(data, usefulData) : {}
            const translate = containerConfig.translate({
                hooks,
                createIndex: data.pid,
                currIndex: data.visiblePid,
                direction: data.direction
            })
            usefulData['_' + data.direction] = data.pid
            _.extend(data, translate)
        })

    })

    compile.shiftAll().destroy()

    return usefulData
}

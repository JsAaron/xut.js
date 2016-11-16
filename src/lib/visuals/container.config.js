import defaultContainer from './hooks/container.hook'
import Stack from '../util/stack'

import {
    getFlowView,
    setFlowTranslate
} from './hooks/adapter'

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
}) {

    /**
     * 获取指定页面样式
     * @return {[type]} [description]
     */
    usefulData.getStyle = function(pageName) {
        return this[this['_' + pageName]]
    }

    const compile = new Stack()

    _.each(usefulData, function(data, index) {

        //跳过getStyle方法
        if (_.isFunction(data)) {
            return
        }

        //只处理页面的样式对象
        //确保中间页第一个解析
        compile[data.direction == 'middle' ? 'shift' : 'push'](function() {

            //容器默认默认尺寸
            _.extend(data, defaultContainer.view())

            //提供可自定义配置接口
            if (data.isFlows) {
                _.extend(data, getFlowView())
            }

            //设置容器样式
            const translate = defaultContainer.translate({
                //提供容器的样式钩子
                hooks: hasFlow ? setFlowTranslate(data, usefulData) : {},
                createIndex: data.pid,
                currIndex: data.visiblePid,
                direction: data.direction
            })

            //提供快速索引
            usefulData['_' + data.direction] = data.pid
            _.extend(data, translate)
        })

    })

    compile.shiftAll().destroy()


    return usefulData
}

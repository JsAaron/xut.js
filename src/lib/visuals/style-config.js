import Stack from '../util/stack'
import { visualView } from './visual-config/view'
import { visualProportion } from './visual-config/proportion'
import { visualInitTranslate } from './visual-config/translate'

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
}) {

    /**
     * 获取指定页面样式
     * @return {[type]} [description]
     */
    usefulData.getStyle = function(pageName) {
        return this[this['_' + pageName]]
    }

    let compile = new Stack()
    _.each(usefulData, function(data, index) {

        //跳过getStyle方法
        if (_.isFunction(data)) {
            return
        }

        //只处理页面的样式对象
        //确保中间页第一个解析
        compile[data.direction == 'middle' ? 'shift' : 'push'](function() {

            //容器可视区尺寸
            _.extend(data, visualView(data.dynamicVisualMode, data.direction))

            //容器内部元素的缩放比
            data.dynamicProportion = visualProportion(data)

            //设置容器样式
            let translate = visualInitTranslate({
                createIndex: data.pid,
                currIndex: data.visiblePid,
                direction: data.direction,
                viewWidth: data.viewWidth
            })

            //提供快速索引
            usefulData['_' + data.direction] = data.pid
            _.extend(data, translate)
        })

    })

    compile.shiftAll().destroy()

    return usefulData
}

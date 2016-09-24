import { getFlowStyle } from './type.page.config'
import { createPageTransform } from '../pagebase/move/translation'


/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export default function styleConfig({
    usefulData,
    hasFlows,
    initAction,
    filpOverAction
} = {}) {
    _.each(usefulData, function(data, index) {

        //混入指定元素的样式
        //提供可自定义配置接口
        if (data.isFlows) {
            _.extend(data, getFlowStyle())
        }

        //设置容器li的transforms
        data.transforms = createPageTransform({
            createIndex: data.pid,
            currIndex: data.visiblePid,
            hasFlows,
            initAction,
            filpOverAction
        })
    })
    return usefulData
}

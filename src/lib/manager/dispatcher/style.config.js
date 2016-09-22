import { config } from '../../config/index'
import { createPageTransform } from '../../swipe/translation'

/**
 * 自定义样式
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

        //关于flow页面下，容器节点的设置
        if (data.isFlows) {

            //宽度100%的情况下
            //如果是flow页面处理,全屏
            if (config.visualMode === 2) {
                data.containerHeight = config.screenSize.height
                data.containerTop = 0
            }

            //高度100%的情况下
            //flow下,设置容易宽度
            if (config.visualMode === 3) {
                data.containerWidth = config.screenSize.width
            }
        }

        //设置transforms
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

import { getFlowStyle } from './type/type.page.config'
import { config } from '../config/index'

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    offset = config.virtualMode ? offset / 2 : offset
    return 'translate(' + offset + 'px,0px)' + translateZ
}


/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
const getContainer = function({
    data,
    createIndex,
    currIndex,
    initAction,
    filpOverAction
} = {}) {

    let translate
    let direction
    let offset

    const viewWidth = config.viewSize.width

    //左边
    if (createIndex < currIndex) {
        const offsetLeft = -viewWidth
        translate = createTranslate(offsetLeft)
        offset = offsetLeft
        direction = 'before'
    }
    //右边 
    else if (createIndex > currIndex) {
        const offsetRight = viewWidth
        translate = createTranslate(offsetRight)
        offset = offsetRight
        direction = 'after'
    }
    //可视区域
    else if (currIndex == createIndex) {

        let offsetCut = 0
        if (data.isFlows && config.visualMode === 3) {
            offsetCut = -config.viewSize.left
        }
        translate = createTranslate(offsetCut)
        offset = offsetCut
        direction = 'original'
    }


    _.extend(data, {
        translate,
        direction,
        offset
    })
}



/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export default function styleConfig({
    usefulData,
    initAction,
    filpOverAction
} = {}) {
    _.each(usefulData, function(data, index) {

        //混入指定元素的样式
        //提供可自定义配置接口
        if (data.isFlows) {
            _.extend(data, getFlowStyle())
        }

        //设置容器的样式
        getContainer({
            data,
            createIndex: data.pid,
            currIndex: data.visiblePid,
            initAction,
            filpOverAction
        })
    })

    return usefulData
}

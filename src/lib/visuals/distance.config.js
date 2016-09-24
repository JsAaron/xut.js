import { config } from '../config/index'
import { hasValue } from '../util/lang'
import { getFlowStyle } from './type.page.config'

/**
 * 下一页是否为flow页面
 * 要根据这个判断来处理翻页的距离
 * @return {[type]} [description]
 */
const checkNextFlow = function(pageIndex) {
    const pageObj = Xut.Presentation.GetPageObj(pageIndex)
    return pageObj && pageObj._isFlows
}


/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export default function getFlipDistance({
    action,
    distance,
    direction,
    leftIndex,
    currIndex,
    rightIndex,
} = {}) {

    let leftOffset
    let middleOffset
    let rightOffset

    //当前视图页面
    //用来处理页面回调
    let realViewOffset

    //滑动区域宽度
    const veiwWidth = config.viewSize.width

    /**
     * 滑动
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipMove') {
        leftOffset = distance - veiwWidth
        middleOffset = distance
        rightOffset = distance + veiwWidth
    }

    /**
     * 反弹
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipRebound') {
        leftOffset = -veiwWidth
        middleOffset = distance;
        rightOffset = veiwWidth
    }

    /**
     * 翻页
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipOver') {
        /**
         * 前翻
         */
        if (direction === 'prev') {
            leftOffset = 0
            middleOffset = veiwWidth
            rightOffset = 2 * veiwWidth
            realViewOffset = leftOffset
        }
        /**
         * 后翻
         */
        if (direction === 'next') {
            leftOffset = -2 * veiwWidth
            middleOffset = -veiwWidth
            rightOffset = distance
            realViewOffset = rightOffset
        }

    }

    return [leftOffset, middleOffset, rightOffset, realViewOffset]
}

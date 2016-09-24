import { config } from '../config/index'
import {
    hasValue,
    hash
} from '../util/lang'


/**
 * 下一页是否为flow页面
 * 要根据这个判断来处理翻页的距离
 * @return {[type]} [description]
 */
const checkFlows = function(pageIndex) {
    const pageObj = Xut.Presentation.GetPageObj(pageIndex)
    return pageObj && pageObj._isFlows
}

/**
 * 制作钩子收集器
 * @return {[type]} [description]
 */
const makeGather = function() {
    let _gather = hash()
    _gather.$$veiwWidth = config.viewSize.width
    _gather.$$veiwLeft = config.viewSize.left
    _gather.$$checkFlows = checkFlows
    return _gather
}

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export default function getFlipDistance({
    action,
    distance,
    direction,
    hooks
} = {}) {

    //区域尺寸
    const veiwWidth = config.viewSize.width
    const veiwLeft = config.viewSize.left

    const offset = {
        left: undefined,
        middle: undefined,
        right: undefined,
        //当前视图页面
        //用来处理页面回调
        view: undefined
    }


    /**
     * 滑动
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipMove') {
        offset.left = distance - veiwWidth
        offset.middle = distance
        offset.right = distance + veiwWidth
    }

    /**
     * 反弹
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipRebound') {
        offset.left = -veiwWidth
        offset.middle = distance;
        offset.right = veiwWidth
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
            offset.left = 0
            offset.middle = veiwWidth
            offset.right = 2 * veiwWidth
            if (hooks.prevFlipOver) {
                let gather = makeGather()
                hooks.prevFlipOver(gather)
                _.each(gather, function(value, key) {
                    offset[key] = value
                })
            }
            offset.view = offset.left
        }

        /**
         * 后翻
         */
        if (direction === 'next') {

            offset.left = -2 * veiwWidth
            offset.middle = -veiwWidth
            offset.right = distance
            if (hooks.nextFlipOver) {
                let gather = makeGather()
                hooks.nextFlipOver(gather)
                _.each(gather, function(value, key) {
                    offset[key] = value
                })
            }
            offset.view = offset.right
        }

    }

    return [offset.left, offset.middle, offset.right, offset.view]
}

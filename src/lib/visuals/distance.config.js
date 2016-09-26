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
    direction
} = {}, hooks) {

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
     * 混入钩子
     * @return {[type]} [description]
     */
    const mixHooks = function(hook) {
        if (hook) {
            let _receiver = makeGather()
            hook(_receiver)
            _.each(_receiver, function(value, key) {
                offset[key] = value
            })
        }
    }

    /**
     * 滑动
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipMove') {
        const flipMove = hooks && hooks.flipMove
        offset.left = distance - veiwWidth
        offset.middle = distance
        offset.right = distance + veiwWidth
        if (flipMove) {
            if (direction === 'prev') {
                mixHooks(flipMove.prev)
            }
            if (direction === 'next') {
                mixHooks(flipMove.next)
            }
        }
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

        const flipOver = hooks && hooks.flipOver

        /**
         * 前翻
         */
        if (direction === 'prev') {
            offset.left = 0
            offset.middle = veiwWidth
            offset.right = 2 * veiwWidth
            mixHooks(flipOver && flipOver.prev)
            offset.view = offset.left
        }

        /**
         * 后翻
         */
        if (direction === 'next') {
            offset.left = -2 * veiwWidth
            offset.middle = -veiwWidth
            offset.right = distance
            mixHooks(flipOver && flipOver.next)
            offset.view = offset.right
        }

    }

    return [offset.left, offset.middle, offset.right, offset.view]
}

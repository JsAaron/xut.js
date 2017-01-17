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
    return pageObj && pageObj.isFlows
}


/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export function getDistance({
    action,
    distance,
    direction,
    leftIndex,
    pageIndex,
    rightIndex
}, hooks) {

    //默认的区域尺寸
    let veiwWidth = config.viewSize.width

    let offset = {
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
    let mixHooks = function(hookFunction) {
        if (hookFunction) {
            offset.leftIndex = leftIndex
            offset.middleIndex = pageIndex
            offset.rightIndex = rightIndex
            hookFunction(offset)
        }
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
        let flipMove = hooks && hooks.flipMove
        if (flipMove) {
            if (direction === 'prev') {
                mixHooks(flipMove.left)
            }
            if (direction === 'next') {
                mixHooks(flipMove.right)
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
        let flipRebound = hooks && hooks.flipRebound
        if (flipRebound) {
            if (direction === 'prev') {
                mixHooks(flipRebound.left)
            }
            if (direction === 'next') {
                mixHooks(flipRebound.right)
            }
        }
    }

    /**
     * 翻页
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    if (action === 'flipOver') {
        let flipOver = hooks && hooks.flipOver

        //前翻
        if (direction === 'prev') {
            offset.left = 0
            offset.middle = veiwWidth
            offset.right = 2 * veiwWidth
            flipOver && mixHooks(flipOver.left)
            offset.view = offset.left
        }
        //后翻
        if (direction === 'next') {
            offset.left = -2 * veiwWidth
            offset.middle = -veiwWidth
            offset.right = distance
            flipOver && mixHooks(flipOver.right)
            offset.view = offset.right
        }
    }

    return [offset.left, offset.middle, offset.right, offset.view]
}

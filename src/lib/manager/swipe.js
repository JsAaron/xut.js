import { config } from '../config/index'
import { translation } from '../pagebase/move/translation'

import {
    bindEvent,
    offEvent,
    handle
} from '../util/event'

/**
 * 滑动
 */
export default class Swipe {

    /**
     * 滑动节点
     * @param  {[type]} swipeNode [description]
     * @return {[type]}           [description]
     */
    constructor(swipeNode) {
        this.translationX = 0
        this.swipeNode = swipeNode
        swipeNode.style.width = config.viewSize.width * 3 + 'px'

        bindEvent(this.swipeNode, {
            transitionend: this
        })
    }

    handleEvent(e) {
        handle({
            transitionend(e) {
                translation.set(this.swipeNode, -1024)
            }
        }, this, e)
    }


    /**
     * 初始化设置滑动容器的
     * 用来进入后定位不同的页面
     */
    initTranslation(createPageIndex, visiblePageIndex) {

        createPageIndex = createPageIndex.sort()
        const visiblePox = createPageIndex.indexOf(visiblePageIndex) + 1

        //translationX坐标
        //只有2种情况
        let translationX = 0
        if (createPageIndex.length === 2 && visiblePox == 1) {
            //首页
            translationX = 0
        } else {
            //其余页面
            translationX = (-config.viewSize.width)
        }

        this.translationX = translationX

        translation.set(this.swipeNode, translationX)
    }

    /**
     * 移动节点
     * @return {[type]} [description]
     */
    move(action, speed, currIndex, moveDist) {
        let distance = moveDist[1]

        distance = distance + this.translationX * currIndex

        if (action === 'flipOver') {
            this.swipeNode.setAttribute('data-view', true)
            this.translationX = distance
        }
        translation[action](this.swipeNode, distance, speed, moveDist)
    }

}

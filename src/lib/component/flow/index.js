import { config } from '../../config/index'
import { translation } from '../../swipe/translation'
import Swipe from '../../swipe/index'
import render from './render'

import {
    calculateDistance
} from '../../manager/dispatch/depend'

/**
 * 2017.9.7
 * 流式排版
 */
export default class Flow {

    constructor(base, callback) {

        const self = this

        this.callback = callback
        this.initIndex = base.pageIndex

        const rootNode = base.element
        const chapterId = base.chapterId
        const domId = 'chapter-' + chapterId
        const dataNode = $("#" + domId)

        render({
            rootNode,
            dataNode,
            chapterId,
            callback($container, $content) {
                self._init($container, $content)
                callback()
            }
        })
    }


    /**
     * 初始化
     * @param  {[type]} $container [description]
     * @param  {[type]} $content   [description]
     * @return {[type]}            [description]
     */
    _init($container, $content) {

        //分段数
        const pagesCount = this._resolveHeight($content)

        const MIN = 0
        const MAX = pagesCount - 1
        const viewWidth = config.viewSize.width
        const gapWidth = 20
        const View = Xut.View

        const swipe = this.swipe = new Swipe({
            borderBounce: true,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > this.initIndex ? MAX : MIN,
            extraGap: gapWidth,
            container: $content[0],
            pageFlip: 0,
            multiplePages: 1,
            stopPropagation: true,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = swipe._initDistance


        /**
         * 触屏松手点击
         * 无滑动
         */
        swipe.$watch('onTap', (pageIndex, hookCallback) => {
            if (!Xut.Contents.Canvas.getIsTap()) {
                View.Toolbar()
            }
        });


        swipe.$watch('onMove', function({
            action,
            speed,
            distance,
            leftIndex,
            pageIndex,
            rightIndex,
            direction
        } = {}) {

            let currentDist = calculateDistance(action, distance, direction)[1]
            moveDistance = currentDist

            switch (direction) {
                case 'next':
                    moveDistance = moveDistance - gapWidth + lastDistance
                    break
                case 'prev':
                    moveDistance = moveDistance + gapWidth + lastDistance
                    break
            }

            //反弹
            if (action === 'flipRebound') {
                moveDistance = direction === 'next' ?
                    (-viewWidth * this._hindex - this._hindex * gapWidth) :
                    -(viewWidth * this._hindex + this._hindex * gapWidth)
            }

            //首尾连接主页
            if (this._hindex === MIN && this.direction === 'prev') {
                if (action === 'flipOver') {
                    View.GotoPrevSlide()
                    this._unlock()
                } else {
                    View.MovePage(moveDistance, speed, this.direction, action)
                }
            } else if (this._hindex === MAX && this.direction === 'next') {
                if (action === 'flipOver') {
                    View.GotoNextSlide()
                    this._unlock()
                } else {
                    View.MovePage(currentDist, speed, this.direction, action)
                }
            } else {
                translation[action]({}, moveDistance, speed, $content)
            }

        })


        swipe.$watch('onComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
            lastDistance = moveDistance
            unfliplock()
        })

    }


    /**
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {
        this.swipe && this.swipe.destroy()
    }


    /**
     * parse height
     * @return {[type]} [description]
     */
    _resolveHeight($content) {
        const theChildren = $content.children().children()
        let paraHeight = 0
        for (let i = 0; i < theChildren.length; i++) {
            paraHeight += $(theChildren[i]).height()
        }
        return Math.floor(paraHeight / config.viewSize.height)
    }
}

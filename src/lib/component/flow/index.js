import { config } from '../../config/index'
import { translation } from '../../swipe/translation'
import { getCounts } from './layout'
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
        const seasonId = base.chapterDas.seasonId
        const chapterId = base.chapterId
        const dataNode = $('#chapter-flow-' + chapterId)

        render({
            rootNode,
            dataNode,
            chapterId,
            callback($container, $content) {
                self._init($container, $content, getCounts(seasonId, chapterId))
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
    _init($container, $content, pagesCount) {

        const MIN = 0
        const MAX = pagesCount - 1
        const viewWidth = config.viewSize.width
        const gapWidth = 20
        const View = Xut.View
        const initIndex = this.initIndex

        const swipe = this.swipe = new Swipe({
            borderBounce: true,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > initIndex ? MAX : MIN,
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


            //更新页码标示
            'flipOver' === action && setTimeout(() => {
                let extra = direction === 'next' ? 1 : (-1)
                let index = initIndex + pageIndex + extra
                Xut.View.pageUpdate(index)
                // Xut.View.setPointer(index)
            })

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


}

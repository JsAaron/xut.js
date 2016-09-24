import { config } from '../../config/index'
import { translation } from '../../pagebase/move/translation'
import { getFlowCount } from './get'
import Swipe from '../../swipe/index'
import render from './render'

import getFlipDistance from '../../visuals/distance.config'
import { getFlowStyle } from '../../visuals/type/type.page.config'

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
            callback($container) {
                self._init($container, getFlowCount(seasonId, chapterId))
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
    _init($container, pagesCount) {

        const flowstyle = getFlowStyle()

        const MIN = 0
        const MAX = pagesCount - 1
        const flipWidth = flowstyle.newViewWidth
        const flipLeft = flowstyle.newViewLeft
        const viewLeft = config.viewSize.left
        const View = Xut.View
        const initIndex = this.initIndex

        /**
         * 分栏整体控制
         * @type {[type]}
         */
        const swipe = this.swipe = new Swipe({
            borderBounce: true,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > initIndex ? MAX : MIN,
            container: $container[0],
            flipMode: 0,
            multiplePages: 1,
            stopPropagation: true,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = swipe._initDistance


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

            /**
             * 首页边界
             * @param  {[type]} this._hindex [description]
             * @return {[type]}              [description]
             */
            if (this._hindex === MIN && this.direction === 'prev') {
                if (action === 'flipOver') {
                    View.GotoPrevSlide()
                    this.simulationComplete()
                } else {
                    if (config.visualMode === 3) {
                        distance -= viewLeft
                    }
                    //前边界前移反弹
                    View.MovePage(distance, speed, this.direction, action)
                }
            }
            /**
             * 尾页边界
             * @param  {[type]} this._hindex [description]
             * @return {[type]}              [description]
             */
            else if (this._hindex === MAX && this.direction === 'next') {
                if (action === 'flipOver') {
                    View.GotoNextSlide()
                    this.simulationComplete()
                } else {
                    //后边界前移反弹
                    View.MovePage(distance, speed, this.direction, action)
                }
            }
            /**
             * 中间页面
             */
            else {

                /**
                 * 翻页钩子
                 * @type {Object}
                 */
                const hooks = {
                    prevFlipOver(data) {
                        if (config.visualMode === 3) {
                            data.middle = flowstyle.newViewWidth
                        }
                    },
                    nextFlipOver(data) {
                        if (config.visualMode === 3) {
                            data.middle = -flowstyle.newViewWidth
                        }
                    }
                }

                const viewBeHideDistance = getFlipDistance({
                    action,
                    distance,
                    direction,
                    leftIndex,
                    pageIndex,
                    rightIndex,
                    hooks
                })[1]

                moveDistance = viewBeHideDistance

                switch (direction) {
                    case 'next':
                        moveDistance = moveDistance + lastDistance
                        break
                    case 'prev':
                        moveDistance = moveDistance + lastDistance
                        break
                }

                //反弹
                if (action === 'flipRebound') {
                    moveDistance = direction === 'next' ?
                        (-flipWidth * this._hindex - this._hindex) :
                        -(flipWidth * this._hindex + this._hindex)
                }

                translation[action]($container, moveDistance, speed)
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


}

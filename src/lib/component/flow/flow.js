import { config } from '../../config/index'
import { translation } from '../../pagebase/move/translation'
import { getFlowCount } from './get'
import Swipe from '../../swipe/index'
import render from './render'

import getFlipDistance from '../../visuals/distance.config'
import { getFlowView } from '../../visuals/expand/api.config'

import Slide from '../../plugin/internal/slide'

/**
 * 2017.9.7
 * 流式排版
 */
export default class Flow {

    constructor({
        pageIndex,
        $pinchNode,
        seasonId,
        chapterId,
        successCallback
    } = {}) {

        const self = this
        const dataNode = $('#chapter-flow-' + chapterId)
        this.initIndex = pageIndex
        this.$pinchNode = $pinchNode
        render({
            $pinchNode,
            dataNode,
            chapterId,
            callback($container) {
                self._init($container, seasonId, chapterId)
                successCallback()
            }
        })
    }

    /**
     * 缩放图片
     * @return {[type]} [description]
     */
    _zoomImage(src) {

        src = Xut.config.pathAddress + src

        let html = `<div class="page-pinch-image"
                        style="width:100%;
                               height:100%;
                               position:absolute;
                               top:0;
                               left:0;
                               background-image:url(${src});
                               background-size:100% 100%">
                   </div>`

        let $html = $(String.styleFormat(html))

        new Slide({
            $html
        })

        this.$pinchNode.after($html)
    }

    /**
     * 初始化
     * @param  {[type]} $container [description]
     * @param  {[type]} $content   [description]
     * @return {[type]}            [description]
     */
    _init($container, seasonId, chapterId) {

        const pagesCount = getFlowCount(seasonId, chapterId)
        const flowView = getFlowView()

        const MIN = 0
        const MAX = pagesCount - 1
        const flipWidth = flowView.viewWidth
        const flipLeft = flowView.viewLeft
        const viewLeft = config.viewSize.left
        const View = Xut.View
        const initIndex = this.initIndex
        const container = $container[0]

        /**
         * 分栏整体控制
         * @type {[type]}
         */
        const swipe = this.swipe = new Swipe({
            flipWidth: flipWidth,
            borderBounce: true,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > initIndex ? MAX : MIN,
            container,
            flipMode: 0,
            multiplePages: 1,
            stopPropagation: true,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = swipe._initDistance


        swipe.$watch('onTap', (pageIndex, hookCallback, ev) => {

            //图片缩放
            const node = ev.target

            if (node && 　node.nodeName.toLowerCase() === "img") {
                this._zoomImage(node.src.match(/\w+.jpg|png/gi))
            }

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
                        //内部页面边间翻页
                        //要除去被溢出的值
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
                    //内部页面边间翻页
                    //要除去被溢出的值
                    if (config.visualMode === 3) {
                        distance -= viewLeft
                    }

                    //后边界前移反弹
                    View.MovePage(distance, speed, this.direction, action)
                }
            }
            /**
             * 中间页面
             */
            else {

                /**
                 * 修正内部翻页的翻页算法
                 * @type {Object}
                 */
                let hooks
                if (config.visualMode === 3) {
                    hooks = {
                        flipOver: {
                            left(data) {
                                data.middle = flipWidth
                            },
                            right(data) {
                                data.middle = -flipWidth
                            }
                        }
                    }
                }

                const viewBeHideDistance = getFlipDistance({
                    action,
                    distance,
                    direction
                }, hooks)[1]

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

                //更新页码
                if (action === 'flipOver') {
                    Xut.View.pageUpdate({
                        parentIndex: initIndex,
                        sonIndex: swipe.getHindex() + 1,
                        hasSon: true,
                        direction
                    })
                }

                translation[action](container, moveDistance, speed)
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

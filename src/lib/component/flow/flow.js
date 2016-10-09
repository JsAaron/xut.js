import { config } from '../../config/index'
import { translation } from '../../pagebase/move/translation'
import { getFlowCount } from './get'
import Swipe from '../../swipe/index'
import render from './render'

import getFlipDistance from '../../visuals/distance.config'
import { getFlowView } from '../../visuals/expand/api.config'

import Slide from '../../plugin/internal/slide'
import closeButton from '../../plugin/internal/close.icon'

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


    _setImage(node, width, height, src) {

        //图片横竖
        const isHorizontalFigure = width > height
        const screenWidth = config.screenSize.width
        const screenHeight = config.screenSize.height

        let prop
        let top = 0
        let left = 0

        if (isHorizontalFigure) {

        }
        //竖图
        else {
            if (config.layoutMode === 'horizontal') {
                //竖图，横版显示
                prop = screenHeight / height
                height = screenHeight
                width = width * prop
                left = (screenWidth - width) / 2
            } else {
                //竖图，竖屏显示
                prop = screenWidth / width
                width = screenWidth
                height = height * prop
                top = (screenHeight - height) / 2
            }
        }

        const pageImageHTML =
            `<div class="page-pinch-image">
                    <div style="width:${width}px;
                                height:${height}px;
                                top:${top}px;
                                left:${left}px;
                                background-image:url(${src});">
                    </div>
             </div>`

        let $pageImage = $(String.styleFormat(pageImageHTML))
        this.$pinchNode.after($pageImage)

        Xut.Application.closeFlip()
        Xut.View.HideToolBar()

        //缩放
        let slide
        if (Xut.plat.hasTouch) {
            slide = new Slide({
                hasButton: false,
                $pagePinch: $pageImage.children()
            })
        }

        //按钮
        const $buttonNode = closeButton(() => {
            slide && slide.destroy()
            $pageImage.remove()
            node.style.visibility = ''
            this._destroyZoomImage = null
            Xut.Application.openFlip()
            Xut.View.ShowToolBar()
        })

        $pageImage.append($buttonNode)
        node.style.visibility = 'hidden'
    }

    /**
     * 缩放图片
     * @return {[type]} [description]
     */
    _zoomImage(node) {

        //图片地址
        const src = Xut.config.pathAddress + node.src.match(/\w+.(jpg|png)/gi)

        var img = new Image()
        img.src = src

        //防止图片为加载完毕
        img.onload = () => {
            this._setImage(node, img.width, img.height, src)
        }

        //失败就用默认
        img.onerror = () => {
            this._setImage(node, node.width, node.height, src)
        }
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
            if (node && node.nodeName.toLowerCase() === "img") {
                this._zoomImage(node)
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
                    Xut.View.PageUpdate({
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

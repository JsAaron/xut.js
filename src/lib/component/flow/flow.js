import { config } from '../../config/index'
import { translation } from '../../pagebase/move/translation'
import { getFlowCount } from './get'
import Swipe from '../../swipe/index'
import render from './render'

import getFlipDistance from '../../visuals/distance.config'
import { getFlowView } from '../../visuals/hooks/adapter'

import PinchPan from '../../plugin/extend/pinch.pan'
import closeButton from '../../plugin/extend/close.button'

/**
 * 2017.9.7
 * 流式排版
 */
export default class Flow {

    constructor({
        pptMaster, //母版ID
        pageIndex,
        $pinchNode,
        seasonId,
        chapterId,
        successCallback
    }) {

        let self = this
        this.initIndex = pageIndex
        this.$pinchNode = $pinchNode
        this.pptMaster = pptMaster
        render({
            $pinchNode,
            dataNode: $('#chapter-flow-' + chapterId),
            chapterId,
            callback($container) {
                self._init($container, seasonId, chapterId)
                successCallback()
            }
        })
    }

    /**
     * 获取母版对象
     * @return {[type]} [description]
     */
    _getMasterObj() {
        if (this._masterObj) {
            return this._masterObj
        }
        if (this.pptMaster) {
            this._masterObj = Xut.Presentation.GetPageObj('master', this.initIndex)
        }
    }

    _setImage(node, img, width, height, src) {

        //是竖版图片
        const isVerticalFigure = width < height
        const screenWidth = config.screenSize.width
        const screenHeight = config.screenSize.height

        let prop
        let top = 0
        let left = 0

        //宽度100%适应宽度
        const widthFullAdaptiveHeight = () => {
            prop = screenWidth / width
            width = screenWidth
            height = height * prop
            top = (screenHeight - height) / 2
        }

        //高度100% 自适应宽度
        const heightFullAdaptiveWidth = () => {
            prop = screenHeight / height
            height = screenHeight
            width = width * prop
            left = (screenWidth - width) / 2
        }

        //竖图
        if (isVerticalFigure) {
            //竖屏显示
            if (config.screenVertical) {
                widthFullAdaptiveHeight()
            }
            //横版显示
            else {
                heightFullAdaptiveWidth()
            }
        }
        //横图
        else {
            widthFullAdaptiveHeight()
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

        const $pageImage = $(String.styleFormat(pageImageHTML))
        this.$pinchNode.after($pageImage)

        this.swipe.bansliding() //flow滑动
        Xut.Application.Bansliding() //全局滑动
        Xut.View.HideToolBar('pageNumber') //工具栏

        //按钮
        let $buttonNode = closeButton(() => destory())

        //缩放
        let slide

        //销毁
        const destory = () => {
            if ($buttonNode) {
                $buttonNode.off()
                $buttonNode = null
            }

            img = null
            slide && slide.destroy()
            $pageImage.remove()
            node.style.visibility = ''
            this._destroyZoomImage = null
            this.swipe.allowliding()
            Xut.Application.Allowliding()
            Xut.View.ShowToolBar('pageNumber')
        }

        if (Xut.plat.hasTouch && config.saleMode) {
            slide = new PinchPan({
                hasButton: false,
                $pagePinch: $pageImage.children(),
                doubletap: destory
            })
        }

        node.style.visibility = 'hidden'
        $pageImage.append($buttonNode)
    }

    /**
     * 缩放图片
     * @return {[type]} [description]
     */
    _zoomImage(node) {
        //图片地址
        let src = config.pathAddress + node.src.match(/\w+.(jpg|png)/gi)

        //如果配置了高清后缀
        if (config.hqUrlSuffix) {
            src = src.replace('.', `.${config.hqUrlSuffix}.`)
        }

        let img = new Image()
        img.src = src
        img.onload = () => { //防止图片为加载完毕
            this._setImage(node, img, img.width, img.height, src)
        }
        img.onerror = () => { //失败
            img = null
        }
    }

    //pagesCount = 5
    // =>
    //   0.25
    //   0.5
    //   0.75
    //   1
    //   0
    _makeNodes(count) {
        let nodes = []
        let ratio = 1 / (count - 1) //比值
        for (let i = 1; i < count; i++) {
            nodes.push(i * ratio)
        }
        nodes.push(0)
        return nodes
    }

    /**
     * 初始化
     * @param  {[type]} $container [description]
     * @param  {[type]} $content   [description]
     * @return {[type]}            [description]
     */
    _init($container, seasonId, chapterId) {

        const flowObject = this
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

        let nodes
        if (this.pptMaster) {
            nodes = this._makeNodes(pagesCount)
        }

        /**
         * 分栏整体控制
         * @type {[type]}
         */
        const swipe = this.swipe = new Swipe({
            flipWidth: flipWidth,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > initIndex ? MAX : MIN,
            container,
            flipMode: 0,
            multiplePages: 1,
            stopPropagation: true,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = swipe.getInitDistance()

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
        }) {

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
                    if (config.viewSize.overflowWidth) {
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
                    if (config.viewSize.overflowWidth) {
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

                //修正内部翻页的翻页算法
                let hooks
                if (config.viewSize.overflowWidth) {
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

                let viewBeHideDistance = getFlipDistance({
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
                    if (direction === 'next') {
                        //右翻页，左反弹
                        moveDistance = (-flipWidth * this._hindex)
                    } else {
                        //左翻页，右反弹
                        moveDistance = -(flipWidth * this._hindex)
                    }
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

                //移动视觉差
                let moveParallaxObject = () => {
                    let masterObj = flowObject._getMasterObj()
                    if (masterObj) {
                        //处理当前页面内的视觉差对象效果
                        masterObj.moveParallax({
                            action,
                            direction,
                            pageIndex: this._hindex + 1,
                            moveDist: viewBeHideDistance,
                            speed: speed,
                            nodes: direction === 'next' ? nodes[this._hindex] : ''
                        })
                    }
                }

                translation[action](container, moveDistance, speed)
                moveParallaxObject()
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

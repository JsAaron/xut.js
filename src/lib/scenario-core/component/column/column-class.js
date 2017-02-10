import { config, resetVisualLayout } from '../../../config/index'
import { translation } from '../../pagebase/move/translation'
import { getColumnCount } from './depend'
import { getVisualDistance } from '../../../visual/visual-distance'
import { Zoom } from '../../../plugin/extend/zoom/index'
import { closeButton } from '../../../plugin/extend/close-button'
import { analysisImageName, insertImageUrlSuffix } from '../../../util/option'

import Swipe from '../../../swipe/index'

/**
 * 2017.9.7
 * 流式排版
 */
export default class ColumnClass {

    constructor({
        pptMaster, //母版ID
        pageIndex,
        $pinchNode,
        seasonId,
        chapterId,
        successCallback
    }) {
        const $container = $($('#chapter-flow-' + chapterId).html())
        this.initIndex = pageIndex
        this.$pinchNode = $pinchNode
        this.pptMaster = pptMaster
        this.zoomObjs = {}
        this.chapterId = chapterId
        this.seasonId = seasonId

        Xut.nextTick({
            container: $pinchNode,
            content: $container
        }, () => {
            this._init($container)
            successCallback()
        })
    }

    /**
     * 获取母版对象
     * @return {[type]} [description]
     */
    _getMasterObj() {
        if(this._masterObj) {
            return this._masterObj
        }
        if(this.pptMaster) {
            this._masterObj = Xut.Presentation.GetPageObj('master', this.initIndex)
        }
    }

    /**
     * 缩放图片
     * @return {[type]} [description]
     */
    _zoomImage(node) {

        let src = node.src
        if(!src) {
            return
        }

        let analysisName = analysisImageName(src)
        let imageOriginalName = analysisName.original

        let zoomObj = this.zoomObjs[imageOriginalName]
        if(zoomObj) {
            zoomObj.play()
        } else {
            //如果配置了高清后缀
            let hqSrc
                //如果启动了高清图片
            if(config.useHDImageZoom && config.imageSuffix && config.imageSuffix['1440']) {
                hqSrc = config.pathAddress + insertImageUrlSuffix(analysisName.original, config.imageSuffix['1440'])
            }
            this.zoomObjs[imageOriginalName] = new Zoom({
                element: $(node),
                originalSrc: config.pathAddress + analysisName.suffix,
                hdSrc: hqSrc
            })
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
        for(let i = 1; i < count; i++) {
            nodes.push(i * ratio)
        }
        nodes.push(0)
        return nodes
    }

    /**
     * 获取总页面数
     * @return {[type]} [description]
     */
    _getPageCount() {
        return getColumnCount(this.seasonId, this.chapterId)
    }

    /**
     * 页面总数
     */
    resetPageCount() {
        let total = this._getPageCount()
        this.MAX = total - 1
        this.swipe.setTotal(total)
    }

    /**
     * 初始化
     * @param  {[type]} $container [description]
     * @param  {[type]} $content   [description]
     * @return {[type]}            [description]
     */
    _init($container) {

        const coloumnObj = this
        const pagesCount = this._getPageCount()
        const flowView = resetVisualLayout(1)
        const flipWidth = flowView.width
        const View = Xut.View
        const initIndex = this.initIndex
        const container = $container[0]

        coloumnObj.MIN = 0
        coloumnObj.MAX = pagesCount - 1

        let nodes
        if(this.pptMaster) {
            nodes = this._makeNodes(pagesCount)
        }

        /**
         * 分栏整体控制
         * @type {[type]}
         */
        const swipe = this.swipe = new Swipe({
            flipWidth: flipWidth,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > initIndex ? coloumnObj.MAX : coloumnObj.MIN,
            container,
            flipMode: 0,
            multiplePages: 1,
            stopPropagation: true,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = swipe.getInitDistance()

        swipe.$watch('onTap', (pageIndex, hookCallback, ev, duration) => {
            //如果是长按，是针对默认的事件处理
            if(config.supportQR && duration && duration > 500) {
                return
            }
            //图片缩放
            const node = ev.target
            if(node && node.nodeName.toLowerCase() === "img") {
                this._zoomImage(node)
            }
            if(!Xut.Contents.Canvas.getIsTap()) {
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
            if(this._hindex === coloumnObj.MIN && this.direction === 'prev') {
                if(action === 'flipOver') {
                    View.GotoPrevSlide()
                    this.simulationComplete()
                } else {
                    //前边界前移反弹
                    View.MovePage(distance, speed, this.direction, action)
                }
            }
            /**
             * 尾页边界
             * @param  {[type]} this._hindex [description]
             * @return {[type]}              [description]
             */
            else if(this._hindex === coloumnObj.MAX && this.direction === 'next') {
                if(action === 'flipOver') {
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

                let viewBeHideDistance = getVisualDistance({
                    action,
                    distance,
                    direction
                })[1]

                moveDistance = viewBeHideDistance

                switch(direction) {
                    case 'next':
                        moveDistance = moveDistance + lastDistance
                        break
                    case 'prev':
                        moveDistance = moveDistance + lastDistance
                        break
                }

                //反弹
                if(action === 'flipRebound') {
                    if(direction === 'next') {
                        //右翻页，左反弹
                        moveDistance = (-flipWidth * this._hindex)
                    } else {
                        //左翻页，右反弹
                        moveDistance = -(flipWidth * this._hindex)
                    }
                }

                //更新页码
                if(action === 'flipOver') {
                    Xut.View.PageUpdate({
                        parentIndex: initIndex,
                        sonIndex: swipe.getHindex() + 1,
                        hasSon: true,
                        direction
                    })
                }

                //移动视觉差
                let moveParallaxObject = () => {
                    let masterObj = coloumnObj._getMasterObj()
                    if(masterObj) {
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

        //销毁缩放图片
        if(Object.keys(this.zoomObjs).length) {
            _.each(this.zoomObjs, (obj, key) => {
                obj.destroy()
                this.zoomObjs[key] = null
            })
        }

        this.swipe && this.swipe.destroy()
    }


}

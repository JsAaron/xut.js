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
        let originalName = analysisName.original
        let zoomObj = this.zoomObjs[originalName]
        if(zoomObj) {
            zoomObj.play()
        } else {
            //如果配置了高清后缀
            let hqSrc
            if(config.useHDImageZoom && config.imageSuffix && config.imageSuffix['1440']) {
                //如果启动了高清图片
                hqSrc = config.pathAddress + insertImageUrlSuffix(analysisName.original, config.imageSuffix['1440'])
            }
            this.zoomObjs[originalName] = new Zoom({
                element: $(node),
                originalSrc: config.pathAddress + analysisName.suffix,
                hdSrc: hqSrc
            })
        }
    }

    //pagesCount = 5
    //   0.25
    //   0.5
    //   0.75
    //   1
    //   0
    _getNodes() {
        if(this.pptMaster) {
            let nodes = []
            let ratio = 1 / (this.columnCount - 1) //比值
            for(let i = 1; i < this.columnCount; i++) {
                nodes.push(i * ratio)
            }
            return nodes.push(0)
        }
    }

    /**
     * 重新计算分栏依赖
     */
    resetColumnDep(direction) {
        let newColumnCount = getColumnCount(this.seasonId, this.chapterId)
            //如果分栏页面总数不正确
        if(this.columnCount !== newColumnCount) {
            this.columnCount = newColumnCount
            this.maxBorder = newColumnCount - 1

            //column
            this.swipe.setLinearTotal(newColumnCount, direction)

            //页码
            this._updataPageNumber(direction)

            this.lastDistance = this.swipe.getInitDistance()
        }
    }

    /**
     * 更新页码
     */
    _updataPageNumber(direction) {
        Xut.View.SetPageNumber({
            parentIndex: this.initIndex,
            sonIndex: this.swipe.getVisualIndex() + 1,
            hasSon: true,
            direction
        })
    }

    /**
     * 初始化
     * @param  {[type]} $container [description]
     * @param  {[type]} $content   [description]
     * @return {[type]}            [description]
     */
    _init($container) {

        const coloumnObj = this
        const columnWidth = resetVisualLayout(1).width
        const container = $container[0]

        //分栏数
        this.columnCount = getColumnCount(this.seasonId, this.chapterId)

        //边界
        coloumnObj.minBorder = 0
        coloumnObj.maxBorder = this.columnCount - 1

        let nodes = this._getNodes()

        /**
         * 分栏整体控制
         * @type {[type]}
         */
        const swipe = this.swipe = new Swipe({
            swipeWidth: columnWidth,
            linear: true,
            initIndex: Xut.Presentation.GetPageIndex() > coloumnObj.initIndex ? coloumnObj.maxBorder : coloumnObj.minBorder,
            container,
            flipMode: 0,
            multiplePages: 1,
            stopPropagation: true,
            pageTotal: this.columnCount
        })

        let moveDistance = 0

        coloumnObj.lastDistance = swipe.getInitDistance()

        swipe.$watch('onTap', function(pageIndex, hookCallback, ev, duration) {
            //如果是长按，是针对默认的事件处理
            if(config.supportQR && duration && duration > 500) {
                return
            }
            //图片缩放
            const node = ev.target
            if(node && node.nodeName.toLowerCase() === "img") {
                coloumnObj._zoomImage(node)
            }
            if(!Xut.Contents.Canvas.getIsTap()) {
                Xut.View.Toolbar()
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
             */
            if(swipe.visualIndex === coloumnObj.minBorder && swipe.direction === 'prev') {
                // console.log(1)
                if(action === 'flipOver') {
                    Xut.View.GotoPrevSlide()
                    swipe.simulationComplete()
                } else {
                    //前边界前移反弹
                    Xut.View.MovePage(distance, speed, swipe.direction, action)
                }
            }
            /**
             * 尾页边界
             */
            else if(swipe.visualIndex === coloumnObj.maxBorder && swipe.direction === 'next') {
                if(action === 'flipOver') {
                    Xut.View.GotoNextSlide()
                    swipe.simulationComplete()
                } else {
                    //后边界前移反弹
                    Xut.View.MovePage(distance, speed, swipe.direction, action)
                }
            }
            /**
             * 中间页面
             */
            else {
                // console.log(3)
                let viewBeHideDistance = getVisualDistance({
                    action,
                    distance,
                    direction
                })[1]

                moveDistance = viewBeHideDistance

                switch(direction) {
                    case 'next':
                        moveDistance = moveDistance + coloumnObj.lastDistance
                        break
                    case 'prev':
                        moveDistance = moveDistance + coloumnObj.lastDistance
                        break
                }

                //反弹
                if(action === 'flipRebound') {
                    if(direction === 'next') {
                        //右翻页，左反弹
                        moveDistance = (-columnWidth * swipe.visualIndex)
                    } else {
                        //左翻页，右反弹
                        moveDistance = -(columnWidth * swipe.visualIndex)
                    }
                }

                //更新页码
                if(action === 'flipOver') {
                    coloumnObj._updataPageNumber(direction)
                }

                //移动视觉差
                let moveParallaxObject = () => {
                    let masterObj = coloumnObj._getMasterObj()
                    if(masterObj) {
                        //处理当前页面内的视觉差对象效果
                        masterObj.moveParallax({
                            action,
                            direction,
                            pageIndex: swipe.visualIndex + 1,
                            moveDist: viewBeHideDistance,
                            speed: speed,
                            nodes: direction === 'next' ? nodes[swipe.visualIndex] : ''
                        })
                    }
                }

                translation[action](container, moveDistance, speed)
                moveParallaxObject()
            }

        })


        swipe.$watch('onComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
            coloumnObj.lastDistance = moveDistance
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

import { config } from '../../../config/index'
import PinchPan from '../pinch.pan'
import {
    $$on,
    $$off
} from '../../../util/dom'

import {
    createUnpeatableNumbers,
    createContainerView,
    chooseImgSource,
    execAnimation,
    getImgConfig,
    getFinalImgConfig
} from './util'


/**
 * 图片缩放功能
 * 2016.12.5
 */
export default class Zoom {

    constructor({
        container, //容器 node
        element, //img node
        originalSrc, //原始图地址
        hdSrc //高清图地址
    }) {

        //如果没有传递父容器
        //需要给元素的子元素包含一个div父容器
        //这里主要给flow的流式排版处理
        //img是行内元素，获取尺寸有问题
        // if (!container) {
            container = element.wrap('<div/>').parent()
        // }

        //获取图片的可视区的绝对布局尺寸
        this.originImgWidth = element.width()
        this.originImgHeight = element.height()
        this.originImgLeft = container.offset().left + (container.outerWidth(true) - container.width()) / 2
        this.originImgTop = container.offset().top + (container.outerHeight(true) - container.height()) / 2

        this.originSrc = originalSrc
        this.hdSrc = hdSrc
        this.$imgNode = element
        this.$container = container

        this.source = [{
            pos: 0,
            src: hdSrc ? hdSrc : originalSrc,
            width: 200
        }]

        this._init()
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */
    _init() {
        this._initSingleView()
        this._cloneOriginImgNode()
        this.targetSize = this._getData()
        this._startZoom()
    }

    /**
     * 构建容器
     * @return {[type]} [description]
     */
    _initSingleView() {
        //全局只保留一个缩放容器
        if ($('.gamma-single-view').length) {
            this.$singleView = $('.gamma-single-view')
            this.$singleView.show()
        } else {
            this.$singleView = $('<div class="gamma-single-view"></div>')
            this.$singleView.appendTo($('body'))
        }
        this.$viewContainer = $(createContainerView())
        this.$singleView.append(this.$viewContainer)
        this.$overlay = this.$viewContainer.find('.gamma-overlay')
        this.$svclose = this.$viewContainer.find('div.gamma-btn-close')
        this.callbackEnd = () => {
            this._closeSingleView()
        }

        //关闭按钮
        $$on(this.$svclose[0], {
            end: this.callbackEnd,
            cancel: this.callbackEnd
        })
    }

    /**
     * 创建原图img对象，克隆到新的节点
     * 用于缩放
     * @return {[type]} [description]
     */
    _cloneOriginImgNode() {
        let $container = this.$container
        let flyImgHTML = String.styleFormat(`
            <img src="${this.originSrc}"
                 class="gamma-img-fly"
                 style="width:${this.originImgWidth}px;
                        height:${this.originImgHeight}px;
                        left:${this.originImgLeft}px;
                        top:${this.originImgTop}px;">`)

        this.$flyNode = $(flyImgHTML)
        this.$viewContainer.append(this.$flyNode)
    }

    /**
     * 初始化缩放数据
     * @return {[type]} [description]
     */
    _getData() {
        return getImgConfig({
            sources: this.source,
            wrapper: {
                width: config.screenSize.width,
                height: config.screenSize.height
            },
            image: {
                width: this.originImgWidth,
                height: this.originImgHeight
            }
        })
    }


    /**
     * 执行缩放
     * @return {[type]} [description]
     */
    _startZoom() {
        let source = this.targetSize.source
        let position = this.targetSize.position
        let style = {
            width: position.width,
            height: position.height,
            left: position.left,
            top: position.top
        }

        this.$container.css('visibility','hidden')

        //白色背景动画
        execAnimation({
            element: this.$overlay,
            style: { opacity: 1 },
            speed: 150
        })

        //克隆的原图放大动画
        execAnimation({
            element: this.$flyNode,
            style: style,
            speed: 150
        }, () => {
            this._replaceHQ(position, source.src)
        })
    }

    /**
     * 创建高清图
     * @return {[type]} [description]
     */
    _createHQ(position) {
        let width = position.width
        let height = position.height
        let left = position.left
        let top = position.top

        //创建高清img对象，克隆到新的节点
        if (this.$hQNode) {
            //因为高清图是被关闭缩小了，所以重新play的时候需要复位
            this.$hQNode.css({ width, height, left, top }).show()
        } else {
            let hdImgHTML =
                String.styleFormat(
                    `<img src="${this.hdSrc}"
                              class="gamma-img-fly"
                              style="width:${width}px;
                                     height:${height}px;
                                     left:${left}px;
                                     top:${top}px;">`)

            this.$hQNode = $(hdImgHTML)
            this.$viewContainer.append(this.$hQNode)
        }
    }

    /**
     * 替换成高清图
     */
    _replaceHQ(position, src) {
        //如果存在高清图
        if (this.hdSrc) {

            //创建高清图
            this._createHQ(position)

            //动画隐藏缩放的图片
            //这样就可以透出高清图了
            execAnimation({
                element: this.$flyNode,
                style: { 'opacity': 0 },
                speed: 100
            }, () => {
                this.$flyNode.css({
                    'display': 'none',
                    'opacity': 1
                })
            })
        }

        //多指缩放图片
        if (!this.slideObj && Xut.plat.hasTouch && config.saleMode) {
            //如果没有高清图，采用原图
            let $node = this.$hQNode ? this.$hQNode : this.$flyNode
            this.slideObj = new PinchPan({
                hasButton: false,
                $pagePinch: $node,
                doubletap: function() {
                    alert(1)
                }
            })
        }
    }

    /**
     * 复位原始图的坐标
     * @return {[type]} [description]
     */
    _resetOriginPox() {
        this.$flyNode.css({
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop
        })
        //还原缩放
        if(this.slideObj){
            this.slideObj.reset()
        }
    }

    /**
     * 关闭放大高清图
     * @return {[type]} [description]
     */
    _closeSingleView() {

        //如果没有高清图，采用原图
        let $animNode = this.$hQNode ? this.$hQNode : this.$flyNode

        let style = {
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop
        }

        //白色背景动画
        execAnimation({
            element: this.$overlay,
            style: { opacity: 0 },
            speed: 100
        })

        //关闭节点，处理高清图片的复位
        execAnimation({
            element: $animNode,
            style: style
        }, () => {
            this.$container.css('visibility','visible')
            if (this.$hQNode) {
                execAnimation({
                    element: this.$hQNode,
                    style: { 'opacity': 0 },
                    speed: 100
                }, () => {
                    this._resetOriginPox()
                    this.$hQNode.css({
                        'display': 'none',
                        'opacity': 1
                    })
                    this.$viewContainer.hide() //容器隐藏
                    this.$singleView.hide()
                })
            } else {
                this.$viewContainer.hide() //容器隐藏
                this.$singleView.hide()
            }
        })
    }

    /**
     * 对外接口
     * 播放
     * @return {[type]} [description]
     */
    play() {
        this.$flyNode.show()
        this.$viewContainer.show()
        this.$singleView.show()
        this._startZoom()
    }

    /**
     * 对外接口
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {

        this.$viewContainer.hide()

        //创建2个图片node
        this.$flyNode.remove()
        this.$hQNode && this.$hQNode.remove()

        //关闭按钮
        $$off(this.$svclose[0], {
            end: this.callbackEnd,
            cancel: this.callbackEnd
        })

        if(this.slideObj){
            this.slideObj.destroy()
        }

        this.$container = null
        this.$flyNode = null
        this.$hQNode = null
        this.$imgNode = null
        this.$overlay = null
        this.$singleView = null
        this.$svclose = null
        this.$viewContainer.remove()
        this.$viewContainer = null
    }

}

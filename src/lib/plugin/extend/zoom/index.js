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
        element, //img node
        originalSrc, //原始图地址
        hdSrc, //高清图地址
        hasButton = false //是否需要关闭按钮
    }) {

        this.$body = $('body')
        this.$imgNode = element
        this.originSrc = originalSrc
        this.hdSrc = hdSrc
        this.hasButton = hasButton

        //获取图片的可视区的绝对布局尺寸
        this.originImgWidth = element.width()
        this.originImgHeight = element.height()
        this.originImgLeft = element.offset().left + (element.outerWidth(true) - element.width()) / 2
        this.originImgTop = element.offset().top + (element.outerHeight(true) - element.height()) / 2

        //动画中
        this.isAniming = false

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
        this._createFlyNode()
        if (!this.targetSize) {
            this.targetSize = this._getData()
        }
        this._startZoom()
    }

    _initSingleView() {

        this.$singleView = $(createContainerView())
        this.$overlay = this.$singleView.find('.gamma-overlay')

        //关闭按钮
        if (this.hasButton) {
            this.$closeButton = this.$singleView.find('.gamma-btn-close')
            this.callbackEnd = () => {
                this._closeSingleView()
            }
            $$on(this.$closeButton[0], {
                end: this.callbackEnd,
                cancel: this.callbackEnd
            })
            this.$closeButton.show()
        }

        this.$singleView.appendTo(this.$body)
    }

    /**
     * 创建原图img对象，克隆到新的节点
     * 用于缩放
     * @return {[type]} [description]
     */
    _createFlyNode() {
        this.$flyNode = $('<img/>').attr('src', this.originSrc).addClass('gamma-img-fly').css({
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop
        }).appendTo(this.$singleView)
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

        //克隆的原图放大动画
        execAnimation({
            element: this.$flyNode,
            style: {
                width: position.width,
                height: position.height,
                left: position.left,
                top: position.top
            },
            speed: 300
        }, () => {
            this._replaceHQIMG(position, source.src)
        })

        //白背景
        execAnimation({
            element: this.$overlay,
            style: { opacity: 1 },
            speed: 300
        })
    }

    /**
     * 创建高清图
     */
    _createHQIMG(position, src, success, fail) {
        if (this.$hQNode) {
            this.$hQNode.show()
            success()
        } else {
            var img = new Image();
            img.onload = () => {
                this.$hQNode = $(img)
                this.$hQNode.css({
                    width: position.width,
                    height: position.height,
                    left: position.left,
                    top: position.top
                }).addClass('gamma-img-fly').appendTo(this.$singleView);
                success()
            }
            img.onerror = () => {
                //失败
                this.hdSrc = null
                fail()
            }
            img.src = src
        }
    }

    /**
     * 是否启动图片缩放
     */
    _addPinchPan() {
        //如果没有高清图，采用原图
        let $imgNode = this.hdSrc ? this.$hQNode : this.$flyNode
        if (!this.slideObj && Xut.plat.hasTouch && config.salePicture) {
            this.slideObj = new PinchPan({
                hasButton: false,
                doubletapBan: true, //禁止双击事件
                $pagePinch: $imgNode
            })
        }
        //单击关闭处理
        if (!this.offTap) {
            this._bindTap($imgNode)
        }
    }


    /**
     * 绑定单击关闭
     * @return {[type]} [description]
     */
    _bindTap($imgNode) {

        let isMove = false
        let start = () => {
            isMove = false
        }
        let move = () => {
            isMove = true
        }
        let end = () => {
            if (!isMove) {
                this._closeSingleView()
            }
        }

        $$on($imgNode[0], {
            start: start,
            move: move,
            end: end,
            cancel: end
        })

        this.offTap = () => {
            $$off($imgNode[0], {
                start: start,
                move: move,
                end: end,
                cancel: end
            })
        }
    }


    /**
     * 替换成高清图
     */
    _replaceHQIMG(position, src) {
        //高清图
        if (this.hdSrc) {
            this._createHQIMG(position, src, () => {
                //删除飞入图片
                //用高清图替代了
                execAnimation({
                    element: this.$flyNode,
                    style: { 'opacity': 0 },
                    speed: 100
                }, () => {
                    this.$flyNode.hide()
                    this._addPinchPan()
                })
            }, () => {
                this._addPinchPan()
            })
        }
        //普通图
        else {
            this._addPinchPan()
        }

    }

    /**
     * 复位
     * 便于第二次play
     * @return {[type]} [description]
     */
    _reset() {
        this.$flyNode.css({
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop,
            opacity: 1,
            display: 'block'
        })

        if (this.$hQNode) {
            let position = this.targetSize.position
            this.$hQNode.css({
                width: position.width,
                height: position.height,
                left: position.left,
                top: position.top,
                display: 'none'
            })
        }

        if (this.hasButton) {
            this.$closeButton.show()
        }

        this.$overlay.css('opacity', 0)

        if (this.slideObj) {
            this.slideObj.reset()
        }
    }

    /**
     * 关闭放大高清图
     * @return {[type]} [description]
     */
    _closeSingleView() {
        if (this.isAniming) {
            return
        }
        this.isAniming = true
        let $imgNode = this.hdSrc ? this.$hQNode : this.$flyNode

        if (this.hasButton) {
            this.$closeButton.hide()
        }

        execAnimation({
            element: $imgNode,
            style: {
                width: this.originImgWidth,
                height: this.originImgHeight,
                left: this.originImgLeft,
                top: this.originImgTop
            },
            speed: 300
        }, () => {
            this.$singleView.hide()
            this._reset()
            this.isAniming = false
        })

        //消失背景
        execAnimation({
            element: this.$overlay,
            style: { opacity: 0 },
            speed: 200
        })
    }

    /**
     * 对外接口
     * 播放
     * @return {[type]} [description]
     */
    play() {
        this.$singleView.show()
        this._startZoom()
    }

    /**
     * 对外接口
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {

        //缩放
        if (this.slideObj) {
            this.slideObj.destroy()
            this.slideObj = null
        }

        //关闭按钮
        if (this.hasButton) {
            $$off(this.$closeButton[0], {
                end: this.callbackEnd,
                cancel: this.callbackEnd
            })
            this.$closeButton = null
        }

        //销毁单击关闭
        if (this.offTap) {
            this.offTap()
        }

        this.$hQNode = null
        this.$overlay = null
        this.$body = null
        this.$flyNode = null
        this.$imgNode = null

        this.$singleView.remove()
        this.$singleView = null

    }

}

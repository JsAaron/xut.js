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

import { sceneController } from '../../../scenario/controller'

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

        let current = sceneController.containerObj('current')
        if (current && current.$rootNode) {
            this.$container = current.$rootNode
        }
        if (!this.$container.length) {
            console.log('图片缩放依赖的容器不存在')
            return
        }

        //因为取的是xut-main-scene的坐标参考
        //所以坐标的算法是有区别了
        let containerLeft = 0
        let containerTop = 0
        if (config.viewSize.left) {
            containerLeft = config.viewSize.left
            containerTop = config.viewSize.top
        }


        this.$imgNode = element
        this.originSrc = originalSrc
        this.hdSrc = hdSrc
        this.hasButton = hasButton

        //获取图片的可视区的绝对布局尺寸
        this.originImgWidth = element.width()
        this.originImgHeight = element.height()

        let offset = element.offset()
        this.originImgLeft = offset.left - containerLeft
        this.originImgTop = offset.top - containerTop - Xut.config.visualTop

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
        if (!this.targetSize) {
            this.targetSize = this._getData()
        }
        this._startZoom()
    }

    _initSingleView() {

        this.$singleView = $(createContainerView({
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop,
            originSrc: this.originSrc
        }))
        this.$overlay = this.$singleView.find('.xut-zoom-overlay')
        this.$flyNode = this.$singleView.find('.xut-zoom-fly')

        //关闭按钮
        if (this.hasButton) {
            this.$closeButton = this.$singleView.find('.xut-zoom-close')
            this.callbackEnd = () => {
                this._closeSingleView()
            }
            $$on(this.$closeButton[0], {
                end: this.callbackEnd,
                cancel: this.callbackEnd
            })
            this.$closeButton.show()
        }

        this.$singleView.appendTo(this.$container)
    }


    /**
     * 初始化缩放数据
     * @return {[type]} [description]
     */
    _getData() {

        let view = config.screenSize
        let overflowLeft = 0

        //如果有宽度溢出
        //就是说用了窗口指定模式
        if (config.viewSize.left) {
            view = config.viewSize
        }

        //虚拟模拟3下，宽度可能溢出，所以需要取屏幕宽度
        if (config.visualMode === 3) {
            view = config.screenSize
            overflowLeft = config.viewSize.left
        }

        return getImgConfig({
            sources: this.source,
            wrapper: {
                width: view.width,
                height: view.height,
                left: overflowLeft //模式3下溢出的left
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

        // 克隆的原图放大动画
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
     * 这里存在网络是2G下载非常慢的情况
     * 会导致高清图的加载会引起卡死的现象
     * 所以针对这样的情况做了处理
     */
    _createHQIMG(position, src, success, fail) {

        //如果高清图已经存在
        if (this.$hQNode) {
            this.$hQNode.show()
            success()
            return
        }

        //如果创建
        //创建的时候图片太大，网络太慢需要优化
        let img = new Image();

        //保证失败回调只处理一次
        let hasFail = false
        let self = this

        //图片失败处理
        function isFail() {
            if (hasFail) {
                return
            }
            hasFail = true
            img = null
            destroyTap()
            fail()
        }

        //如果在高清图还没有出来的时候
        //就点击了放大图
        //那么高清图就抛弃
        let hasClick = false

        function tap() {
            hasClick = true
            if (!self.$hQNode) {
                isFail()
            }
        }

        function destroyTap() {
            $$off(self.$flyNode[0], {
                start: tap
            })
        }

        $$on(self.$flyNode[0], {
            start: tap
        })
        img.onload = function() {
            if (hasClick) {
                isFail()
                return
            }
            self.$hQNode = $(img)
            self.$hQNode.css({
                width: position.width,
                height: position.height,
                left: position.left,
                top: position.top
            }).addClass('xut-zoom-hd').appendTo(self.$singleView)
            img = null
            destroyTap()
            success(500)
        }
        img.onerror = function() {
            isFail()
        }
        img.src = src

    }

    _bindPan($imgNode) {
        if (!this.slideObj && Xut.plat.hasTouch && config.salePicture) {
            this.slideObj = new PinchPan({
                hasButton: false,
                doubletapBan: true, //禁止双击事件
                $pagePinch: $imgNode
            })
        }
        //单击关闭处理
        if (!this.offTap) {
            this._bindTapClose($imgNode)
        }
    }

    /**
     * 是否启动图片缩放
     */
    _addPinchPan() {
        //高清图
        if (this.$hQNode) {
            //如果高清图存在
            //因为高清可能是加载有延时
            //所以可能存在fly图先加载过的情况，这里需要直接清理
            if (this._hasBindFlyPan) {
                this._hasBindFlyPan = false
                this._destroyRelated()
            }
            this._bindPan(this.$hQNode)
        }
        //普通图
        else if (this.$flyNode) {
            this._hasBindFlyPan = true
            this._bindPan(this.$flyNode)
        }
    }


    /**
     * 绑定单击关闭
     * @return {[type]} [description]
     */
    _bindTapClose($imgNode) {

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
            $imgNode = null
        }
    }


    /**
     * 替换成高清图
     */
    _replaceHQIMG(position, src) {
        //高清图
        if (this.hdSrc) {
            this._createHQIMG(position, src, (speed = 200) => {
                //第一次高清图切换
                execAnimation({
                    element: this.$flyNode,
                    style: { 'opacity': 0 },
                    speed: speed
                }, () => {
                    //删除飞入图片
                    //用高清图替代了
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
        let $imgNode = this.$hQNode ? this.$hQNode : this.$flyNode

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
     * 销毁相关的一些数据
     */
    _destroyRelated() {
        //缩放
        if (this.slideObj) {
            this.slideObj.destroy()
            this.slideObj = null
        }
        //销毁单击关闭
        if (this.offTap) {
            this.offTap()
            this.offTap = null
        }
    }

    /**
     * 对外接口
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {

        this._destroyRelated()

        //关闭按钮
        if (this.hasButton) {
            $$off(this.$closeButton[0], {
                end: this.callbackEnd,
                cancel: this.callbackEnd
            })
            this.$closeButton = null
        }

        this.$hQNode = null
        this.$overlay = null
        this.$container = null
        this.$flyNode = null
        this.$imgNode = null

        this.$singleView.remove()
        this.$singleView = null

    }

}

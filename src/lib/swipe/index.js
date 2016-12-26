import Observer from '../observer/index'
import { config } from '../config/index'
import api from './api'

import {
    $$on,
    $$off,
    $$handle
} from '../util/dom'

import {
    initPointer,
    getActionPointer,
    compatibilityEvent
} from './depend'

/**
 * 翻页速率
 * @type {Number}
 */
const SPEED = 600

/**
 * 默认翻页时间
 * @type {Object}
 */
const DEFAULTTIME = {
    min: 0,
    mix: 500
}


const getDate = () => {
    return +new Date
}
const transitionDuration = Xut.style.transitionDuration
const LINEARTAG = 'data-viewlinear'

/**
 * 自定义事件类型
 * onSwipeDown 触屏点击
 * onSwipeMove 触屏移动
 * onSwipeUp   触屏松手
 * onSwipeUpSlider触屏松手 滑动处理
 * onFlipSliding 松手动画（反弹）
 * onFlipRebound 执行反弹
 * _onAnimComplete 动画完成
 * onDropApp 退出应用
 */
export default class Swipe extends Observer {

    constructor({
        flipWidth, //翻页的长度
        initIndex, //初页
        container,
        flipMode, //翻页模式
        pagetotal, //总数
        multiplePages, //多页面
        stopPropagation = false,
        preventDefault = true,
        linear = false, //线性模式
        borderBounce = true, //边界反弹
        extraGap = 0, //间隔,flow处理
        sectionRang //分段值
    }) {

        super()

        this.options = {

            stopPropagation,

            /**
             * 默认阻止所有行为
             * @type {[type]}
             */
            preventDefault,

            /**
             * 是否分段处理
             * 默认是
             * @type {[type]}
             */
            linear,

            /**
             * 启动边界反弹
             * @type {[type]}
             */
            borderBounce,

            /**
             * flipMode
             * 1 翻页没有直接效果，速度改为0
             * 2 翻页后没有动画回调
             * @type {[type]}
             */
            flipMode,

            /**
             * 是否有多页面
             */
            multiplePages,

            /**
             * section分段拼接
             * @type {[type]}
             */
            sectionRang
        }

        this._hindex = initIndex
        this.pagetotal = pagetotal
        this.container = container

        /**
         * 视图宽度
         * @type {[type]}
         */
        this._viewWidth = flipWidth || config.viewSize.width

        /**
         * 翻页时间
         * @type {[type]}
         */
        this._pageTime = this.options.flipMode ? DEFAULTTIME.min : DEFAULTTIME.mix

        /**
         * 翻页速率
         * @type {[type]}
         */
        this._speedRate = this._originalRate = this._pageTime / this._viewWidth

        /**
         * 是否移动中
         * @type {Boolean}
         */
        this._isMoving = false

        /**
         * 计算初始化页码
         * @type {[type]}
         */
        this.pagePointer = initPointer(initIndex, pagetotal)

        //初始化线性翻页
        //全局只创建一个翻页容器
        if (linear) {
            container.setAttribute(LINEARTAG, true)

            //this._initDistance 提供给flow调用
            this._initDistance = -this._hindex * (this._viewWidth + extraGap)
            container.style[Xut.style.transform] = 'translate(' + this._initDistance + 'px,0px)' + Xut.style.translateZ
            container.style.width = this._viewWidth * this.pagetotal + 'px'
        } else {
            //用于查找跟元素
            //ul => page
            //ul => master
            const ul = container.querySelectorAll('ul')
            this._bubbleNode = {
                page: ul[0],
                master: ul[1]
            }
        }

        //绑定行为
        this._initEvents()
    }


    /**
     * 绑定事件
     * @return {[type]} [description]
     */
    _initEvents() {

        const callback = {
            start: this,
            end: this,
            cancel: this,
            leave:this
        }

        //flipMode启动，没有滑动处理
        if (this.options.flipMode) {
            //不需要绑定transitionend，会设置手动会触发
        } else if (this.options.multiplePages) {
            callback.move = this
            callback.transitionend = this
        }
        $$on(this.container, callback)
    }

    /**
     * 停止默认的行为
     * @return {[type]} [description]
     */
    _stopDefault(e) {
        this.options.preventDefault && e.preventDefault()
    }

    /**
     * 事件处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleEvent(e) {

        this.options.stopPropagation && e.stopPropagation()

        //接受多事件的句柄
        $$handle({
            start(e) {
                this._stopDefault(e)
                this._onStart(e)
            },
            move(e) {
                //如果是图片
                //有可能是二维码，所以这里默认行为不阻止了
                if (config.supportQR && e.target.nodeName.toLowerCase() === "img") {} else {
                    this._stopDefault(e)
                }
                this._onMove(e)
            },
            end(e) {
                this._stopDefault(e)
                this._onEnd(e)
            },
            transitionend(e) {
                this._stopDefault(e)
                this._onAnimComplete(e)
            }
        }, this, e)
    }


    /**
     * 是否多点触发
     * @return {Boolean} [description]
     */
    _hasMultipleTouches(e) {
        return e.touches && e.touches.length > 1
    }

    /**
     * 触发
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onStart(e) {

        //如果停止滑动
        //或者多点触发
        if (this._fliplock || this._hasMultipleTouches(e)) {
            return
        }

        //判断双击速度
        //必须要大于350
        const currtTime = getDate()
        if (this._clickTime) {
            if (currtTime - this._clickTime < 350) {
                return
            }
        }
        this._clickTime = currtTime


        let interrupt
        let point = compatibilityEvent(e)

        if (!point) {
            return interrupt = this._preventSwipe = true;
        }

        /**
         * 获取观察对象
         * 钩子函数
         * point 事件对象
         * @return {[type]} [description]
         */
        this.$emit('onFilter', function() {
            interrupt = true;
        }, point, e)


        //打断动作
        if (interrupt) return;

        this._deltaX = 0;
        this._deltaY = 0;

        this._preventSwipe = false //是否滑动事件受限
        this._isBounce = false //是否反弹
        this._isRollX = false //是否为X轴滑动
        this._isRollY = false //是否为Y轴滑动
        this._isTap = true //点击了屏幕
        this._isInvalid = false //无效的触发

        this._start = {
            pageX: point.pageX,
            pageY: point.pageY,
            time: getDate()
        }
    }


    /**
     * 移动
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onMove(e) {

        //如果停止翻页
        //或者没有点击
        //或是Y轴滑动
        //或者是阻止滑动
        if (this._fliplock || !this._isTap || this._isRollY || this._preventSwipe) return

        this._isMoving = true

        let point = compatibilityEvent(e)
        let deltaX = point.pageX - this._start.pageX
        let deltaY = point.pageY - this._start.pageY
        let absDeltaX = Math.abs(deltaX)
        let absDeltaY = Math.abs(deltaY)

        //=========Y轴滑动=========
        if (!this._isRollY) {
            //Y>X => 为Y轴滑动
            if (absDeltaY > absDeltaX) {
                this._isRollY = true
                return;
            }
        }


        //=========X轴滑动=========

        //前尾是否允许反弹
        if (!this.options.borderBounce) {
            if (this._isBounce = this._borderBounce(deltaX)) return;
        }

        //滑动方向
        //left => 负
        //rigth => 正
        this._deltaX = deltaX / ((!this._hindex && deltaX > 0 // 在首页
            || this._hindex == this.pagetotal - 1 // 尾页
            && deltaX < 0 // 中间
        ) ? (absDeltaX / this._viewWidth + 1) : 1)


        if (!this._isRollX && this._deltaX) {
            this._isRollX = true
        }

        this.direction = this._deltaX > 0 ? 'prev' : 'next'

        //减少抖动
        //算一次有效的滑动
        //移动距离必须20px才开始移动
        let xWait = 20
        if (absDeltaX <= xWait) return;

        //需要叠加排除值
        if (this._deltaX > 0) {
            xWait = (-xWait)
        }

        //是否无效函数
        //如果无效，end方法抛弃掉
        //必须是同步方法：
        //动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
        const setSwipeInvalid = () => {
            this._isInvalid = true
        }

        this._distributeMove({
            pageIndex: this._hindex,
            distance: this._deltaX + xWait,
            speed: 0,
            direction: this.direction,
            action: 'flipMove',
            setSwipeInvalid
        })
    }


    /**
     * 松手
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onEnd(e) {

        //停止滑动
        //或者多点触发
        //或者是边界
        //或者是停止翻页
        if (this._fliplock || this._isBounce || this._preventSwipe || this._hasMultipleTouches(e)) {
            return
        }

        this._isTap = this._isMoving = false

        let duration
            //可能没有点击页面，没有触发start事件
        if (this._start) {
            duration = getDate() - this._start.time
        }

        //点击
        if (!this._isRollX && !this._isRollY) {
            let isReturn = false
            this.$emit('onTap', this._hindex, () => isReturn = true, e, duration)
            if (isReturn) return
        }

        //如果是左右滑动
        if (this._isRollX) {

            let deltaX = Math.abs(this._deltaX)

            //如果是首尾
            //如果是liner模式排除
            let isPastBounds = this.options.linear ? false :
                !this._hindex && this._deltaX > 0 || this._hindex == this.pagetotal - 1 && this._deltaX < 0

            //_slideTo的最低值要求
            //1 fast: time < 200 && x >30
            //2 common: x > veiwWidth/6
            let isValidSlide = duration < 200 && deltaX > 30 || deltaX > this._viewWidth / 6

            //如果是无效的动作，则不相应
            //还原默认设置
            //move的情况会引起
            //mini功能，合并翻页时事件
            if (this._isInvalid) {
                let hasSwipe = duration < 200 && deltaX > this._viewWidth / 10
                if (hasSwipe) {
                    this._distributeMove({
                        pageIndex: this._hindex,
                        direction: this._deltaX > 0 ? 'prev' : 'next',
                        action: 'swipe'
                    })
                }
                this._restore()
                return
            } else {
                //跟随移动
                if (isValidSlide && !isPastBounds) {
                    //true:right, false:left
                    this._slideTo(this._deltaX < 0 ? 'next' : 'prev')
                } else {
                    //反弹
                    this._setRebound(this._hindex, this._deltaX > 0 ? 'prev' : 'next')
                }
            }
        }

    }

    /**
     * 前尾边界反弹判断
     * @param  {[type]} deltaX [description]
     * @return {[type]}        [description]
     */
    _borderBounce(deltaX) {
        //首页,并且是左滑动
        if (this._hindex === 0 && deltaX > 0) {
            return true;
            //尾页
        } else if (this._hindex === this.pagetotal - 1 && deltaX < 0) {
            return true;
        }
    }

    /**
     * 设置反弹
     */
    _setRebound(pageIndex, direction) {
        this._distributeMove({
            'pageIndex': pageIndex,
            'direction': direction,
            'distance': 0,
            'speed': 300,
            'action': 'flipRebound'
        })
    }

    /**
     * 处理松手后滑动
     * pageIndex 页面
     * distance  移动距离
     * speed     时间
     * viewTag   可使区标记
     * follow    是否为跟随滑动
     * @return {[type]} [description]
     * pageIndex: 0, distance: -2, speed: 0, direction: "next", action: "flipMove"
     */
    _distributeMove(data) {
        let pointer = this.pagePointer
        data.leftIndex = pointer.leftIndex
        data.rightIndex = pointer.rightIndex
        this.$emit('onMove', data)
    }

    /**
     * 边界控制
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    _isBorder(direction) {
        let overflow
        let pointer = this.pagePointer
        let fillength = Object.keys(pointer).length

        switch (direction) {
            case 'prev': //前翻页
                overflow = (pointer.currIndex === 0 && fillength === 2) ? true : false;
                break;
            case 'next': //后翻页
                overflow = (pointer.currIndex === (this.pagetotal - 1) && fillength === 2) ? true : false;
                break;
        }

        return overflow
    }


    /**
     * 复位速率
     * @return {[type]} [description]
     */
    _resetRate() {
        this._speedRate = this._originalRate;
        this._isQuickTurn = false;
    }

    /**
     * 快速翻页时间计算
     */
    _setRate() {
        this._speedRate = 50 / this._viewWidth;
        this._isQuickTurn = true;
    }

    /**
     * 判断是否快速翻页
     * @return {[type]} [description]
     */
    _quickTurn() {
        const startDate = getDate()
        if (this._preTapTime) {
            if (startDate - this._preTapTime < SPEED) {
                this._setRate();
            }
        }
        this._preTapTime = getDate();
    }

    /**
     * 翻页加锁
     * @return {[type]} [description]
     */
    _lockSwipe() {
        this._fliplock = true;
    }

    /**
     * 修正页面索引
     */
    _fixHindex(currIndex) {
        this._hindex = currIndex; //翻页索引
    }


    /**
     * 更新页码标示
     */
    _updataPointer(leftIndex, currIndex, rightIndex) {
        if (arguments.length === 3) {
            this.pagePointer = {
                'leftIndex': leftIndex,
                'currIndex': currIndex,
                'rightIndex': rightIndex
            }
            return;
        }
        if (arguments.length === 1) {
            let data = leftIndex;
            let viewFlip = data.viewFlip
            this._fixHindex(data.targetIndex)
            if (viewFlip.length === 3) {
                this._updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
            }
            if (viewFlip.length === 2) {
                if (viewFlip[0] === 0) { //首页
                    this.pagePointer.rightIndex = viewFlip[1];
                    this.pagePointer.currIndex = viewFlip[0];
                    delete this.pagePointer.leftIndex;
                } else { //尾页
                    this.pagePointer.leftIndex = viewFlip[0];
                    this.pagePointer.currIndex = viewFlip[1];
                    delete this.pagePointer.rightIndex
                }
            }
            return
        }
    }

    /**
     * 增加索引的动作
     * 修正页码指示
     */
    _updateActionPointer(pointer) {

        //获取动作索引
        // createPointer
        // destroyPointer
        const actionPointer = getActionPointer(this.direction, pointer.leftIndex, pointer.rightIndex)

        //需要创建的页面
        const createPointer = actionPointer.createPointer

        //需要停止动作的页面索引
        const stopPointer = pointer.currIndex

        switch (this.direction) {
            case 'prev':
                if (-1 < createPointer) { //首页情况
                    this._updataPointer(createPointer, pointer.leftIndex, pointer.currIndex);
                }
                if (-1 === createPointer) {
                    this.pagePointer.rightIndex = pointer.currIndex;
                    this.pagePointer.currIndex = pointer.leftIndex;
                    delete this.pagePointer.leftIndex;
                }
                break;
            case 'next':
                if (this.pagetotal > createPointer) {
                    this._updataPointer(pointer.currIndex, pointer.rightIndex, createPointer);
                }
                if (this.pagetotal === createPointer) { //如果是尾页
                    this.pagePointer.leftIndex = pointer.currIndex;
                    this.pagePointer.currIndex = pointer.rightIndex;
                    delete this.pagePointer.rightIndex;
                }
                break;
        }

        //更新页面索引标识
        this.pagePointer.createPointer = createPointer
        this.pagePointer.destroyPointer = actionPointer.destroyPointer
        this.pagePointer.stopPointer = stopPointer
    }

    /**
     * 滑动到上下页面
     * direction
     *     "perv" / "next"
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    _slideTo(direction) {
        //如果在忙碌状态,如果翻页还没完毕
        if (this._fliplock) {
            return
        }

        //前后边界
        if (!this.options.linear) {
            if (this._isBorder(direction)) return;
        }

        this._lockSwipe()
        this.direction = direction
        this._quickTurn()

        /**
         * 计算滑动速度
         * @return {[type]} [description]
         */
        const calculatespeed = () => {
            return (this._viewWidth - (Math.abs(this._deltaX))) * this._speedRate || this._pageTime;
        }

        this._distributeMove({
            'pageIndex': this._hindex,
            'speed': Math.abs(calculatespeed()),
            'distance': 0,
            'direction': this.direction,
            'action': 'flipOver'
        })

        setTimeout(() => {
            //更新this.pagePointer索引
            //增加处理标记
            this._updateActionPointer(this.pagePointer)
            this.$emit('onUpSlider', this.pagePointer)
            this._fixHindex(this.pagePointer.currIndex)
        })
    }


    /**
     * 动画结束后处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onAnimComplete(e) {
        const node = e.target
        const pageType = node.getAttribute('data-pageType')
        const view = node.getAttribute('data-view') //操作的可视窗口
        const linearView = node.getAttribute(LINEARTAG) //流式布局

        //去掉动画时间
        if (node) {
            node.style[transitionDuration] = ''
        }

        //流式布局处理
        if (linearView && !view) {
            this._distributed(node, view)
            return
        }

        //反弹效果,未翻页
        if (!view) {
            if (!pageType) {
                //只针对母板处理
                this.$emit('onMasterMove', this._hindex, node);
            }
            return
        }

        this._distributed(node, view)
    }


    _distributed(...arg) {
        this._restore(...arg)

        //延长获取更pagePointer的更新值
        setTimeout(() => {
            this.$emit('onComplete', this.direction, this.pagePointer, this._unlockSwipe.bind(this), this._isQuickTurn)
        }, 50)
    }


    /**
     * 还原设置
     * @return {[type]} [description]
     */
    _restore(node, view) {

        this._isMoving = false

        //针对拖拽翻页阻止
        this._preventSwipe = true
        this._isTap = false;
        //恢复速率
        this._resetRate();
        view && node.removeAttribute('data-view', 'false');
    }


    /**
     * 解锁翻页
     * @return {[type]} [description]
     */
    _unlockSwipe() {
        this._fliplock = false
    }


    /**
     * 销毁事件
     * @return {[type]} [description]
     */
    _off() {
        $$off(this.container, {
            start: this,
            move: this,
            end: this,
            cancel: this,
            transitionend: this,
            leave: this
        })
    }


}


api(Swipe)

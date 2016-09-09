import { Observer } from '../observer/index'
import { config } from '../config/index'
import api from './api'

import {
    bindTap,
    offTap,
    handle
} from '../core/event'

import {
    initPointer,
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

const PREFIXSTYLE = Xut.plat.prefixStyle
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
        initIndex, //初页
        container,
        pageFlip, //翻页模式
        pagetotal,  //总数
        multiplePages, //多页面
        preventDefault,
        linear = false, //线性模式
        borderBounce = false, //边界反弹
        extraGap = 0 //间隔
    } = {}) {

        super()

        this._hindex = initIndex
        this._extraGap = extraGap
        this.pagetotal = pagetotal
        this.multiplePages = multiplePages
        this.element = container

        this._viewWidth = config.viewSize.width

        //翻页时间
        this._pageTime = pageFlip ? DEFAULTTIME.min : DEFAULTTIME.mix

        //翻页速率
        this._speedRate = this._originalRate = this._pageTime / this._viewWidth

        //计算初始化页码
        this._pagePointer = initPointer(initIndex, pagetotal)


        this.options = {

            preventDefault: preventDefault !== undefined ? preventDefault : true,

            /**
             * 是否分段处理
             * 默认是
             * @type {[type]}
             */
            linear: linear,

            /**
             * 启动边界反弹
             * @type {[type]}
             */
            borderBounce: borderBounce
        }

        //增加回到标记
        if (linear) {
            container.setAttribute(LINEARTAG, true)
        }

        this._initTransform()

        //绑定行为
        this._initEvents()

        //用于查找跟元素
        const ul = this.element.querySelectorAll('ul');
        this.bubbleNode = {
            page: ul[0],
            master: ul[1]
        }
    }


    _initTransform(distance) {
        if (this.options.linear) {
            this._initDistance = -this._hindex * (this._viewWidth + this._extraGap)
            this.element.style[PREFIXSTYLE('transform')] = `translate3d(${this._initDistance}px,0px,0px)`
        }

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
        const pointer = this._pagePointer
        data.leftIndex = pointer.leftIndex
        data.rightIndex = pointer.rightIndex
        this.$emit('onMove', data)
    }


    /**
     * 绑定事件
     * @return {[type]} [description]
     */
    _initEvents() {

        const callback = {
            start: this,
            end: this
        }

        //pageFlip启动，没有滑动处理
        if (this.pageFlip) {
            callback.transitionend = this
        } else if (this.multiplePages) {
            callback.move = this
            callback.transitionend = this
        }

        bindTap(this.element, callback)
    }


    /**
     * 触发
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onStart(e) {

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

        this._start = {
            pageX: point.pageX,
            pageY: point.pageY,
            time: getDate()
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
     * 移动
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onMove(e) {

        //如果没有点击
        //或是Y轴滑动
        //或者是阻止滑动
        if (!this._isTap || this._isRollY || this._preventSwipe) return

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

        if (this.options.preventDefault) {
            e.preventDefault()
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

        !this._fliplock && this._distributeMove({
            'pageIndex': this._hindex,
            'distance': this._deltaX + xWait,
            'speed': 0,
            'direction': this.direction,
            'action': 'flipMove'
        })
    }


    /**
     * 松手
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onEnd(e) {

        this._isTap = false

        if (this._isBounce || this._preventSwipe) return

        //点击
        if (!this._isRollX && !this._isRollY) {
            let isReturn = false
            this.$emit('onTap', this._hindex, () => isReturn = true);
            if (isReturn) return
        }

        //如果是左右滑动
        if (this._isRollX) {

            let duration = getDate() - this._start.time
            let deltaX = Math.abs(this._deltaX)

            //如果是首尾
            //如果是liner模式排除
            let isPastBounds = this.options.linear ? false :
                !this._hindex && this._deltaX > 0 || this._hindex == this.pagetotal - 1 && this._deltaX < 0

            //_slideTo的最低值要求
            //1 fast: time < 200 && x >30
            //2 common: x > veiwWidth/6
            let isValidSlide = Number(duration) < 200 && Math.abs(deltaX) > 30 || Math.abs(deltaX) > this._viewWidth / 6

            //跟随移动
            if (!this._fliplock && isValidSlide && !isPastBounds) {
                //true:right, false:left
                this._slideTo(this._deltaX < 0 ? 'next' : 'prev')
            } else {
                //反弹
                this._distributeMove({
                    'pageIndex': this._hindex,
                    'direction': this._deltaX > 0 ? 'prev' : 'next',
                    'distance': 0,
                    'speed': 300,
                    'action': 'flipRebound'
                });
            }
        }

    }


    /**
     * 边界控制
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    _isBorder(direction) {
        let overflow
        let pointer = this._pagePointer
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
    _lock() {
        this._fliplock = true;
    }


    //转换页码索引
    //direction 方向
    //pointer 当前页码标示
    //[17 18 19]  _pagePointer
    //[18 19 20]  转换后
    // 17 销毁
    // 20 创建
    _tanrsfromPointer(pointer) {
        let createPointer //创建的页
        let destroyPointer //销毁的页
        switch (this.direction) {
            case 'prev': //前处理
                createPointer = (pointer.leftIndex - 1);
                destroyPointer = (pointer.rightIndex);
                break;
            case 'next': //后处理
                createPointer = (pointer.rightIndex + 1);
                destroyPointer = (pointer.leftIndex);
                break;
        }
        pointer.createPointer = createPointer
        pointer.destroyPointer = destroyPointer
        return pointer
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
            this._pagePointer = {
                'leftIndex': leftIndex,
                'currIndex': currIndex,
                'rightIndex': rightIndex
            }
            return;
        }
        if (arguments.length === 1) {
            let data = leftIndex;
            let viewFlip = data['viewFlip'];
            this._fixHindex(data.targetIndex);
            if (viewFlip.length === 3) {
                this._updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
            }
            if (viewFlip.length === 2) {
                if (viewFlip[0] === 0) { //首页
                    this._pagePointer['rightIndex'] = viewFlip[1];
                    this._pagePointer['currIndex'] = viewFlip[0];
                    delete this._pagePointer['leftIndex'];
                } else { //尾页
                    this._pagePointer['leftIndex'] = viewFlip[0];
                    this._pagePointer['currIndex'] = viewFlip[1];
                    delete this._pagePointer['rightIndex'];
                }
            }
            return
        }
    }


    /**
     * 修正页码指示
     */
    _fixPointer(pointer) {
        //需要停止动作的页面索引
        const stopPointer = pointer.currIndex;
        switch (this.direction) {
            case 'prev':
                if (-1 < pointer.createPointer) { //首页情况
                    this._updataPointer(pointer.createPointer, pointer.leftIndex, pointer.currIndex);
                }
                if (-1 === pointer.createPointer) {
                    this._pagePointer['rightIndex'] = pointer.currIndex;
                    this._pagePointer['currIndex'] = pointer.leftIndex;
                    delete this._pagePointer['leftIndex'];
                }
                break;
            case 'next':
                if (this.pagetotal > pointer.createPointer) {
                    this._updataPointer(pointer.currIndex, pointer.rightIndex, pointer.createPointer);
                }
                if (this.pagetotal === pointer.createPointer) { //如果是尾页
                    this._pagePointer['leftIndex'] = pointer.currIndex;
                    this._pagePointer['currIndex'] = pointer.rightIndex;
                    delete this._pagePointer['rightIndex'];
                }
                break;
        }
        this._pagePointer['createPointer'] = pointer.createPointer
        this._pagePointer['destroyPointer'] = pointer.destroyPointer
        this._pagePointer['stopPointer'] = stopPointer
        return this._pagePointer
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
            return;
        }

        //前后边界
        if (!this.options.linear) {
            if (this._isBorder(direction)) return;
        }

        this._lock()
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
            'speed': calculatespeed(),
            'distance': 0,
            'direction': this.direction,
            'action': 'flipOver'
        })


        setTimeout(() => {
            let newPointer = this._tanrsfromPointer(this._pagePointer)
            newPointer = this._fixPointer(newPointer)
            this.$emit('onUpSlider', newPointer)
            this._fixHindex(newPointer.currIndex)
        })
    }


    /**
     * 动画结束后处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onAnimComplete(e) {
        const element = e.target
        const pageType = element.getAttribute('data-pageType')
        const view = element.getAttribute('data-view') //操作的可视窗口
        const linearView = element.getAttribute(LINEARTAG) //流式布局

        //流式布局处理
        if (linearView && !view) {
            this._distributed(element, view)
            return
        }

        //反弹效果,未翻页
        if (!view) {
            if (!pageType) {
                //只针对母板处理
                this.$emit('onMasterMove', this._hindex, element);
            }
            return
        }

        this._distributed(element, view)
    }

    _distributed(element, view) {
        //针对拖拽翻页阻止
        this._preventSwipe = true
        this._isTap = false;
        //恢复速率
        this._resetRate();
        view && element.removeAttribute('data-view', 'false');
        setTimeout(() => {
            this.$emit('onComplete', this.direction, this._pagePointer, this._unlock.bind(this), this._isQuickTurn);
        }, 100)
    }


    /**
     * 解锁翻页
     * @return {[type]} [description]
     */
    _unlock() {
        this._fliplock = false;
    }


    /**
     * 销毁事件
     * @return {[type]} [description]
     */
    _evtDestroy() {
        offTap(this.element, {
            start: this,
            move: this,
            end: this,
            transitionend: this
        })
    }


    /**
     * 事件处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleEvent(e) {
        handle({
            start(e) {
                e.stopPropagation()
                this._onStart(e)
            },
            move(e) {
                e.stopPropagation()
                this._onMove(e)
            },
            end(e) {
                e.stopPropagation()
                this._onEnd(e)
            },
            transitionend(e) {
                e.stopPropagation()
                this._onAnimComplete(e)
            }
        }, this, e)
    }



}


api(Swipe)

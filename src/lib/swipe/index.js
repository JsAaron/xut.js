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
    compatibilityEvent,
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
        initIndex,
        container,
        pageFlip,
        pagetotal,
        multiplePages
    } = {}) {

        super()

        this.hindex = initIndex
        this.pagetotal = pagetotal
        this.multiplePages = multiplePages
        this.element = container

        this._viewWidth = config.viewSize.width

        //翻页时间
        this._pageTime = pageFlip ? DEFAULTTIME.min : DEFAULTTIME.mix

        //翻页速率
        this._speedRate = this._originalRate = this._pageTime / this._viewWidth

        //计算初始化页码
        this.pagePointer = initPointer(initIndex, pagetotal)

        //绑定行为
        this._initOperation()

        //用于查找跟元素
        const ul = this.element.querySelectorAll('ul');
        this.bubbleNode = {
            page: ul[0],
            master: ul[1]
        }
    }


    /**
     * 首位越界处理，不反弹
     * @param  {[type]} deltaX [description]
     * @return {[type]}        [description]
     */
    _overstep(deltaX) {
        //首页,并且是左滑动
        if (this.hindex === 0 && deltaX > 0) {
            return true;
            //尾页
        } else if (this.hindex === this.pagetotal - 1 && deltaX < 0) {
            return true;
        }
    }


    /**
     * 溢出控制
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    _scopePointer(direction) {
        var overflow,
            pointer = this.pagePointer,
            fillength = Object.keys(pointer).length;

        switch (direction) {
            case 'prev': //前翻页
                overflow = (pointer.currIndex === 0 && fillength === 2) ? true : false;
                break;
            case 'next': //后翻页
                overflow = (pointer.currIndex === (this.pagetotal - 1) && fillength === 2) ? true : false;
                break;
        }

        return {
            pointer: pointer,
            overflow: overflow //是否溢出
        }
    }


    //转换页码索引
    //direction 方向
    //pointer 当前页码标示
    //[17 18 19]  pagePointer
    //[18 19 20]  转换后
    // 17 销毁
    // 20 创建
    _shiftPointer(pointer) {
        var createPointer, //创建的页
            destroyPointer; //销毁的页

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

        pointer['createPointer'] = createPointer;
        pointer['destroyPointer'] = destroyPointer;

        return pointer;
    }


    /**
     * 修正页码指示
     */
    _revisedFilpPointer(pointer) {

        //需要停止动作的页面索引
        var stopPointer = pointer.currIndex;

        switch (this.direction) {
            case 'prev': //前处理
                if (-1 < pointer.createPointer) { //首页情况
                    this._updataPointer(pointer.createPointer, pointer.leftIndex, pointer.currIndex);
                }
                if (-1 === pointer.createPointer) {
                    this.pagePointer['rightIndex'] = pointer.currIndex;
                    this.pagePointer['currIndex'] = pointer.leftIndex;
                    delete this.pagePointer['leftIndex'];
                }
                break;
            case 'next': //后处理
                if (this.pagetotal > pointer.createPointer) {
                    this._updataPointer(pointer.currIndex, pointer.rightIndex, pointer.createPointer);
                }
                if (this.pagetotal === pointer.createPointer) { //如果是尾页
                    this.pagePointer['leftIndex'] = pointer.currIndex;
                    this.pagePointer['currIndex'] = pointer.rightIndex;
                    delete this.pagePointer['rightIndex'];
                }
                break;
        }

        this.pagePointer['createPointer'] = pointer.createPointer;
        this.pagePointer['destroyPointer'] = pointer.destroyPointer;
        this.pagePointer['stopPointer'] = stopPointer;

        return this.pagePointer;
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
            var data = leftIndex;
            var viewFlip = data['viewFlip'];

            this.fixHindex(data.targetIndex);

            if (viewFlip.length === 3) {
                this._updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
            }
            if (viewFlip.length === 2) {
                if (viewFlip[0] === 0) { //首页
                    this.pagePointer['rightIndex'] = viewFlip[1];
                    this.pagePointer['currIndex'] = viewFlip[0];
                    delete this.pagePointer['leftIndex'];
                } else { //尾页
                    this.pagePointer['leftIndex'] = viewFlip[0];
                    this.pagePointer['currIndex'] = viewFlip[1];
                    delete this.pagePointer['rightIndex'];
                }
            }
            return;
        }

    }

    /**
     * 修正页面索引
     */
    fixHindex(currIndex) {
        this.hindex = currIndex; //翻页索引
    }


    /**
     * 判断是否快速翻页
     * @return {[type]} [description]
     */
    _judgeQuickTurn() {

        var startDate = +new Date();

        if (this.preClickTime) {
            if (startDate - this.preClickTime < SPEED) {
                this._setRate();
            }
        }

        this.preClickTime = +new Date();
    }


    /**
     * 计算滑动速度
     * @return {[type]} [description]
     */
    _calculatespeed() {
        return (this._viewWidth - (Math.abs(this._deltaX))) * this._speedRate || this._pageTime;
    }

    /**
     * 处理松手后滑动
     * pageIndex 页面
     * distance  移动距离
     * speed     时间
     * viewTag   可使区标记
     * follow    是否为跟随滑动
     * @return {[type]} [description]
     */
    _processorMove(data) {
        const pagePointer = this.pagePointer;
        data.leftIndex = pagePointer.leftIndex;
        data.rightIndex = pagePointer.rightIndex;
        this.$emit('onSwipeMove', data)
    }

    /**
     * 滑动事件派发处理
     * 停止动画,视频 音频
     * @return {[type]} [description]
     */
    _sliderStop(pointers) {
        this.$emit('onSwipeUpSlider', pointers);
    }


    /**
     * 绑定事件
     * @return {[type]} [description]
     */
    _initOperation() {

        var callback = {
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
     * 触发
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onStart(e) {

        //判断双击速度
        //必须要大于350
        const currtTime = (+new Date())
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
        this.$emit('filter', function() {
            interrupt = true;
        }, point, e)


        //打断动作
        if (interrupt) return;

        this._deltaX = 0;
        this._deltaY = 0;

        this._preventSwipe = false //是否滑动事件受限
        this._isOverstep = false //是否边界溢出
        this._isScrollX = false //是否为X轴滑动
        this._isScrollY = false //是否为Y轴滑动
        this._isTouching = true //点击了屏幕

        this._start = {
            pageX: point.pageX,
            pageY: point.pageY,
            time: (+new Date())
        };
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
        if (!this._isTouching || this._isScrollY || this._preventSwipe) return;

        let point = compatibilityEvent(e),
            deltaX = point.pageX - this._start.pageX,
            deltaY = point.pageY - this._start.pageY,
            absDeltaX = Math.abs(deltaX),
            absDeltaY = Math.abs(deltaY);

        //===============Y轴滑动======================
        if (!this._isScrollY) {
            //Y>X => 为Y轴滑动
            if (absDeltaY > absDeltaX) {
                this._isScrollY = true
                return;
            }
        }


        //===============X轴滑动======================

        //越界处理
        if (this._isOverstep = this._overstep(deltaX)) return;

        //防止滚动
        e.preventDefault();

        //滑动方向
        //left => 负
        //rigth => 正
        this._deltaX = deltaX / ((!this.hindex && deltaX > 0 // 在首页
            || this.hindex == this.pagetotal - 1 // 尾页
            && deltaX < 0 // 中间
        ) ? (absDeltaX / this._viewWidth + 1) : 1)

        if (!this._isScrollX && this._deltaX) {
            this._isScrollX = true
        }

        //减少抖动
        //算一次有效的滑动
        //移动距离必须25px才开始移动
        if (absDeltaX <= 25) return;

        let delayX = 0;
        //需要叠加排除值
        if (this._deltaX < 0) {
            delayX = 20;
        } else {
            delayX = (-20);
        }

        !this.fliplock && this._processorMove({
            'pageIndex': this.hindex,
            'distance': this._deltaX + delayX,
            'speed': 0,
            'direction': this._deltaX > 0 ? 'prev' : 'next',
            'action': 'flipMove'
        });
    }


    /**
     * 松手
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onEnd(e) {

        this._isTouching = false;

        if (this._isOverstep || this._preventSwipe) return;

        //点击
        if (!this._isScrollX && !this._isScrollY) {
            var isReturn = false;
            this.$emit('onSwipeUp', this.hindex, function() {
                isReturn = true;
            });
            if (isReturn) return;
        }

        //如果是左右滑动
        if (this._isScrollX) {

            var duration = +new Date - this._start.time,
                deltaX = Math.abs(this._deltaX),
                //如果是首尾
                isPastBounds = !this.hindex && this._deltaX > 0 || this.hindex == this.pagetotal - 1 && this._deltaX < 0,
                isValidSlide =
                Number(duration) < 200 && Math.abs(deltaX) > 30 || Math.abs(deltaX) > this._viewWidth / 6;


            //跟随移动
            if (!this.fliplock && isValidSlide && !isPastBounds) {
                if (this._deltaX < 0) { //true:right, false:left
                    this._slideTo('next');
                } else {
                    this._slideTo('prev');
                }
            } else {
                //反弹
                this._processorMove({
                    'pageIndex': this.hindex,
                    'direction': this._deltaX > 0 ? 'prev' : 'next',
                    'distance': 0,
                    'speed': 300,
                    'action': 'flipRebound'
                });
            }
        }

    }


    /**
     * 动画结束后处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    _onAnimComplete(e) {
        var target = e.target,
            pageType = target.getAttribute('data-pageType'),
            view = target.getAttribute('data-view'); //操作的可视窗口

        //反弹效果,未翻页
        if (!view) {
            if (!pageType) {
                //只针对母板处理
                this.$emit('onMasterMove', this.hindex, target);
            }
            return;
        }

        this._distributed(target);
    }


    _slideTo(direction) {
        var resolve;
        //如果在忙碌状态,如果翻页还没完毕
        if (Xut.busyBarState || this.fliplock) {
            return;
        };
        resolve = this._scopePointer(direction);
        if (resolve.overflow) return;
        this._startAnimTo(resolve.pointer, direction);
    }


    _startAnimTo(pointer, direction) {
        this._lock()
        this.prveHindex = this.hindex;
        this.direction = direction;
        this._judgeQuickTurn();
        if (direction === 'next') {
            this._nextRun(pointer);
        } else {
            this._preRun(pointer);
        }
    }


    /**
     * 上翻页
     */
    _preRun(pointer) {
        var pointers, me = this;

        function createPrev() {
            pointers = me._shiftPointer(pointer);
            pointers = me._revisedFilpPointer(pointers);
            me._sliderStop(pointers);
            me.fixHindex(pointers.currIndex);
        }

        this._processorMove({
            'pageIndex': this.hindex,
            'speed': this._calculatespeed(),
            'distance': 0,
            'direction': this.direction,
            'action': 'flipOver'
        });

        //动画执行
        setTimeout(createPrev);
    }


    /**
     * 下翻页
     */
    _nextRun(pointer) {
        var pointers, me = this;

        function createNext() {
            pointers = me._shiftPointer(pointer);
            pointers = me._revisedFilpPointer(pointers);
            me._sliderStop(pointers);
            me.fixHindex(pointers.currIndex);
        }

        this._processorMove({
            'pageIndex': this.hindex,
            'speed': this._calculatespeed(),
            'distance': 0,
            'direction': this.direction,
            'action': 'flipOver'
        });

        //动画执行
        setTimeout(createNext);
    }


    /**
     * 派发事件
     * @return {[type]} [description]
     */
    _distributed(element) {

        //针对拖拽翻页阻止
        this._preventSwipe = true;
        this._isTouching = false;

        //快速翻页
        var isQuickTurn = this.isQuickTurn;

        //恢复速率
        this._resetRate();

        element.removeAttribute('data-view', 'false');

        var slef = this;
        setTimeout(function() {
            slef.$emit('onAnimComplete', slef.direction, slef.pagePointer, slef._unlock.bind(slef), isQuickTurn);
        }, 100)
    }


    /**
     * 翻页加锁
     * @return {[type]} [description]
     */
    _lock() {
        this.fliplock = true;
    }


    /**
     * 解锁翻页
     * @return {[type]} [description]
     */
    _unlock() {
        this.fliplock = false;
    }


    /**
     * 快速翻页时间计算
     */
    _setRate() {
        this._speedRate = 50 / this._viewWidth;
        this.isQuickTurn = true;
    }


    /**
     * 复位速率
     * @return {[type]} [description]
     */
    _resetRate() {
        this._speedRate = this._originalRate;
        this.isQuickTurn = false;
    }


    /**
     * 事件处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleEvent(e) {
        handle({
            start: function(e) {
                this._onStart(e)
            },
            move: function(e) {
                this._onMove(e)
            },
            end: function(e) {
                this._onEnd(e)
            },
            transitionend: function(e) {
                this._onAnimComplete(e)
            }
        }, this, e)
    }



}


api(Swipe)

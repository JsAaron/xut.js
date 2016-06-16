// 观察
import { Observer } from '../observer/index'

/**
 * 初始化首次范围
 * @return {[type]} [description]
 */
let initPointer = (init, pagetotal) => {
    var leftscope = 0,
        pagePointer = {};

    if (init === leftscope) { //首页
        pagePointer['currIndex'] = init;
        pagePointer['rightIndex'] = init + 1;
    } else if (init === pagetotal - 1) { //首页
        pagePointer['currIndex'] = init;
        pagePointer['leftIndex'] = init - 1;
    } else { //中间页
        pagePointer['leftIndex'] = init - 1;
        pagePointer['currIndex'] = init;
        pagePointer['rightIndex'] = init + 1;
    }
    return pagePointer;
}

/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
let compatibilityEvent = (e) => {
    var point;
    if (e.touches && e.touches[0]) {
        point = e.touches[0];
    } else {
        point = e;
    }
    return point
}

/**
 * 计算当前已经创建的页面索引
 */
let calculationIndex = (currIndex, targetIndex, pagetotal) => {
    var i = 0,
        existpage,
        createpage,
        pageIndex,
        ruleOut = [],
        create = [],
        destroy,
        viewFlip;

    //存在的页面
    if (currIndex === 0) {
        existpage = [currIndex, currIndex + 1];
    } else if (currIndex === pagetotal - 1) {
        existpage = [currIndex - 1, currIndex];
    } else {
        existpage = [currIndex - 1, currIndex, currIndex + 1];
    }

    //需要创建的新页面
    if (targetIndex === 0) {
        createpage = [targetIndex, targetIndex + 1];
    } else if (targetIndex === pagetotal - 1) {
        createpage = [targetIndex - 1, targetIndex];
    } else {
        createpage = [targetIndex - 1, targetIndex, targetIndex + 1];
    }

    for (; i < createpage.length; i++) {
        pageIndex = createpage[i];
        //跳过存在的页面
        if (-1 === existpage.indexOf(pageIndex)) {
            //创建目标的页面
            create.push(pageIndex);
        } else {
            //排除已存在的页面
            ruleOut.push(pageIndex);
        }
    }

    _.each(ruleOut, function(ruleOutIndex) {
        existpage.splice(existpage.indexOf(ruleOutIndex), 1)
    });

    destroy = existpage;

    viewFlip = [].concat(create).concat(ruleOut).sort(function(a, b) {
        return a - b
    });

    return {
        'create': create,
        'ruleOut': ruleOut,
        'destroy': destroy,
        'viewFlip': viewFlip,
        'targetIndex': targetIndex,
        'currIndex': currIndex
    }
}



//============================
//
//    自定义事件类型
//
// //触屏点击
// 'onSwipeDown',
// //触屏移动
// 'onSwipeMove',
// //触屏松手
// 'onSwipeUp',
// //触屏松手 滑动处理
// 'onSwipeUpSlider',
// //松手动画（反弹）
// 'onFlipSliding',
// //执行反弹
// 'onFlipRebound',
// //动画完成
// 'onAnimComplete',
// //退出应用
// 'onDropApp'

export class GlobalEvent extends Observer {

    constructor(options, config) {
        super()

        options.hindex = options.initIndex;
        this.screenWidth = config.screenSize.width;
        _.extend(this, options);

        // this.element = options.rootPage;
        this.element = options.container;

        /**
         * 翻页时间
         * @type {Number}
         */
        this.speed = options.pageFlip ? 0 : 500;

        /**
         * 翻页速率
         * @type {Number}
         */
        this.clickSpeed = 600;


        /**
         * 速率
         * @type {[type]}
         */
        this.speedRate = this.originalRate = this.speed / this.screenWidth;


        /**
         * 计算初始化页码
         * @type {[type]}
         */
        this.pagePointer = initPointer(options.hindex, options.pagetotal);


        /**
         * 初始化绑定事件
         */
        if (!this.prveIndex) {
            this.prveIndex = this.hindex;
        }

        //ibooks不绑定全局事件
        // if (!Xut.IBooks.runMode()) {
        this._bindEvt();
        // }


        //用于查找跟元素
        var ul = this.element.querySelectorAll('ul');
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
    overstep(deltaX) {
        //首页,并且是左滑动
        if (this.hindex === 0 && deltaX > 0) {
            return true;
            //尾页
        } else if (this.hindex === this.pagetotal - 1 && deltaX < 0) {
            return true;
        }
    }

    /**
     * 前翻页接口
     * @return {[type]} [description]
     */
    prev() {
        if (!this.overstep(1)) {
            this.slideTo('prev');
        };
    }

    /**
     * 后翻页接口
     * @return {Function} [description]
     */
    next() {
        if (!this.overstep(-1)) {
            this.slideTo('next');
        }
    }

    /**
     * 检车是否还在移动中
     * @return {Boolean} [description]
     */
    isMove() {
        return this.fliplock;
    }

    /**
     * 是否为边界
     * @param  {[type]}  distance [description]
     * @return {Boolean}          [description]
     */
    isBorder(distance) {
        //起点左偏移
        if (this.hindex === 0 && distance > 0) {
            return true;
        }
        //终点右偏移
        if (this.hindex === (this.pagetotal - 1) && distance < 0) {
            return true
        }
    }

    /**
     * 目标元素
     * 找到li元素
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    findRootElement(point, pageType) {
        var liNode, map,
            hindex = this.hindex,
            sectionRang = this.sectionRang,
            //找到对应的li
            childNodes = this.bubbleNode[pageType].childNodes,
            numNodes = childNodes.length;

        while (numNodes--) {
            liNode = childNodes[numNodes];
            map = liNode.getAttribute('data-map');
            if (sectionRang) {
                hindex += sectionRang.start;
            }
            if (map == hindex) {
                return liNode
            }
            hindex = this.hindex;
        }
    }

    /**
     * 溢出控制
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    scopePointer(direction) {
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
    shiftPointer(pointer) {
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
    revisedFilpPointer(pointer) {

        //需要停止动作的页面索引
        var stopPointer = pointer.currIndex;

        switch (this.direction) {
            case 'prev': //前处理
                if (-1 < pointer.createPointer) { //首页情况
                    this.updataPointer(pointer.createPointer, pointer.leftIndex, pointer.currIndex);
                }
                if (-1 === pointer.createPointer) {
                    this.pagePointer['rightIndex'] = pointer.currIndex;
                    this.pagePointer['currIndex'] = pointer.leftIndex;
                    delete this.pagePointer['leftIndex'];
                }
                break;
            case 'next': //后处理
                if (this.pagetotal > pointer.createPointer) {
                    this.updataPointer(pointer.currIndex, pointer.rightIndex, pointer.createPointer);
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
    updataPointer(leftIndex, currIndex, rightIndex) {
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
                this.updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
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

    slideTo(direction) {
        var resolve;
        //如果在忙碌状态,如果翻页还没完毕
        if (Xut.busyBarState || this.fliplock) {
            return;
        };
        resolve = this.scopePointer(direction);
        if (resolve.overflow) return;
        this.startAnimTo(resolve.pointer, direction);
    }

    startAnimTo(pointer, direction) {
        this.fliplock = true;
        this.prveHindex = this.hindex;
        this.direction = direction;
        this.judgeQuickTurn();
        if (direction === 'next') {
            this.nextRun(pointer);
        } else {
            this.preRun(pointer);
        }
    }


    /**
     * 上翻页
     */
    preRun(pointer) {
        var pointers, me = this;

        function createPrev() {
            pointers = me.shiftPointer(pointer);
            pointers = me.revisedFilpPointer(pointers);
            me.sliderStop(pointers);
            me.fixHindex(pointers.currIndex);
        }

        this.processorMove({
            'pageIndex': this.hindex,
            'speed': this.calculatespeed(),
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
    nextRun(pointer) {
        var pointers, me = this;

        function createNext() {
            pointers = me.shiftPointer(pointer);
            pointers = me.revisedFilpPointer(pointers);
            me.sliderStop(pointers);
            me.fixHindex(pointers.currIndex);
        }

        this.processorMove({
            'pageIndex': this.hindex,
            'speed': this.calculatespeed(),
            'distance': 0,
            'direction': this.direction,
            'action': 'flipOver'
        });

        //动画执行
        setTimeout(createNext);
    }


    /**
     * 判断是否快速翻页
     * @return {[type]} [description]
     */
    judgeQuickTurn() {

        var startDate = +new Date();

        if (this.preClickTime) {
            if (startDate - this.preClickTime < this.clickSpeed) {
                this.setRate();
            }
        }

        this.preClickTime = +new Date();
    }


    /**
     * 计算滑动速度
     * @return {[type]} [description]
     */
    calculatespeed() {
        return (this.screenWidth - (Math.abs(this.deltaX))) * this.speedRate || this.speed;
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
    processorMove(data) {
        var pagePointer = this.pagePointer;
        data.leftIndex = pagePointer.leftIndex;
        data.rightIndex = pagePointer.rightIndex;
        this.$emit('onSwipeMove', data)
    }

    /**
     * 滑动事件派发处理
     * 停止动画,视频 音频
     * @return {[type]} [description]
     */
    sliderStop(pointers) {
        this.$emit('onSwipeUpSlider', pointers);
    }

    onTouchStart(e) {

        var interrupt,
            point = compatibilityEvent(e);

        if (!point) {
            return interrupt = this.preventSwipe = true;
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

        this.deltaX = 0;
        this.deltaY = 0;
        this.preventSwipe = false //是否滑动事件受限
        this.isoverstep = false; //是否边界溢出
        this.isScrollX = false; //是否为X轴滑动
        this.isScrollY = false; //是否为Y轴滑动
        this.isTouching = true; //点击了屏幕

        this.start = {
            pageX: point.pageX,
            pageY: point.pageY,
            time: (+new Date())
        };
    }

    onTouchMove(e) {

        //如果没有点击
        //或是Y轴滑动
        //或者是阻止滑动
        if (!this.isTouching || this.isScrollY || this.preventSwipe) return;

        var point = compatibilityEvent(e),
            deltaX = point.pageX - this.start.pageX,
            deltaY = point.pageY - this.start.pageY,
            absDeltaX = Math.abs(deltaX),
            absDeltaY = Math.abs(deltaY);

        if (!this.isScrollY) {
            //===============Y轴滑动======================
            //
            if (absDeltaY > absDeltaX) {
                this.isScrollY = true; //为Y轴滑动
                return;
            }
        }

        //===============X轴滑动======================

        //越界处理
        if (this.isoverstep = this.overstep(deltaX)) return;

        //防止滚动
        e.preventDefault();

        this.deltaX = deltaX / ((!this.hindex && deltaX > 0 // 在首页
                || this.hindex == this.pagetotal - 1 // 尾页
                && deltaX < 0 // 中间
            ) ?
            (absDeltaX / this.screenWidth + 1) : 1);

        if (!this.isScrollX && this.deltaX) {
            this.isScrollX = true;
        }

        //算一次有效的滑动
        if (absDeltaX <= 25) return;

        var delayX = 0;

        if (this.deltaX < 0) {
            delayX = 20;
        } else {
            delayX = (-20);
        }

        !this.fliplock && this.processorMove({
            'pageIndex': this.hindex,
            'distance': this.deltaX + delayX,
            'speed': 0,
            'direction': this.deltaX > 0 ? 'prev' : 'next',
            'action': 'flipMove'
        });

    }

    onTouchEnd(e) {

        this.isTouching = false;

        if (this.isoverstep || this.preventSwipe) return;

        //点击
        if (!this.isScrollX && !this.isScrollY) {
            var isReturn = false;
            this.$emit('onSwipeUp', this.hindex, function() {
                isReturn = true;
            });
            if (isReturn) return;
        }

        //如果是左右滑动
        if (this.isScrollX) {

            var duration = +new Date - this.start.time,
                deltaX = Math.abs(this.deltaX),
                //如果是首尾
                isPastBounds = !this.hindex && this.deltaX > 0 || this.hindex == this.pagetotal - 1 && this.deltaX < 0,
                isValidSlide =
                Number(duration) < 200 && Math.abs(deltaX) > 30 || Math.abs(deltaX) > this.screenWidth / 6;


            //跟随移动
            if (!this.fliplock && isValidSlide && !isPastBounds) {
                if (this.deltaX < 0) { //true:right, false:left
                    this.slideTo('next');
                } else {
                    this.slideTo('prev');
                }
            } else {
                //反弹
                this.processorMove({
                    'pageIndex': this.hindex,
                    'direction': this.deltaX > 0 ? 'prev' : 'next',
                    'distance': 0,
                    'speed': 300,
                    'action': 'flipRebound'
                });
            }
        }

    }

    /**
     * 设置动画完成
     * @param {[type]} element [description]
     */
    setAnimComplete(element) {
        this.distributed(element[0]);
    }

    /**
     * 动画结束后处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onAnimComplete(e) {
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

        this.distributed(target);
    }

    /**
     * 派发事件
     * @return {[type]} [description]
     */
    distributed(element) {

        //针对拖拽翻页阻止
        this.preventSwipe = true;
        this.isTouching = false;

        //快速翻页
        var isQuickTurn = this.isQuickTurn;

        //恢复速率
        this.resetRate();

        element.removeAttribute('data-view', 'false');

        var slef = this;
        setTimeout(function() {
            slef.$emit('onAnimComplete', slef.direction, slef.pagePointer, slef.unlock.bind(slef), isQuickTurn);
        }, 100)
    }


    lock() {
        this.fliplock = true;
    }

    //解锁翻页
    unlock() {
        this.fliplock = false;
    }

    //快速翻页时间计算
    setRate() {
        this.speedRate = 50 / this.screenWidth;
        this.isQuickTurn = true;
    }

    //复位速率
    resetRate() {
        this.speedRate = this.originalRate;
        this.isQuickTurn = false;
    }

    openSwipe() {
        this._bindEvt();
    }

    closeSwipe() {
        this.evtDestroy();
    }




    scrollToPage(targetIndex, preMode, complete) { //目标页面

        //如果还在翻页中
        if (this.fliplock) return

        var data;
        var currIndex = this.hindex; //当前页面

        switch (targetIndex) {
            //前一页
            case (currIndex - 1):
                if (this.multiplePages) {
                    return this.prev();
                }
                break;
                //首页
            case currIndex:
                if (currIndex == 0) {
                    this.$emit('onDropApp');
                }
                return
                //后一页
            case (currIndex + 1):
                if (this.multiplePages) {
                    return this.next();
                }
                break;
        }

        //算出是相关数据
        data = calculationIndex(currIndex, targetIndex, this.pagetotal)

        //更新页码索引
        this.updataPointer(data);

        data.pagePointer = this.pagePointer;

        this.$emit('onJumpPage', data);
    }

    /**
     * 事件处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleEvent(e) {
        Xut.plat.handleEvent({
            start: function(e) {
                this.onTouchStart(e);
            },
            move: function(e) {
                this.onTouchMove(e);
            },
            end: function(e) {
                this.onTouchEnd(e);
            },
            transitionend: function(e) {
                this.onAnimComplete(e);
            }
        }, this, e)
    }

    /**
     * 绑定事件
     * @return {[type]} [description]
     */
    _bindEvt() {
        var self = this;
        //pageFlip启动，没有滑动处理
        if (this.pageFlip) {
            Xut.plat.execEvent('on', {
                context: this.element,
                callback: {
                    start: this,
                    end: this,
                    transitionend: this
                }
            })
        } else if (this.multiplePages) {
            Xut.plat.execEvent('on', {
                context: this.element,
                callback: {
                    start: this,
                    move: this,
                    end: this,
                    transitionend: this
                }
            })
        } else {
            Xut.plat.execEvent('on', {
                context: this.element,
                callback: {
                    start: this,
                    end: this
                }
            })
        }
    }

    /**
     * 销毁事件
     * @return {[type]} [description]
     */
    evtDestroy() {
        var self = this;
        Xut.plat.execEvent('off', {
            context: this.element,
            callback: {
                start: this,
                move: this,
                end: this,
                transitionend: this
            }
        })
    }


    /**
     * 销毁所有
     * @return {[type]} [description]
     */
    destroy() {
        this.evtDestroy();
        this.$off();
        this.bubbleNode.page = null;
        this.bubbleNode.master = null;
        this.element = null;
    }

}

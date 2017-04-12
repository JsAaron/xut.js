import api from './api'
import { Observer } from '../observer/index'
import { config } from '../config/index'
import { initPointer, getActionPointer } from './pointer'
import { $on, $off, $handle, $event, $warn } from '../util/index'

const transitionDuration = Xut.style.transitionDuration
const LINEARTAG = 'data-linearVisual'
const ABS = Math.abs

/*翻页速率*/
const FLIPSPEED = 600

/*
默认翻页时间
1 flipMode为allow时候，为FLIPTIMEMAX
1 flipMode为ban时候，为FLIPTIMEMIN
*/
const FLIPTIMEMIN = 0
const FLIPTIMEMAX = 800

const getDate = () => {
  return +new Date
}

/**
 * 自定义事件类型
 * onSwipeDown 触屏点击
 * onSwipeMove 触屏移动
 * onSwipeUp   触屏松手
 * onSwipeUpSlider触屏松手 滑动处理
 * onFlipSliding 松手动画（反弹）
 * onFlipRebound 执行反弹
 * _onFlipComplete 动画完成
 * onDropApp 退出应用
 */
export default class Swipe extends Observer {

  constructor({
    visualWidth, //可视区的宽度，给flow使用
    initIndex, //初页
    totalIndex, //总数
    container,
    flipMode, //翻页模式

    multiplePages, //多页面
    sectionRang, //分段值

    hasHook = false,
    stopPropagation = false,
    preventDefault = true,
    linear = false, //线性模式
    borderBounce = true, //边界反弹
    extraGap = 0 //间隔,flow处理
  }) {


    super()

    this.options = {
      stopPropagation,
      preventDefault,

      /**
       * 是否存在钩子处理
       * 这个是事件行为的处理给外部hook.js
       */
      hasHook,

      /*
      2种模式，默认是分段处理，如果linear存在，就是线性处理
       */
      linear,

      /**
       * 启动边界反弹
       */
      borderBounce,

      /**
       * flipMode
       * allow 翻页没有直接效果，速度改为0
       * ban  翻页后没有动画回调
       */
      flipMode,

      /**
       * 是否有多页面
       */
      multiplePages,

      /**
       * section分段拼接
       */
      sectionRang
    }

    this.visualIndex = initIndex
    this.totalIndex = totalIndex
    this.container = container
    this.extraGap = extraGap

    /*视图宽度*/
    this._visualWidth = visualWidth || config.visualSize.width

    /*翻页时间*/
    this._flipTime = this.options.flipMode === 'ban' ? FLIPTIMEMIN : FLIPTIMEMAX

    /* 翻页速率*/
    this._speedRate = this._originalRate = this._flipTime / this._visualWidth

    /*是否移动中*/
    this._isMoving = false

    /*计算初始化页码*/
    this.pagePointer = initPointer(initIndex, totalIndex)

    /*标记上一个翻页动作*/
    this.preTick = {
      ation: null,
      time: null
    }

    this._init()
  }

  _init() {
    this._initMode()
    this._initEvents()
    this._initPrevent()
  }

  /*基本模式设置*/
  _initMode() {
    //初始化线性翻页
    //全局只创建一个翻页容器
    if(this.options.linear) {
      this.container.setAttribute(LINEARTAG, true)
      this._setTransform()
      this._setContainerWidth()
    } else {
      //用于查找跟元素
      //ul => page
      //ul => master
      const ul = this.container.querySelectorAll('ul')
      if(!ul.length) {
        $warn(" ul element don't found !")
      } else {
        this._bubbleNode = {
          page: ul[0],
          master: ul[1]
        }
      }
    }
  }

  /*默认行为*/
  _initPrevent() {
    this._stopDefault = this.options.preventDefault ? function(e) {
      e.preventDefault && e.preventDefault()
    } : function() {}
  }

  /**
   * 设置初始的
   */
  _setTransform(newIndex) {
    let visualIndex = newIndex || this.visualIndex
    this._initDistance = -visualIndex * (this._visualWidth + this.extraGap)
    if(this.container) {
      this.container.style[Xut.style.transform] = 'translate3d(' + this._initDistance + 'px,0px,0px)'
    }
  }

  /**
   * 设置容易溢出的宽度
   */
  _setContainerWidth() {
    if(this.container) {
      this.container.style.width = this._visualWidth * this.totalIndex + 'px'
    }
  }

  /**
   * 绑定事件
   */
  _initEvents() {

    const callback = {
      start: this,
      end: this,
      cancel: this,
      leave: this
    }

    //flipMode启动，没有滑动处理
    if(this.options.flipMode === 'ban') {
      //不需要绑定transitionend，会设置手动会触发
    } else if(this.options.multiplePages) {
      callback.move = this
      callback.transitionend = this
    }

    $on(this.container, callback)
  }



  /**
   * 事件处理
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleEvent(e) {

    this.options.stopPropagation && e.stopPropagation()

    //接受多事件的句柄
    $handle({
      start(e) {
        //如果没有配置外部钩子
        if(!this.options.hasHook) {
          this._stopDefault(e)
        }
        this._onStart(e)
      },
      move(e) {
        this._stopDefault(e)
        this._onMove(e)
      },
      end(e) {
        if(!this.options.hasHook) {
          this._stopDefault(e) //超链接有影响
        }
        this._onEnd(e)
      },
      transitionend(e) {
        this._stopDefault(e)
        this._onFlipComplete(e)
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
    if(this._lockFlip || this._hasMultipleTouches(e)) {
      return
    }

    //判断双击速度
    //必须要大于350
    const currtTime = getDate()
    if(this._clickTime) {
      if(currtTime - this._clickTime < 350) {
        return
      }
    }
    this._clickTime = currtTime


    let interrupt
    let event = $event(e)

    /*如果没有事件对象*/
    if(!event) {
      this._stopSwipe = true;
      return
    }

    /**
     * 获取观察对象
     * 钩子函数
     * event 事件对象
     * @return {[type]} [description]
     */
    this.$emit('onFilter', function() {
      interrupt = true;
    }, event, e)

    /*打断动作*/
    if(interrupt) return;

    this._deltaX = 0;
    this._deltaY = 0;

    /*
    针对拖拽翻页阻止
    是否滑动事件受限
     */
    this._stopSwipe = false
    this._isBounce = false //是否反弹
    this._isRollX = false //是否为X轴滑动
    this._isRollY = false //是否为Y轴滑动
    this._isTap = true //点击了屏幕
    this._isInvalid = false //无效的触发

    this._start = {
      pageX: event.pageX,
      pageY: event.pageY,
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
    if(this._lockFlip || !this._isTap || this._isRollY || this._stopSwipe) return

    this._isMoving = true

    let event = $event(e)
    let deltaX = event.pageX - this._start.pageX
    let deltaY = event.pageY - this._start.pageY
    let absDeltaX = ABS(deltaX)
    let absDeltaY = ABS(deltaY)


    //=========Y轴滑动=========
    if(!this._isRollY) {
      //Y>X => 为Y轴滑动
      if(absDeltaY > absDeltaX) {
        this._isRollY = true
        return;
      }
    }


    //=========X轴滑动=========

    //前尾是否允许反弹
    if(!this.options.borderBounce) {
      if(this._isBounce = this._borderBounce(deltaX)) return;
    }

    //滑动方向
    //left => 负
    //rigth => 正
    this._deltaX = deltaX / ((!this.visualIndex && deltaX > 0 || // 在首页
      this.visualIndex == this.totalIndex - 1 && // 尾页
      deltaX < 0 // 中间
    ) ? (absDeltaX / this._visualWidth + 1) : 1)


    if(!this._isRollX && this._deltaX) {
      this._isRollX = true
    }

    this.direction = this._deltaX > 0 ? 'prev' : 'next'

    //减少抖动
    //算一次有效的滑动
    //移动距离必须20px才开始移动
    let xWait = 20
    if(absDeltaX <= xWait) return;

    //需要叠加排除值
    if(this._deltaX > 0) {
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
      pageIndex: this.visualIndex,
      distance: this._deltaX + xWait,
      speed: 0,
      direction: this.direction,
      action: 'flipMove',
      setSwipeInvalid
    })
  }

  /*
  判断是不是首位页面，直接反弹
  如果是首尾
  如果是liner模式排除
  */
  _isBeginEnd() {
    return this.options.linear ? false :
      !this.visualIndex && this._deltaX > 0 || this.visualIndex == this.totalIndex - 1 && this._deltaX < 0
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
    if(this._lockFlip || this._isBounce || this._stopSwipe || this._hasMultipleTouches(e)) {
      return
    }

    this._isTap = this._isMoving = false

    let duration

    //可能没有点击页面，没有触发start事件
    if(this._start) {
      duration = getDate() - this._start.time
    }

    //点击
    if(!this._isRollX && !this._isRollY) {
      let isReturn = false
      this.$emit('onTap', this.visualIndex, () => isReturn = true, e, duration)
      if(isReturn) return
    }


    //如果是左右滑动
    if(this._isRollX) {

      const deltaX = ABS(this._deltaX)

      //_slideTo的最低值要求
      //1 fast: time < 200 && x >30
      //2 common: x > veiwWidth/6
      const isValidSlide = duration < 200 && deltaX > 30 || deltaX > this._visualWidth / 6

      //如果是无效的动作，则不相应
      //还原默认设置
      //move的情况会引起
      //mini功能，合并翻页时事件
      if(this._isInvalid) {
        const hasSwipe = duration < 200 && deltaX > this._visualWidth / 10
        if(hasSwipe) {
          this._distributeMove({
            pageIndex: this.visualIndex,
            direction: this._deltaX > 0 ? 'prev' : 'next',
            action: 'swipe'
          })
        }
        this._setRestore()
        return
      } else {
        //跟随移动
        if(isValidSlide && !this._isBeginEnd()) {
          //true:right, false:left
          this._slideTo(this._deltaX < 0 ? 'next' : 'prev', 'inner')
        } else {
          //反弹
          this._setRebound(this.visualIndex, this._deltaX > 0 ? 'prev' : 'next')
        }
      }
    }


    /*如果是Y轴移动，发送请求*/
    if(this._isRollY) {
      config.sendTrackCode('swipe', {
        'direction': 'vertical',
        'pageId': this.visualIndex + 1
      })
    }

  }

  /**
   * 前尾边界反弹判断
   * @param  {[type]} deltaX [description]
   * @return {[type]}        [description]
   */
  _borderBounce(deltaX) {
    //首页,并且是左滑动
    if(this.visualIndex === 0 && deltaX > 0) {
      return true;
      //尾页
    } else if(this.visualIndex === this.totalIndex - 1 && deltaX < 0) {
      return true;
    }
  }

  /**
   * 设置反弹
   * isBoundary ##317
   * 边界后反弹，最后一页刚好有是视觉差，反弹不归位
   * 这里要强制处理
   */
  _setRebound(pageIndex, direction, isAppBoundary) {
    this._distributeMove({
      isAppBoundary, //是边界后，反弹回来的
      'pageIndex': pageIndex,
      'direction': direction,
      'distance': 0,
      'speed': 300,
      'action': 'flipRebound'
    })
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

    switch(direction) {
      case 'prev': //前翻页
        overflow = (pointer.currIndex === 0 && fillength === 2) ? true : false;
        break;
      case 'next': //后翻页
        overflow = (pointer.currIndex === (this.totalIndex - 1) && fillength === 2) ? true : false;
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
    this._speedRate = 50 / this._visualWidth;
    this._isQuickTurn = true;
  }

  /**
   * 判断是否快速翻页
   * @return {[type]} [description]
   */
  _isQuickFlip() {
    const startDate = getDate()
    if(this._preTapTime) {
      if(startDate - this._preTapTime < FLIPSPEED) {
        this._setRate();
      }
    }
    this._preTapTime = getDate();
  }

  /**
   * 修正页面索引
   * 设置新的页面可视区索引
   */
  _setVisualIndex(index) {
    this.visualIndex = index
  }


  /**
   * 更新页码标示
   */
  _updataPointer(leftIndex, currIndex, rightIndex) {
    if(arguments.length === 3) {
      this.pagePointer = {
        'leftIndex': leftIndex,
        'currIndex': currIndex,
        'rightIndex': rightIndex
      }
      return;
    }
    if(arguments.length === 1) {
      let data = leftIndex;
      let viewFlip = data.viewFlip
      this._setVisualIndex(data.targetIndex)
      if(viewFlip.length === 3) {
        this._updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
      }
      if(viewFlip.length === 2) {
        if(viewFlip[0] === 0) { //首页
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
  _updateActionPointer() {
    const pointer = this.pagePointer

    //获取动作索引
    const actionPointer = getActionPointer(this.direction, pointer.leftIndex, pointer.rightIndex)
    const createPointer = actionPointer.createPointer
    const stopPointer = pointer.currIndex

    switch(this.direction) {
      case 'prev':
        if(-1 < createPointer) { //首页情况
          this._updataPointer(createPointer, pointer.leftIndex, pointer.currIndex);
        }
        if(-1 === createPointer) {
          this.pagePointer.rightIndex = pointer.currIndex;
          this.pagePointer.currIndex = pointer.leftIndex;
          delete this.pagePointer.leftIndex;
        }
        break;
      case 'next':
        if(this.totalIndex > createPointer) {
          this._updataPointer(pointer.currIndex, pointer.rightIndex, createPointer);
        }
        if(this.totalIndex === createPointer) { //如果是尾页
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
   * 获取翻页结束的speed的速率
   * @return {[type]} [description]
   */
  _getFlipOverSpeed(visualWidth) {
    visualWidth = visualWidth || this._visualWidth
    const spped = (visualWidth - (ABS(this._deltaX))) * this._speedRate || this._flipTime;
    return ABS(spped)
  }


  /**
   * 滑动到上下页面
   * 需要区分是否快速翻页
   * 这里有内部翻页跟外部接口调用的处理
   * 内部翻页存在了speed算法
   * 外部翻页需要通过点击的时间差计算
   * direction
   *   "perv" / "next"
   * action
   *   1. inner 用户直接翻页滑动触发，提供hasTouch
   *   2. outer 通过接口调用翻页
   */
  _slideTo(direction, action) {

    /*是外部调用触发接口,提供给翻页滑动使用*/
    let outerCallFlip = false

    /*
    如果行为一致,并且是外部接口调用，
    需要手动计算出滑动的speed
    inner 用户内部滑动
    outer 外部接口调用
    */
    let outerSpeed

    /*外部调用*/
    if(action === 'outer') {
      /*如果是第二次开始同一个点击动作*/
      if(action === this.preTick.action) {
        /*最大的点击间隔时间不超过默认的_flipTime时间，最小的取间隔时间*/
        const time = getDate() - this.preTick.time
        if(time <= this._flipTime) {
          outerSpeed = time
        } else {
          outerSpeed = this._flipTime
        }
        outerCallFlip = true
      }
      /*点击时间啊*/
      this.preTick.time = getDate()
    }

    /*保存每次点击动作*/
    this.preTick.action = action

    //如果在忙碌状态,如果翻页还没完毕
    if(this._lockFlip) {
      return
    }

    //前后边界
    if(!this.options.linear) {
      if(this._isBorder(direction)) return;
    }


    this._addFlipLock()
    this._isQuickFlip()
    this.direction = direction

    this._distributeMove({
      outerCallFlip,
      'speed': outerSpeed || this._getFlipOverSpeed(),
      'pageIndex': this.visualIndex,
      'distance': 0,
      'direction': this.direction,
      'action': 'flipOver'
    })

    if(this.pagePointer.createPointer) {
      this.recordLastPoionter = $.extend(true, {}, this.pagePointer)
    }

    setTimeout(() => {
      //更新this.pagePointer索引
      //增加处理标记
      this._updateActionPointer()
      this.$emit('onUpSlider', this.pagePointer)
      this._setVisualIndex(this.pagePointer.currIndex)
    })
  }

  /*去掉动画时间*/
  _removeDuration(node) {
    if(node) {
      node.style[transitionDuration] = ''
    }
  }

  /**
   * 翻页结束
   */
  _onFlipComplete(e) {
    const node = e.target;
    /*page与master*/
    const pageType = node.getAttribute('data-type');
    /*可能存在多组动画回调，只找到标记data-visual的页面，可视窗口*/
    const isVisual = node.getAttribute('data-visual');
    /*线性的布局方式，cloumn使用*/
    const isLinearVisual = node.getAttribute(LINEARTAG)

    this._removeDuration(node)

    //cloumn流式布局处理
    if(isLinearVisual && !isVisual) {
      this._distributeComplete(node, isVisual)
      return
    }

    //反弹效果,未翻页
    //页面与母版都不触发回调
    if(!isVisual) {
      //只针对母板处理
      if(!pageType) {
        this.$emit('onMasterMove', this.visualIndex, node);
      }
      return
    }

    this._distributeComplete(node, isVisual)
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


  /*
  翻页结束后，派发动作完成事件
   */
  _distributeComplete(...arg) {
    this._setRestore(...arg)
      //延长获取更pagePointer的更新值
    setTimeout(() => {
      this.$emit('onComplete', this.direction, this.pagePointer, this._removeFlipLock.bind(this), this._isQuickTurn)
    }, 50)
  }


  /**
   * 还原设置
   */
  _setRestore(node, isVisual) {
    this._isMoving = false
      //针对拖拽翻页阻止
    this._stopSwipe = true
    this._isTap = false;
    //恢复速率
    this._resetRate();
    if(isVisual && node) {
      node.removeAttribute('data-visual');
    }
  }


  /**
   * 翻页加锁
   * @return {[type]} [description]
   */
  _addFlipLock() {
    this._lockFlip = true;
  }

  /**
   * 解锁翻页
   * @return {[type]} [description]
   */
  _removeFlipLock() {
    this._lockFlip = false
  }


  /**
   * 销毁事件
   * @return {[type]} [description]
   */
  _off() {
    $off(this.container)
  }


}


api(Swipe)

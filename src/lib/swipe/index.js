import api from './api'
import slide from './slide'
import distribute from './distribute'
import { Observer } from '../observer/index'
import { config } from '../config/index'
import { initPointer } from './pointer'
import { $on, $off, $handle, $event, $warn } from '../util/index'

const transitionDuration = Xut.style.transitionDuration
const LINEARTAG = 'data-linearVisual'
const ABS = Math.abs


/**
 * 是否多点触发
 * @return {Boolean} [description]
 */
const hasMultipleTouches = function (e) {
  return e.touches && e.touches.length > 1
}

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

    /*
    1.支持分段处理，就是动态翻页
    2.还支持一种线性的翻页
    3.支持滑动
     */
    snap = true,

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
       * pageflip
       *   横版翻页 horizontal
       *   横版锁定 horizontal-ban
       *
       *   竖版翻页 vertical
       *   竖版锁定 vertical-ban
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

    /**
     * 滑动的方向
     * 横版：prev next (left/right)
     * 竖版：prev next (up/down)
     */
    this.direction = ''

    this.visualIndex = initIndex
    this.totalIndex = totalIndex
    this.container = container
    this.extraGap = extraGap

    /*默认允许滑动*/
    this.enabled = true

    /*视图尺寸*/
    this._visualWidth = visualWidth || config.visualSize.width
    this._visualHeight = config.visualSize.height

    /*翻页时间*/
    this._flipTime = this.options.flipMode === 'horizontal-ban' ? FLIPTIMEMIN : FLIPTIMEMAX

    /* 翻页速率*/
    this._speedRate = this._originalRate = this._flipTime / this._visualWidth

    /*计算初始化页码*/
    this.pagePointer = initPointer(initIndex, totalIndex)

    /*标记上一个翻页动作*/
    this.preTick = { ation: null, time: null }

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
    if (this.options.linear) {
      this.container.setAttribute(LINEARTAG, true)
      this._setTransform()
      this._setContainerWidth()
    } else {
      //用于查找跟元素
      //ul => page
      //ul => master
      const ul = this.container.querySelectorAll('ul')
      if (!ul.length) {
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
    this._stopDefault = this.options.preventDefault ? function (e) {
      e.preventDefault && e.preventDefault()
    } : function () {}
  }

  /**
   * 设置初始的
   */
  _setTransform(newIndex) {
    let visualIndex = newIndex || this.visualIndex
    this._initDistance = -visualIndex * (this._visualWidth + this.extraGap)
    if (this.container) {
      this.container.style[Xut.style.transform] = 'translate3d(' + this._initDistance + 'px,0px,0px)'
    }
  }

  /**
   * 设置容易溢出的宽度
   */
  _setContainerWidth() {
    if (this.container) {
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
    if (this.options.flipMode === 'horizontal-ban') {
      //不需要绑定transitionend，会设置手动会触发
    } else if (this.options.multiplePages) {
      callback.move = this
      callback.transitionend = this
    }
    $on(this.container, callback)
  }

  /**
   * 事件处理
   */
  handleEvent(e) {
    this.options.stopPropagation && e.stopPropagation()
      //接受多事件的句柄
    $handle({
      start(e) {
        //如果没有配置外部钩子
        if (!this.options.hasHook) {
          this._stopDefault(e)
        }
        this._onStart(e)
      },
      move(e) {
        this._stopDefault(e)
        this._onMove(e)
      },
      end(e) {
        if (!this.options.hasHook) {
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
   * 触发页面
   */
  _onStart(e) {

    //如果停止滑动
    //或者多点触发
    if (!this.enabled || hasMultipleTouches(e)) {
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
    let event = $event(e)

    /*如果没有事件对象*/
    if (!event) {
      this._stopped = true;
      return
    }

    /**
     * 获取观察对象
     * 钩子函数
     * event 事件对象
     * @return {[type]} [description]
     */
    this.$emit('onFilter', function () {
      interrupt = true;
    }, event, e)

    /*打断动作*/
    if (interrupt) return;

    this._distX = 0;
    this._distY = 0;

    /*
    针对拖拽翻页阻止
    是否滑动事件受限
     */
    this._stopped = false //如果页面停止了动作，触发
    this._isBounce = false //是否反弹
    this._isRollX = false //是否为X轴滑动
    this._isRollY = false //是否为Y轴滑动
    this._hasTap = true //点击了屏幕
    this._isInvalid = false //无效的触发
    this._moved = false /*是否移动中*/

    this._start = {
      pageX: event.pageX,
      pageY: event.pageY,
      time: getDate()
    }
  }

  /**
   * 获取移动距离
   * @return {[type]} [description]
   */
  _getDist(value, absDelta) {
    return value / ((!this.visualIndex && value > 0 || // 在首页
      this.visualIndex == this.totalIndex - 1 && // 尾页
      value < 0 // 中间
    ) ? (absDelta / this._visualWidth + 1) : 1)
  }

  /**
   * 移动
   */
  _onMove(e) {

    //如果停止翻页
    //或者没有点击
    //或是Y轴滑动
    //或者是阻止滑动
    if (!this.enabled || !this._hasTap || this._stopped) return

    this._moved = true

    const event = $event(e)
    const deltaX = event.pageX - this._start.pageX
    const deltaY = event.pageY - this._start.pageY
    const absDeltaX = ABS(deltaX)
    const absDeltaY = ABS(deltaY)

    let $delta, $absDelta, $dist

    /*判断锁定横竖版滑动*/
    if (absDeltaX > absDeltaY) {
      this.orientation = 'h'; // lock horizontally
      $delta = deltaX
      $absDelta = absDeltaX
    } else if (absDeltaY >= absDeltaX) {
      this.orientation = 'v'; // lock vertically
      $delta = deltaY
      $absDelta = absDeltaY
    }

    /*判断用户行为*/
    if (this.options.flipMode === 'vertical') {
      /*竖版模式下横版滑动抛弃*/
      if (this.orientation === 'h') {
        return
      }

      /*等填充*/
    } else {
      /**
       * 提供给sendTrackCode使用
       * 如果继续保持了Y轴移动，记录下最大偏移量算不算上下翻页动作
       */
      if (this._isRollY) {
        /*猜测用户的意图，滑动轨迹小于80,想翻页*/
        if (absDeltaX > 80) {
          this._isRollY = 'swipe'
        } else {
          this._isRollY = 'wantFlip'
        }
        return
      }

      /*检测用户是否上下滑动了*/
      if (!this._isRollY) {
        //Y>X => 为Y轴滑动
        if (absDeltaY > absDeltaX) {
          //默认用户只想滑动
          this._isRollY = 'swipe'
          return;
        }
      }
    }

    /*前尾是否允许反弹*/
    if (!this.options.borderBounce) {
      if (this._isBounce = this._borderBounce($delta)) return;
    }

    /*滑动距离*/
    if (this.orientation === 'h') {
      $dist = this._distX = this._getDist(deltaX, absDeltaX)
      if (!this._isRollX && this._distX) {
        this._isRollX = true
      }
    } else if (this.orientation === 'v') {
      $dist = this._distY = this._getDist(deltaY, absDeltaY)
      if (!this._isRollY && this._distY) {
        this._isRollY = true
      }
    }

    /*设置方向*/
    this._setDirection($dist)

    /*
     * 减少抖动
     * 算一次有效的滑动
     * 移动距离必须20px才开始移动
     */
    let deltaDist = 20
    if ($absDelta <= deltaDist) return;
    if ($dist > 0) {
      deltaDist = (-deltaDist)
    }

    //是否无效函数
    //如果无效，end方法抛弃掉
    //必须是同步方法：
    //动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
    const setSwipeInvalid = () => {
      this._isInvalid = true
    }

    this._distributeMove({
      distance: $dist + deltaDist,
      speed: 0,
      direction: this.direction,
      action: 'flipMove',
      setSwipeInvalid
    })
  }


  /**
   * 翻页松手
   */
  _onEnd(e) {

    /*停止滑动，或者多点触发，或者是边界，或者是停止翻页*/
    if (!this.enabled || this._isBounce || this._stopped || hasMultipleTouches(e)) {
      return
    }

    this._hasTap = this._moved = false

    let duration

    /*可能没有点击页面，没有触发start事件*/
    if (this._start) {
      duration = getDate() - this._start.time
    }

    /*如果没有滚动页面，判断为点击*/
    if (!this._isRollX && !this._isRollY) {
      let isReturn = false
      this.$emit('onTap', this.visualIndex, () => isReturn = true, e, duration)
      if (isReturn) return
    }

    //==============================
    //          竖版模式
    //==============================
    if (this.options.flipMode === 'vertical' && this._isRollY) {

      const deltaY = ABS(this._distY)

      //_slideTo的最低值要求
      //1 fast: time < 200 && x >30
      //2 common: x > veiwWidth/6
      const isValidSlide = duration < 200 && deltaY > 30 || deltaY > this._visualHeight / 6

      //如果是无效的动作，则不相应
      //还原默认设置
      //move的情况会引起
      //mini功能，合并翻页时事件
      if (this._isInvalid) {
        const hasSwipe = duration < 200 && deltaY > this._visualHeight / 10
        if (hasSwipe) {
          this._distributeMove({ action: 'swipe' })
        }
        this._setRestore()
        return
      } else {
        //跟随移动
        if (isValidSlide && !this._isFirstEnd()) {
          this._slideTo(this.direction, 'inner')
        } else {
          //反弹
          this._setRebound()
        }
      }

      return
    }


    //==============================
    //          横版模式
    //==============================

    if (this._isRollX) {

      const deltaX = ABS(this._distX)

      //_slideTo的最低值要求
      //1 fast: time < 200 && x >30
      //2 common: x > veiwWidth/6
      const isValidSlide = duration < 200 && deltaX > 30 || deltaX > this._visualWidth / 6

      this.direction = this._distX > 0 ? 'prev' : 'next'

      //如果是无效的动作，则不相应
      //还原默认设置
      //move的情况会引起
      //mini功能，合并翻页时事件
      if (this._isInvalid) {
        const hasSwipe = duration < 200 && deltaX > this._visualWidth / 10
        if (hasSwipe) {
          this._distributeMove({
            direction: this.direction,
            action: 'swipe'
          })
        }
        this._setRestore()
        return
      } else {
        //跟随移动
        if (isValidSlide && !this._isFirstEnd()) {
          this._slideTo(this.direction, 'inner')
        } else {
          //反弹
          this._setRebound()
        }
      }
    }

    /*如果是Y轴移动，发送请求,并且不是mouseleave事件，在PC上mouseleave离开非可视区重复触发*/
    if (this._isRollY === 'wantFlip' && event.type !== 'mouseleave') {
      this._isRollY = false //需要复位，否则与iscroll上下滑动重复触发
      config.sendTrackCode('swipe', {
        'direction': 'vertical',
        'pageId': this.visualIndex + 1
      })
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
    if (isLinearVisual && !isVisual) {
      this._distributeComplete(node, isVisual)
      return
    }

    //反弹效果,未翻页
    //页面与母版都不触发回调
    if (!isVisual) {
      //只针对母板处理
      if (!pageType) {
        this.$emit('onMasterMove', this.visualIndex, node);
      }
      return
    }

    this._distributeComplete(node, isVisual)
  }


  /*
  判断是不是首位页面，直接反弹
  如果是首尾
  如果是liner模式排除
  */
  _isFirstEnd() {
    return this.options.linear ? false :
      !this.visualIndex && this._distX > 0 || this.visualIndex == this.totalIndex - 1 && this._distX < 0
  }


  /**
   * 前尾边界反弹判断
   */
  _borderBounce(value) {
    //首页,并且是左滑动
    if (this.visualIndex === 0 && value > 0) {
      return true;
      //尾页
    } else if (this.visualIndex === this.totalIndex - 1 && value < 0) {
      return true;
    }
  }

  /**
   * 设置反弹
   * isBoundary ##317
   * 边界后反弹，最后一页刚好有是视觉差，反弹不归位
   * 这里要强制处理
   * 外部接口可以设置参数
   */
  _setRebound(direction, isAppBoundary) {
    this._distributeMove({
      direction: direction || this.direction, //方向
      isAppBoundary, //是边界后，反弹回来的
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
    switch (direction) {
      case 'prev': //前翻页
        overflow = (pointer.middleIndex === 0 && fillength === 2) ? true : false;
        break;
      case 'next': //后翻页
        overflow = (pointer.middleIndex === (this.totalIndex - 1) && fillength === 2) ? true : false;
        break;
    }
    return overflow
  }


  /*去掉动画时间*/
  _removeDuration(node) {
    if (node) {
      node.style[transitionDuration] = ''
    }
  }


  /**
   * 复位速率
   */
  _resetRate() {
    this._speedRate = this._originalRate;
    this._isQuickTurn = false;
  }

  /**
   * 还原设置
   * 1 针对拖拽翻页阻止
   * 2 恢复速率
   * 3 去掉页面指示
   */
  _setRestore(node, isVisual) {
    this._stopped = true
    this._hasTap = false
    this._resetRate()
    if (isVisual && node) {
      node.removeAttribute('data-visual');
    }
  }

  /**
   * 操作方向
   */
  _setDirection(value) {
    this.direction = value > 0 ? 'prev' : 'next'
  }

  /*关闭滑动*/
  disable() {
    this.enabled = false;
  }

  /*启动滑动*/
  enable() {
    this.enabled = true;
  }

  /**
   * 修正页面索引
   * 设置新的页面可视区索引
   */
  _updateVisualIndex(index) {
    this.visualIndex = index
  }

  /**
   * 更新页码标示
   * 1. 1个数组参数
   * 2. 2个参数
   * 3. 3个参数
   */
  _updatePointer(frontIndex, middleIndex, backIndex) {
    if (arguments.length === 3) {
      this.pagePointer = { frontIndex, middleIndex, backIndex }
      return;
    }
    if (arguments.length === 1) {
      const data = frontIndex;
      const viewFlip = data.viewFlip
      this._updateVisualIndex(data.targetIndex)
      if (viewFlip.length === 3) {
        this._updatePointer(viewFlip[0], viewFlip[1], viewFlip[2]);
      }
      if (viewFlip.length === 2) {
        if (viewFlip[0] === 0) { //首页
          this.pagePointer.backIndex = viewFlip[1];
          this.pagePointer.middleIndex = viewFlip[0];
          delete this.pagePointer.frontIndex;
        } else { //尾页
          this.pagePointer.frontIndex = viewFlip[0];
          this.pagePointer.middleIndex = viewFlip[1];
          delete this.pagePointer.backIndex
        }
      }
      return
    }
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
slide(Swipe)
distribute(Swipe)

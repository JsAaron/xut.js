import api from './api'
import init from './init'
import slide from './slide'
import distribute from './distribute'
import { Observer } from '../observer/index'
import { config } from '../config/index'
import { initPointer } from './pointer'
import { $off, $handle, $event } from '../util/index'

import { LINEARTAG } from './type'

const transitionDuration = Xut.style.transitionDuration

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
 * _onComplete 动画完成
 * onDropApp 退出应用
 */
export default class Swipe extends Observer {

  constructor({
    visualWidth, //可视区的宽度，给flow使用
    visualHeight, //可视区的高度，给flow使用

    initIndex, //初页
    totalIndex, //总数
    container,
    flipMode = 'horizontal', //翻页模式

    /*
    1.支持分段处理，就是动态翻页
    2.还支持一种线性的翻页
    3.支持滑动
     */
    snap = true,

    /*鼠标滚轮*/
    mouseWheel = false,

    /*卷滚条*/
    scrollbar = false,

    multiplePages, //多页面
    sectionRang, //分段值

    hasHook = false,
    stopPropagation = false,
    preventDefault = true,
    borderBounce = true, //边界反弹
    extraGap = 0 //间隔,flow处理
  }) {

    super()

    /**
     *翻页模式参数解析
     * flipMode horizontal-ban
     * 分解为 horizontal + ban
     */
    let modeMatch = flipMode.split('-');
    let flipBan = false
    if (modeMatch.length === 2) {
      flipMode = modeMatch[0]
      flipBan = true
    }

    /*竖版模式下默认启动鼠标滚轮*/
    if (flipMode === 'vertical') {
      // mouseWheel = true
    }

    this.options = {
      snap,
      mouseWheel,
      stopPropagation,
      preventDefault,

      /**
       * 是否存在钩子处理
       * 这个是事件行为的处理给外部hook.js
       */
      hasHook,

      /**
       * 启动边界反弹
       */
      borderBounce,

      /**
       * 翻页模式
       *   横版翻页 horizontal
       *   竖版翻页 vertical
       * 翻页禁止  true/false
       */
      flipBan,
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
    this._visualHeight = visualHeight || config.visualSize.height

    /*翻页时间*/
    this._flipTime = flipBan ? FLIPTIMEMIN : FLIPTIMEMAX

    /*翻页速率*/
    this._speedRate = this._originalRate =
      this._flipTime / (flipMode === 'horizontal' ? this._visualWidth : this._visualHeight)

    /*计算初始化页码*/
    this.pagePointer = initPointer(initIndex, totalIndex)

    /*标记上一个翻页动作*/
    this._recordRreTick = { ation: null, time: null }

    this._init()
  }


  /**
   * 事件处理
   */
  handleEvent(e) {
    this.options.stopPropagation && e.stopPropagation()
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
        this._onComplete(e)
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
    this._hasBounce = false //是否有反弹
    this._hasTap = true //点击了屏幕
    this._isInvalid = false //无效的触发
    this._moved = false /*是否移动中*/
    this._behavior = 'swipe' //用户行为

    /*锁定滑动相反方向*/
    this._directionBan = false

    this._start = {
      pageX: event.pageX,
      pageY: event.pageY,
      time: getDate()
    }
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

    /**
     * 1.相反方向禁止滑动
     * 2.提供给sendTrackCode使用
     *     猜测用户的意图，滑动轨迹小于80,想翻页
     *     猜测用户相反的方向意向
     *     比如横屏的时候，用户想竖屏上下滑动翻页
     *     竖屏的时候，用户想横屏左右翻页
     *     如果继续保持了Y轴移动，记录下最大偏移量算不算上下翻页动作
     */
    if (this.options.flipMode === 'horizontal' && this.orientation === 'v') {
      //左右翻页，猜测上下翻页
      if ($absDelta > 80) {
        this._behavior = 'reverse'
      }
      this._directionBan = 'v'
    } else if (this.options.flipMode === 'vertical' && this.orientation === 'h') {
      //上下翻页，猜测左右翻页
      if ($absDelta > 80) {
        this._behavior = 'reverse'
      }
      this._directionBan = 'h'
    }

    /*前尾是否允许反弹*/
    if (!this.options.borderBounce) {
      if (this._hasBounce = this._borderBounce($delta)) return;
    }

    /*滑动距离*/
    if (this.orientation === 'h') {
      $dist = this._distX = this._getDist(deltaX, absDeltaX)
    } else if (this.orientation === 'v') {
      $dist = this._distY = this._getDist(deltaY, absDeltaY)
    }

    /*设置方向*/
    this._setDirection($dist)

    /*锁定*/
    if (this._directionBan) return;

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
      action: 'flipMove',
      setSwipeInvalid
    })
  }


  /**
   * 翻页松手
   */
  _onEnd(e) {

    /*停止滑动，或者多点触发，或者是边界，或者是停止翻页*/
    if (!this.enabled || this._hasBounce || this._stopped || hasMultipleTouches(e)) {
      return
    }

    this._hasTap = this._moved = false

    let duration

    /*可能没有点击页面，没有触发start事件*/
    if (this._start) {
      duration = getDate() - this._start.time
    }

    /*滑动距离、滑动方向*/
    const distX = ABS(this._distX)
    const distY = ABS(this._distY)
    const orientation = this.orientation

    /*如果没有滚动页面，判断为点击*/
    if (!distX && !distY) {
      let isReturn = false
      this.$emit('onTap', this.visualIndex, () => isReturn = true, e, duration)
      if (isReturn) return
    }

    /*如果是Y轴移动，发送请求,并且不是mouseleave事件，在PC上mouseleave离开非可视区重复触发*/
    if (this._behavior === 'reverse' && event.type !== 'mouseleave') {
      config.sendTrackCode('swipe', {
        'direction': this.orientation,
        'pageId': this.visualIndex + 1
      })
    }

    /**
     * 锁定滑动
     * 1 横版模式下，如果有Y滑动，但是如果没有X的的变量，就判断无效
     * 1 竖版模式下，如果有X滑动，但是如果没有Y的的变量，就判断无效
     */
    if (this._directionBan === 'v' && !this._distX) {
      return
    } else if (this._directionBan === 'h' && !this._distY) {
      return
    }

    /**
     * mini功能，合并翻页时事件
     * move的情况会引起
     * 如果是无效的动作，则不相应
     * 还原默认设置
     */
    if (this._isInvalid) {
      let hasSwipe
      if (orientation === 'h') {
        hasSwipe = duration < 200 && distX > this._visualWidth / 10
      } else if (orientation === 'v') {
        hasSwipe = duration < 200 && distY > this._visualHeight / 10
      }
      if (hasSwipe) {
        this._distributeMove({ action: 'swipe' })
      }
      this._setRestore()
      return
    }

    /**
     * slideTo的最低值要求
     * 1 fast: time < 200 && x >30
     * 2 common: x > veiwWidth/6
     */
    let isValidSlide
    if (orientation === 'h') {
      isValidSlide = duration < 200 && distX > 30 || distX > this._visualWidth / 6
    } else if (orientation === 'v') {
      isValidSlide = duration < 200 && distY > 30 || distY > this._visualHeight / 6
    }

    /**
     * 开始翻页或者反弹
     * 翻页滑动，要排除首位的情况，首尾页面只要反弹
     */
    if (isValidSlide && !this._isFirstOrEnd()) {
      this._slideTo({ action: 'inner' })
    } else {
      this._setRebound()
    }

  }

  /**
   * 鼠标滚动
   * @return {[type]} [description]
   */
  _onWheel(e) {
    if (!this.enabled || this._wheeled) return

    this._wheeled = true

    e.preventDefault();
    e.stopPropagation();

    let wheelDeltaX, wheelDeltaY

    if ('deltaX' in e) {
      wheelDeltaX = -e.deltaX;
      wheelDeltaY = -e.deltaY;
    } else if ('wheelDeltaX' in e) {
      wheelDeltaX = e.wheelDeltaX
      wheelDeltaY = e.wheelDeltaY
    } else if ('wheelDelta' in e) {
      wheelDeltaX = wheelDeltaY = e.wheelDelta
    } else if ('detail' in e) {
      wheelDeltaX = wheelDeltaY = -e.detail
    } else {
      return;
    }

    if (this.options.snap) {
      /*鼠标wheel会有一个惯性的响应，所以会造成多次翻页
      这里采用一个最大延时处理*/
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(() => {
        this._wheeled = false
      }, 1200)

      /*强制修复滑动的方向是上下
      因为在页面中左右滑动一下，这个值被修改
      后续就会报错*/
      this.orientation = 'v'

      /*向上滚动*/
      if (wheelDeltaY > 0) {
        this.prev()
      } else {
        /*向下滚动*/
        this.next()
      }
      return
    }

    this._wheeled = false

  }

  /**
   * 翻页结束
   */
  _onComplete(e) {
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


  /**
   * 获取移动距离
   */
  _getDist(value, absDist) {
    return value / ((!this.visualIndex && value > 0 || // 在首页
      this.visualIndex == this.totalIndex - 1 && // 尾页
      value < 0 // 中间
    ) ? (absDist / this._visualWidth + 1) : 1)
  }

  /*
  判断是不是首位页面，直接反弹
  如果是首尾
  如果是liner模式排除
  */
  _isFirstOrEnd() {
    if (this.options.snap) {
      if (this.orientation === 'h') {
        return !this.visualIndex && this._distX > 0 || this.visualIndex == this.totalIndex - 1 && this._distX < 0
      }
      if (this.orientation === 'v') {
        return !this.visualIndex && this._distY > 0 || this.visualIndex == this.totalIndex - 1 && this._distY < 0
      }
    } else {
      return false
    }
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


  /*去掉动画时间*/
  _removeDuration(node) {
    if (node) {
      node.style[transitionDuration] = ''
    }
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
init(Swipe)
slide(Swipe)
distribute(Swipe)

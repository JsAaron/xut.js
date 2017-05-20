import api from './api'
import init from './init'
import slide from './slide'
import distribute from './distribute'
import { Observer } from '../observer/index'
import { config } from '../config/index'
import { initPointer } from './pointer'
import { momentum } from './momentum'
import { ease } from './ease'
import { $off, $handle, $event } from '../util/index'

import { LINEARTAG } from './type'

const transitionDuration = Xut.style.transitionDuration

const ABS = Math.abs

/**
 * 是否多点触发
 * @return {Boolean} [description]
 */
const hasMultipleTouches = function(e) {
  return e.touches && e.touches.length > 1
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
export default class Swiper extends Observer {

  static mixProperty(target, src) {
    for (let key in src) {
      target[key] = src[key]
    }
  }


  static getDate() {
    return +new Date
  }

  /**
   * 静态方法，获取基本配置
   * @return {[type]} [description]
   */
  static getConfig() {
    /*提供swiperConfig快速配置文件,关键配置*/
    let scrollX = true
    let scrollY = false
    if (config.launch.displayMode === 'v') {
      scrollX = false
      scrollY = true
    }
    return {
      scrollY,
      scrollX,
      banMove: config.launch.banMove
    }
  }

  constructor({

    /**
     *
    A：translate运动的作用域
      1. "child" 作用在每个page独立的页面上swiper本身不处理
      2. "parent" 作用在swiper内部，这个是可以做线性的处理

    B：snap 是否分段独立页面
      1. true  默认分段
      2. false 不分段，变成整体一段数据

    C：banMove 是否锁定页面滑动，只能通过接口翻页，没有滑动效果
      1. false 不锁定，可以移动页面
      2. true 锁定，不能移动页面

    D：scope,snap,banMove 组合四中模式使用
      1. 页面分段，独立页面滑动(横版/竖版，默认处理)
          scope='child'
          snap = true
          banMove = false

      2. 页面分段，独立页面滑动，但是禁止触摸滑动，只能通过接口跳转页面(秒秒学模式)
          scope='child'
          snap = true
          banMove = true

      3. 页面分段，swiper内部滑动(横版,column)
          scope='parent'
          snap = true
          banMove = false

      4. 不分段，无分页，swiper内部滑动(竖版)
          scope='parent'
          snap = false
          banMove = false

    */
    scope = 'child',
    snap = true,
    snapSpeed = 800,
    banMove = false,

    /*滑动惯性*/
    momentum = true,

    /**
     * 运动的方向
     * 默认X轴运动
     */
    scrollX = true,
    scrollY = false,

    /*鼠标滚轮*/
    mouseWheel = false,

    /*卷滚条*/
    scrollbar = false,

    /**
     * 是否存在钩子处理
     * 这个是事件行为的处理给外部hook.js
     */
    hasHook = false,

    /**
     * 启动边界反弹
     * true 默认启动
     * false 关闭
     */
    borderBounce = true,

    stopPropagation = false,
    preventDefault = true,

    /**
     * 基本数据设定
     */
    /*容器节点*/
    container,
    /*开始索引*/
    visualIndex,
    /*总索引*/
    totalIndex,
    /*容器宽度*/
    visualWidth,
    /*容器高度*/
    visualHeight,
    /*是否有多页面*/
    hasMultiPage,
    /*section分段拼接*/
    sectionRang
  }) {

    super()

    Swiper.mixProperty(this, {
      container,
      visualIndex,
      totalIndex,
      visualWidth,
      visualHeight
    })

    this.options = {
      scope,
      snap,
      banMove,
      scrollX,
      scrollY,
      momentum,
      mouseWheel,
      scrollbar,
      hasHook,
      borderBounce,
      stopPropagation,
      preventDefault,
      hasMultiPage,
      sectionRang
    }

    /*一些默认参数设置*/
    this.x = 0;
    this.y = 0;

    /**
     * 滑动的方向
     * 横版：prev next (left/right)
     * 竖版：prev next (up/down)
     */
    this.direction = ''

    /*默认允许滑动*/
    this.enabled = true

    /*翻页时间*/
    this._defaultFlipTime = banMove ? 0 : snapSpeed

    /*翻页速率*/
    this._speedRate =
      this._originalRate =
      this._defaultFlipTime / (scrollX ? visualWidth : visualHeight)

    /*计算初始化页码*/
    this.pagePointer = initPointer(visualIndex, totalIndex)

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
    const currtTime = Swiper.getDate()
    if (this._clickTime) {
      if (currtTime - this._clickTime < 350) {
        return
      }
    }
    this._clickTime = currtTime


    let interrupt
    let point = $event(e)

    /*如果没有事件对象*/
    if (!point) {
      this._stopped = true;
      return
    }

    /*如果有惯性运动，停止*/
    if (this.isInTransition) {
      this.isInTransition = false;
      this._transitionTime()
      const pos = this.getComputedPosition();
      /*固定新的坐标，并且更新新的xy坐标*/
      this._translate(Math.round(pos.x), Math.round(pos.y));
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

    /*打断动作*/
    if (interrupt) return;


    /*针对拖拽翻页阻止是否滑动事件受限*/
    this._stopped = false //如果页面停止了动作，触发
    this._hasBounce = false //是否有反弹
    this._hasTap = true //点击了屏幕
    this._isInvalid = false //无效的触发
    this._moved = false /*是否移动中*/
    this._behavior = 'swipe' //用户行为

    /*锁定滑动相反方向*/
    this._directionBan = false

    /*滑动方向*/
    this.orientation = ''

    this.distX = 0;
    this.distY = 0;

    /*_translate更细后，重新赋值*/
    this.startX = this.x;
    this.startY = this.y;

    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.startTime = Swiper.getDate()
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

    let point = $event(e)
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY
    let absDistX = ABS(deltaX)
    let absDistY = ABS(deltaY)

    let $delta, $absDelta, $dist

    /*判断锁定横竖版滑动*/
    if (absDistX > absDistY) {
      /*因为在滑动过程中，
      用户的手指会偏移方向，
      所以一次滑动值去一次值
      比如开始是h滑动，在中途换成v了，但是还是锁定h*/
      if (!this.orientation) {
        this.orientation = 'h'
      }
      $delta = deltaX
      $absDelta = absDistX
    } else if (absDistY >= absDistX) {
      if (!this.orientation) {
        this.orientation = 'v'
      }
      $delta = deltaY
      $absDelta = absDistY
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
    if (this.options.scrollX && this.orientation === 'v') {
      //左右翻页，猜测上下翻页
      if ($absDelta > 80) {
        this._behavior = 'reverse'
      }
      this._directionBan = 'v'
    } else if (this.options.scrollY && this.orientation === 'h') {
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
      $dist = this.distX = this._getDist(deltaX, absDistX)
    } else if (this.orientation === 'v') {
      $dist = this.distY = this._getDist(deltaY, absDistY)
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

    if (this.options.scrollerMode) {
      /*滚动页面*/
      this._translate(0, this.distY)
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
    if (this.startTime) {
      duration = Swiper.getDate() - this.startTime
    }

    /*滑动距离、滑动方向*/
    const distX = ABS(this.distX)
    const distY = ABS(this.distY)
    const orientation = this.orientation

    /*如果没有滚动页面，判断为点击*/
    if (!distX && !distY) {
      let isReturn = false
      this.$emit('onTap', this.visualIndex, () => isReturn = true, e, duration)
      if (isReturn) return
    }

    /*如果是Y轴移动，发送请求,并且不是mouseleave事件，在PC上mouseleave离开非可视区重复触发*/
    if (this._behavior === 'reverse' && e.type !== 'mouseleave') {
      config.sendTrackCode('swipe', {
        'direction': orientation,
        'pageId': this.visualIndex + 1
      })
    }

    /**
     * 锁定滑动
     * 1 横版模式下，如果有Y滑动，但是如果没有X的的变量，就判断无效
     * 1 竖版模式下，如果有X滑动，但是如果没有Y的的变量，就判断无效
     */
    if (this._directionBan === 'v' && !this.distX) {
      return
    } else if (this._directionBan === 'h' && !this.distY) {
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
        hasSwipe = duration < 200 && distX > this.visualWidth / 10
      } else if (orientation === 'v') {
        hasSwipe = duration < 200 && distY > this.visualHeight / 10
      }
      if (hasSwipe) {
        this._distributeMove({ action: 'swipe' })
      }
      this._setRestore()
      return
    }


    /**
     * 竖版情况下，是滚动页面
     * 启动滑动滚性,必须有300以上的触碰时间*
     */
    if (this.options.scrollerMode && this.options.momentum && duration < 300) {
      let momentumY = momentum(this.distY, 0, duration, this.maxScrollY, this.wrapperHeight)
      console.log(momentumY)
      this.isInTransition = 1; //标记惯性正在滑动
      let newY = momentumY.destination;
      let easing
      if (newY != this.distY) {
        // 当上卷超出界限,改变宽松的功能
        if (newY > 0 || newY < this.maxScrollY) {
          easing = ease.quadratic;
        }
        this.scrollTo(newY, momentumY.duration, easing);
        return;
      }
    }

    /**
     * 开始翻页或者反弹
     * 翻页滑动，要排除首位的情况，首尾页面只要反弹
     */
    const actionType = this.getActionType(distX, distY, duration)

    /*如果是首位页面，直接反弹*/
    if (this._isFirstOrEnd()) {
      this._setRebound()
    } else if (actionType === 'flipOver') {
      /*如果是翻页动作*/
      this._slideTo({ action: 'inner' })
    } else if (actionType === 'flipRebound') {
      /*反弹动作*/
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
    ) ? (absDist / this.visualWidth + 1) : 1)
  }

  /*
  判断是不是首位页面，直接反弹
  如果是首尾
  如果是liner模式排除
  */
  _isFirstOrEnd() {
    if (this.options.snap) {
      if (this.orientation === 'h') {
        return !this.visualIndex && this.distX > 0 || this.visualIndex == this.totalIndex - 1 && this.distX < 0
      }
      if (this.orientation === 'v') {
        return !this.visualIndex && this.distY > 0 || this.visualIndex == this.totalIndex - 1 && this.distY < 0
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

api(Swiper)
init(Swiper)
slide(Swiper)
distribute(Swiper)

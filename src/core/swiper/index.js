import api from './api'
import init from './init'
import slide from './slide'
import distribute from './distribute'
import { Observer } from '../observer/index'
import { config } from '../config/index'
import { initPointer } from './pointer'
import { momentum } from './momentum'
import { ease } from './ease'
import { $off, $handle, $event, $warn } from '../util/index'

import { LINEARTAG } from './type'
import { requestInterrupt } from 'preload/index'

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
    if (config.launch.scrollMode === 'v') {
      scrollX = false
      scrollY = true
    }
    return {
      scrollY,
      scrollX,
      banMove: config.launch.gestureSwipe === false ? true : false
    }
  }

  /**
   * 2种大模式
   * 1 分段，分变化
   * 2 分段，不分变化
   * @type {String}
   */
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

    D：scope,snap,banMove 组合4种模式使用

      1. 页面分段，滑动设置分布到每个独立的页面(横版/竖版，默认处理)
          scope='child'
          snap = true
          banMove = false

      2. 同模式1，区别的就是页面不能滑动了，被锁定
          scope='child'
          snap = true
          banMove = true

      3. 页面分段，滑动集成在swiper中了，统一滑动的坐标处理(用于横版,column)
          scope='parent'
          snap = true
          banMove = false

      4. 同模式3，区别的就是页面不能滑动了，被锁定
          scope='parent'
          snap = true
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
     * actualWidth / visualWidth
     * 一个是可见区域的尺寸
     * 一个是实际容器的尺寸
     * 在模式5下，容器可以在可见区域中滑动
     */

    /*内部滚动
    当visualMode===5的时候
    内容宽度溢出了可见区宽度
    那么需要支持内部滚动模式*/
    insideScroll = false,

    /*容器节点*/
    container,
    /*开始索引*/
    visualIndex,
    /*总索引*/
    totalIndex,
    /*实际容器宽度*/
    actualWidth,
    /*实际容器高度*/
    actualHeight,
    /*是否有多页面*/
    hasMultiPage,
    /*section分段拼接*/
    sectionRang,
    /*可视区域的尺寸 */
    visualWidth
  }) {

    super()

    /*加强判断，如果*/
    if (insideScroll) {
      if (!visualWidth || visualWidth && (actualWidth < visualWidth)) {
        insideScroll = false
        $warn({
          type: 'swiper',
          content: '启动了insideScroll，但是条件还不成立'
        })
      }
    }

    Swiper.mixProperty(this, {
      container,
      visualIndex,
      totalIndex,
      actualWidth,
      actualHeight,
      visualWidth
    })

    this.options = {
      scope,
      snap,
      banMove,
      scrollX,
      scrollY,
      momentum,
      mouseWheel,
      insideScroll,
      hasHook,
      borderBounce,
      stopPropagation,
      preventDefault,
      hasMultiPage,
      sectionRang
    }

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
    this._speedRate = this._originalRate =
      this._defaultFlipTime / (scrollX ? actualWidth : actualHeight)

    /*计算初始化页码*/
    this.pagePointer = initPointer(visualIndex, totalIndex)

    /*标记上一个翻页动作*/
    this._recordRreTick = { ation: null, time: null }

    this._init()

    /*保存上次滑动值*/
    this.keepDistX = 0
    this.keepDistY = 0

    /*内部滑动页面，优化边界的敏感度*/
    this.insideScrollRange = {
      min: visualWidth * 0.01,
      max: visualWidth - (visualWidth * 0.01)
    }

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

    /**
     * 获取观察对象
     * 钩子函数
     * point 事件对象
     * @return {[type]} [description]
     */
    this.$$emit('onFilter', function() {
      interrupt = true;
    }, point, e)

    /*打断动作*/
    if (interrupt) return;

    /*针对拖拽翻页阻止是否滑动事件受限*/
    this._stopped = false //如果页面停止了动作，触发
    this._banBounce = false //是否有禁止了反弹
    this._hasTap = true //点击了屏幕
    this._isInvalid = false //无效的触发
    this._moved = false /*是否移动中*/
    this._behavior = 'swipe' //用户行为

    /*锁定滑动相反方向*/
    this._directionBan = false

    /*滑动方向*/
    this.orientation = ''

    this.distX = 0
    this.distY = 0

    /*手指触碰屏幕移动的距离，这个用于反弹判断*/
    this.touchX = 0
    this.touchY = 0

    this.pointX = point.pageX;
    this.pointY = point.pageY;

    /*每次滑动第一次触碰页面的实际移动坐标*/
    this.firstMovePosition = 0

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

    /*每次滑动的距离*/
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY
    let absDistX = ABS(deltaX)
    let absDistY = ABS(deltaY)

    /**
     * 判断锁定横竖版滑动
     * 只锁定一次
     * 因为在滑动过程中，
     * 用户的手指会偏移方向，
     * 比如开始是h滑动，在中途换成v了，但是还是锁定h
     */
    let $delta, $absDelta
    if (absDistX > absDistY) {
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


    /*滑动距离*/
    let $dist
    if (this.orientation === 'h') {
      this.touchX = this._getDist(deltaX, absDistX);
      $dist = this.distX = this.touchX + this.keepDistX
      this.setDirection(deltaX)
    } else if (this.orientation === 'v') {
      this.touchY = this._getDist(deltaY, absDistY)
      $dist = this.distY = this.touchY + this.keepDistY
      this.setDirection(deltaY)
    }


    /*锁定*/
    if (this._directionBan) return;

    /*
     * 减少抖动
     * 算一次有效的滑动
     * 移动距离必须20px才开始移动
     */
    let delayDist = 10
    let distance = $dist
    if ($absDelta <= delayDist) return;

    /**
     * 因为抖动优化的关系，需要重新计算distX distY的值
     */
    if (this.direction === 'prev') {
      //正值递增
      distance = this.distX = this.distY = $dist - delayDist
    } else if (this.direction === 'next') {
      //负值递增
      distance = this.distX = this.distY = $dist + delayDist
    }

    const self = this
    this._distributeMove({
      distance,
      speed: 0,
      action: 'flipMove',
      /**
       * 因为模式5的情况下，判断是否是边界，需要获取正确的页面值才可以
       * 获取的值，需要转化，所以必须流程在在后面的代码中控制
       * 移动页面在反弹计算之后，所以必须在延后 movePageBases中判断是否为反弹
       */
      setPageBanBounceCallback(position) {

        //如果没有启动边界反弹
        //要主动探测下是否到了边界
        if (!self.options.borderBounce) {
          //如果是到边界了，就禁止反弹
          if (self._banBounce = self._borderBounce(position)) {
            return true
          }
        }

        //模式5下，边界翻页的敏感度处理
        //滑动页面到边界的时候，需要判断当前的操作行为
        //确定是否是翻页行为
        if (self.options.insideScroll) {

          const absPosition = Math.abs(position)

          /*只判断每次移动的，第一次触碰*/
          if (!self.firstMovePosition) {
            self.firstMovePosition = absPosition
          }

          if (self.direction === 'next') {
            if (absPosition >= self.visualWidth) {
              if (self.firstMovePosition > self.insideScrollRange.max) {

                /*如果是单页面，并且右边移动溢出了，这需要处理*/
                if (!self.options.hasMultiPage) {
                  self._setKeepDist(-self.visualWidth, 0)
                  self._banBounce = true
                  return true
                }

                /*如果是在尾部边界的位置翻页，是被允许的*/
                return false
              } else {
                /*其余位置都是被禁止翻页的*/
                self._setKeepDist(-self.visualWidth, 0)
                self._banBounce = true
                return true
              }
            }
          } else if (self.direction === 'prev') {
            // 边界
            if (position >= 0) {
              if (self.firstMovePosition < self.insideScrollRange.min) {
                return false
              } else {
                self._setKeepDist(0, 0)
                self._banBounce = true
                return true
              }
            }
          }
        }
      },
      /**
       * 是否无效函数
       * 如果无效，end方法抛弃掉
       * 必须是同步方法：
       * 动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
       */
      setSwipeInvalidCallback() {
        self._isInvalid = true
      }
    })
  }


  /**
   * 翻页松手
   */
  _onEnd(e) {

    /*停止滑动，或者多点触发，或者是边界，或者是停止翻页*/
    if (!this.enabled || this._banBounce || this._stopped || hasMultipleTouches(e)) {
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

    /*如果没有滚动页面，判断为点击
      2017.8.30
      在三星9150设备上，没用移动，会产生X或Y的移动值，很小的值
      兼容处理X Y 都要<5
    */
    if (!distX && !distY ||
      distX && distX < 5 && !distY ||
      distY && distY < 5 && !distX) {
      let isReturn = false
      this.$$emit('onTap', this.visualIndex, () => isReturn = true, e, duration)
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
        hasSwipe = duration < 200 && distX > this.actualWidth / 10
      } else if (orientation === 'v') {
        hasSwipe = duration < 200 && distY > this.actualHeight / 10
      }
      if (hasSwipe) {
        this._distributeMove({ action: 'swipe' })
      }
      this._setRestore()
      return
    }

    /**
     * 动作推测
     * 1 翻页或者反弹，或者移动
     * 2 这里要区分PPT之间，与PPT内部滑动
     */
    let actionType = this.getActionType(this.touchX, this.touchY, duration)

    /**
     * 单独控制翻页的预加载检测
     * 如果还在预加载中，强制翻页为反弹
     * 然后记录动作，等加载结束后处理
     */
    if (actionType === 'flipOver' && config.launch.preload) {
      const status = requestInterrupt({
        type: 'linear',
        direction: this.direction,
        /*预加载加载结束*/
        processed() {
          this._nextAction('flipOver')
          Xut.View.HideBusy()
        }
      }, this)

      /*如果还在预加载，执行反弹与等待*/
      if (status) {
        Xut.View.ShowBusy()
        actionType = 'flipRebound'
      }
    }

    /*正常松手后动作处理*/
    this._nextAction(actionType)
  }

  /**
   * 执行松手后的动作
   */
  _nextAction(actionType) {

    /*如果是首位页面，直接反弹*/
    if (this._isFirstOrEnd()) {
      /*如果是是内部滚动模式，而且还是最后一页*/
      if (this.options.insideScroll) {
        if (this.direction === 'next') {
          if (actionType === 'flipMove') {
            /*如果是向后移动，更新distX*/
            this._setKeepDist(this.distX, this.distY)
          } else if (actionType === 'flipOver' || actionType === 'flipRebound') {
            /*如果是向后移动反弹*/
            const distance = (-(this.actualWidth / 2))
            this._setRebound({ distance })
            this._setKeepDist(distance)
          }
        } else if (this.direction === 'prev') {
          /*向前翻页，反弹或者翻页，都强制设置反弹*/
          const distance = 0
          this._setRebound({ distance })
          this._setKeepDist(distance)
        }
        return
      }
      this._setKeepDist()
      this._setRebound()
    } else if (actionType === 'flipOver') {
      /*如果是翻页动作*/
      this._setKeepDist()
      this._slideTo({ action: 'inner' })
    } else if (actionType === 'flipRebound') {
      /*如果启动了insideScroll*/
      if (this.options.insideScroll) {
        /*并且是后往回方向反弹，那么反弹的距离只有一半*/
        if (this.direction === 'next') {
          const distance = (-(this.actualWidth / 2))
          this._setRebound({ distance })
          this._setKeepDist(distance)
        } else if (this.direction === 'prev') {
          /*前反弹，设置为开始值*/
          const distance = 0
          this._setRebound({ distance })
          this._setKeepDist(distance)
        }
      } else {
        /*正常单页PPT的反弹*/
        this._setRebound()
      }
    } else if (actionType === 'flipMove') {
      /*如果还是内部移动*/
      this._setKeepDist(this.distX, this.distY)
    }

  }


  /**
   * 设置Keep
   * @return {[type]} [description]
   */
  _setKeepDist(x = 0, y = 0) {
    this.keepDistX = x
    this.keepDistY = y
  }

  /*
  判断是不是首位页面，直接反弹
  如果是首尾
  如果是liner模式排除
  */
  _isFirstOrEnd(actionType) {
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
   * 鼠标滚动
   * win 平台鼠标每次滑动一次产生一次变化
   * mac 平台带有惯性
   * @return {[type]} [description]
   */
  _onWheel(e) {

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

    /*强制修复滑动的方向是上下
    因为在页面中左右滑动一下，这个值被修改
    后续就会报错*/
    this.orientation = 'v'

    this.$$emit('onWheel', e, wheelDeltaY)

    return
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
        this.$$emit('onMasterMove', this.visualIndex, node);
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
    ) ? (absDist / this.actualWidth + 1) : 1)
  }


  /**
   * 前尾边界反弹判断
   */
  _borderBounce(position) {
    //首页,并且是左滑动
    if (this.visualIndex === 0 && position > 0) {
      /*到首页边界，end事件不触发，还原内部的值*/
      this._setKeepDist(0, 0)
      return true
    } else if (this.visualIndex === this.totalIndex - 1) {

      //如果是模式5，左右页面
      //让在最后一页需要判断可以向前移动
      //不能通过position<0因为position左边移动也是<0
      if (this.options.insideScroll) {
        //往后翻页，需要判断
        if (this.direction === 'next' && Math.abs(position) > this.visualWidth) {
          //最后一页，还往右边翻需要禁止
          return true
        }
        //往前翻
        if (this.direction === 'prev' && position > 0) {
          return true
        }
      } else {
        //单页模式的尾页
        if (position < 0) {
          return true
        }
      }
    }
  }

  /**
   * 设置反弹
   * isBoundary ##317
   * 边界后反弹，最后一页刚好有是视觉差，反弹不归位
   * 这里要强制处理
   * 外部接口可以设置参数
   */
  _setRebound({
    distance = 0,
    direction,
    isAppBoundary
  } = {}) {
    this._distributeMove({
      direction: direction || this.direction, //方向
      distance, //反弹的位置
      isAppBoundary, //是边界后，反弹回来的
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
    //跳转页面传入一个对象数据
    if (arguments.length === 1) {
      const data = frontIndex;
      const newPointers = data.newPointers
      //设置新的页面当前页码索引
      this._updateVisualIndex(data.targetIndex)
      if (newPointers.length === 3) {
        this._updatePointer(newPointers[0], newPointers[1], newPointers[2]);
      }
      if (newPointers.length === 2) {
        //2017.10.20修复问题
        //根据目标的地址判断是否首页页面，来更新对应的页码
        //如果是跳到首页
        if (newPointers[0] === data.targetIndex) {
          this.pagePointer.backIndex = newPointers[1];
          this.pagePointer.middleIndex = newPointers[0];
          delete this.pagePointer.frontIndex;
        } else { //跳尾页
          this.pagePointer.frontIndex = newPointers[0];
          this.pagePointer.middleIndex = newPointers[1];
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

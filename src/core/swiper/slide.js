import { getActionPointer } from './pointer'

/*翻页速率*/
const FLIPSPEED = 600


export default function slide(Swiper) {


  Swiper.prototype._transitionTime = function (time) {
    time = time || 0;
    var durationProp = Xut.style.transitionDuration;
    if (!durationProp) {
      return;
    }
    this.scrollerStyle[durationProp] = time + 'ms';
  }

  Swiper.prototype._transitionTimingFunction = function (easing) {
    this.scrollerStyle[Xut.style.transitionTimingFunction] = easing;
  }

  /**
   * 滑动内部页面
   */
  Swiper.prototype._translate = function (x, y) {
    /*父容器滑动模式*/
    if (this.options.scope === 'parent') {
      if (this.options.scrollY) {
        Xut.style.setTranslate({ y, node: this.scroller })
      }
    }
    /*更新坐标*/
    this.x = x;
    this.y = y;
  }

  /**
   * 获取滚动的尺寸
   */
  Swiper.prototype._getRollVisual = function () {
    let orientation = this.orientation
    if (orientation) {
      return this.orientation === 'h' ? this.actualWidth : this.actualHeight
    }
    //在flow初始化时候，在边界往PPT滑动，是没有值的，所以需要通过全局参数判断
    return this.options.scrollX ? this.actualWidth : this.actualHeight
  }

  /**
   * 获取滚动的距离值
   * 获取用户在页面滑动的距离
   * flow页面
   * 修复2个问题
   *  1 交界处，没有生成全局翻页的dist的值
   *  2 flow内部，滑动鼠标溢出了浏览器，会卡死
   */
  Swiper.prototype._getRollDist = function () {
    let dist = this.orientation === 'h' ? this.distX : this.distY
    let visualSize = this._getRollVisual()

    /*这是一个bug,临时修复
    如果一开始布局的页面在flow的首位交界的位置，那么往前后翻页
    在全局中还没有产生dist的值，所以这里强制用一个基本值处理*/
    if (dist === undefined) {
      return visualSize / 1.2
    }

    dist = Math.abs(dist)

    /**
     * 同样在flow中间页，快速用鼠标滑动到app页面外面部分
     * 会产生dist 大于可视区宽度是情况
     * 浏览器调试模式下会出现
     * 会导致动画回到不触发卡死
     * 因为flow的情况下，没有做定时器修复，所以这里强制给一个时间
     */
    if (dist > visualSize) {
      dist = visualSize / 2
    }

    return Math.abs(dist)
  }

  /**
   * 快速翻页时间计算
   */
  Swiper.prototype._setRate = function () {
    this._speedRate = 50 / this._getRollVisual()
    this._isFastSlider = true;
  }

  /**
   * 复位速率
   */
  Swiper.prototype._resetRate = function () {
    this._speedRate = this._originalRate;
    this._isFastSlider = false;
  }

  /**
   * 判断是否快速翻页
   * 如果是快速翻页
   * 重设置_setRate
   */
  Swiper.prototype._setQuick = function () {
    const startDate = Swiper.getDate()
    if (this._preTapTime) {
      if (startDate - this._preTapTime < FLIPSPEED) {
        this._setRate();
      }
    }
    this._preTapTime = Swiper.getDate();
  }

  /**
   * 边界控制
   */
  Swiper.prototype._isBorder = function (direction) {
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

  /**
   * 获取翻页结束的speed的速率
   */
  Swiper.prototype._getFlipOverSpeed = function () {
    let speed = (this._getRollVisual() - this._getRollDist()) * this._speedRate
    if (speed === undefined) {
      speed = this._defaultFlipTime
    }
    return speed
  }

  /**
   * 如果是通过接口翻页的
   * 就需要计算出2次翻页的点击速率
   * 可能是快速翻页
   * @return {[type]} [description]
   */
  Swiper.prototype._getOuterSpeed = function (action) {
    let speed = undefined

    /*外部调用，比如左右点击案例，需要判断点击的速度*/
    if (action === 'outer') {
      /*如果是第二次开始同一个点击动作*/
      if (action === this._recordRreTick.action) {
        /*最大的点击间隔时间不超过默认的_defaultFlipTime时间，最小的取间隔时间*/
        const time = Swiper.getDate() - this._recordRreTick.time
        if (time <= this._defaultFlipTime) {
          speed = time
        } else {
          speed = this._defaultFlipTime
        }
      }
      /*点击时间啊*/
      this._recordRreTick.time = Swiper.getDate()

      /*外部调用，第一次没有速度，就用默认的*/
      if (speed === undefined) {
        speed = this._defaultFlipTime
      }
    }

    /*保存每次点击动作*/
    this._recordRreTick.action = action

    return speed
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
  Swiper.prototype._slideTo = function ({
    speed, //速率
    action,
    direction,
    callback
  }) {

    //如果在忙碌状态,如果翻页还没完毕
    if (!this.enabled) {
      return
    }

    /*外部调用，direction需要更新
    内部调用赋予direction*/
    if (direction) {
      this.direction = direction
    } else {
      direction = this.direction
    }

    /**
     * _slideTo => Swipe.prototype.next => Xut.View.GotoNextSlide
     *如果行为一致,并且是外部接口调用，
     *需要手动计算出滑动的speed
     *  inner 用户内部滑动
     *  outer 外部接口调用
     */
    let outerSpeed = speed || this._getOuterSpeed(action)

    /*是外部调用触发接口
    提供给翻页滑动使用*/
    let outerCallFlip = outerSpeed === undefined ? false : true


    //前后边界
    if (this.options.snap && this._isBorder(direction)) return;

    this.disable()
    this._setQuick()

    /**
     * 监听内部翻页，通过接口调用
     * 需要翻页结束后触发外部通知，绑定一次
     */
    if (callback) {
      this.$$once('_slideFlipOver', callback)
    }

    let distance = 0

    /*如果启动了内部模式滑动，然后往前翻页，就应该是一半的尺寸，而不是0*/
    if (this.options.insideScroll && this.direction === 'prev') {
      distance = -(this.actualWidth / 2)
    }

    this._distributeMove({
      distance,
      'speed': outerSpeed || this._getFlipOverSpeed(),
      'action': 'flipOver',
      direction,
      outerCallFlip
    })

    /*更新数据，触发停止动作*/
    setTimeout(() => {
      this._updateActionPointer();
      /*手指移开屏幕*/
      this.$$emit('onEnd', this.pagePointer)
      this._updateVisualIndex(this.pagePointer.middleIndex)
    }, 0)
  }

  /**
   * 增加索引的动作
   * 修正页码指示
   */
  Swiper.prototype._updateActionPointer = function () {

    const pointer = this.pagePointer

    //获取动作索引
    const actionPointer = getActionPointer(this.direction, pointer.frontIndex, pointer.backIndex)

    const createIndex = actionPointer.createIndex
    const stopIndex = pointer.middleIndex

    switch (this.direction) {
      case 'prev':
        if (-1 < createIndex) { //首页情况
          this._updatePointer(createIndex, pointer.frontIndex, pointer.middleIndex);
        }
        if (-1 === createIndex) {
          this.pagePointer.backIndex = pointer.middleIndex;
          this.pagePointer.middleIndex = pointer.frontIndex;
          delete this.pagePointer.frontIndex;
        }
        break;
      case 'next':
        if (this.totalIndex > createIndex) {
          this._updatePointer(pointer.middleIndex, pointer.backIndex, createIndex);
        }
        if (this.totalIndex === createIndex) { //如果是尾页
          this.pagePointer.frontIndex = pointer.middleIndex;
          this.pagePointer.middleIndex = pointer.backIndex;
          delete this.pagePointer.backIndex;
        }
        break;
    }

    //更新页面索引标识
    this.pagePointer.createIndex = createIndex
    this.pagePointer.destroyIndex = actionPointer.destroyIndex
    this.pagePointer.stopIndex = stopIndex
  }

}

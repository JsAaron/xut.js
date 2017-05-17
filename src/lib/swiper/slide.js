import { getActionPointer } from './pointer'

/*翻页速率*/
const FLIPSPEED = 600

const ABS = Math.abs
const getDate = () => {
  return +new Date
}

export default function slide(Swiper) {

  /**
   * 快速翻页时间计算
   */
  Swiper.prototype._setRate = function() {
    if (this.orientation === 'h') {
      this._speedRate = 50 / this.visualWidth;
    } else {
      this._speedRate = 50 / this.visualHeight;
    }
    this._isQuickTurn = true;
  }

  /**
   * 复位速率
   */
  Swiper.prototype._resetRate = function() {
    this._speedRate = this._originalRate;
    this._isQuickTurn = false;
  }

  /**
   * 判断是否快速翻页
   * 如果是快速翻页
   * 重设置_setRate
   */
  Swiper.prototype._setQuick = function() {
    const startDate = getDate()
    if (this._preTapTime) {
      if (startDate - this._preTapTime < FLIPSPEED) {
        this._setRate();
      }
    }
    this._preTapTime = getDate();
  }

  /**
   * 边界控制
   */
  Swiper.prototype._isBorder = function(direction) {
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
  Swiper.prototype._getFlipOverSpeed = function() {
    let spped
    if (this.orientation === 'h') {
      spped = (this.visualWidth - (ABS(this._distX))) * this._speedRate || this._flipTime;
    } else {
      spped = (this.visualHeight - (ABS(this._distY))) * this._speedRate || this._flipTime;
    }
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
  Swiper.prototype._slideTo = function({
    action,
    direction,
    callback
  }) {

    /*外部调用，direction需要更新
    内部调用赋予direction*/
    if (direction) {
      this.direction = direction
    } else {
      direction = this.direction
    }

    /*是外部调用触发接口
    提供给翻页滑动使用*/
    let outerCallFlip = false

    /**
     * _slideTo => Swipe.prototype.next => Xut.View.GotoNextSlide
     *如果行为一致,并且是外部接口调用，
     *需要手动计算出滑动的speed
     *  inner 用户内部滑动
     *  outer 外部接口调用
     */
    let outerSpeed

    /*外部调用，比如左右点击案例，需要判断点击的速度*/
    if (action === 'outer') {
      /*如果是第二次开始同一个点击动作*/
      if (action === this._recordRreTick.action) {
        /*最大的点击间隔时间不超过默认的_flipTime时间，最小的取间隔时间*/
        const time = getDate() - this._recordRreTick.time
        if (time <= this._flipTime) {
          outerSpeed = time
        } else {
          outerSpeed = this._flipTime
        }
        outerCallFlip = true
      }
      /*点击时间啊*/
      this._recordRreTick.time = getDate()
    }

    /*保存每次点击动作*/
    this._recordRreTick.action = action

    //如果在忙碌状态,如果翻页还没完毕
    if (!this.enabled) {
      return
    }

    //前后边界
    if (this.options.snap) {
      if (this._isBorder(direction)) return;
    }

    this.disable()
    this._setQuick()

    /**
     * 监听内部翻页，通过接口调用
     * 需要翻页结束后触发外部通知，绑定一次
     */
    if (callback) {
      this.$once('innerFlipOver', callback)
    }

    this._distributeMove({
      'speed': outerSpeed || this._getFlipOverSpeed(),
      'distance': 0,
      'action': 'flipOver',
      direction,
      outerCallFlip
    })

    /*更新数据，触发停止动作*/
    setTimeout(() => {
      this._updateActionPointer();
      /*手指移开屏幕*/
      this.$emit('onEnd', this.pagePointer)
      this._updateVisualIndex(this.pagePointer.middleIndex)
    }, 0)
  }

  /**
   * 增加索引的动作
   * 修正页码指示
   */
  Swiper.prototype._updateActionPointer = function() {

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

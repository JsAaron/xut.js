import { getActionPointer } from './pointer'

/*翻页速率*/
const FLIPSPEED = 600


const ABS = Math.abs
const getDate = () => {
  return +new Date
}

export default function slide(Swipe) {


  /**
   * 快速翻页时间计算
   */
  Swipe.prototype._setRate = function () {
    this._speedRate = 50 / this._visualWidth;
    this._isQuickTurn = true;
  }

  /**
   * 判断是否快速翻页
   * @return {[type]} [description]
   */
  Swipe.prototype._isQuickFlip = function () {
    const startDate = getDate()
    if (this._preTapTime) {
      if (startDate - this._preTapTime < FLIPSPEED) {
        this._setRate();
      }
    }
    this._preTapTime = getDate();
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
  Swipe.prototype._slideTo = function (direction, action, callback) {

    /*是外部调用触发接口,提供给翻页滑动使用*/
    let outerCallFlip = false

    /**
     * _slideTo => Swipe.prototype.next => Xut.View.GotoNextSlide
     *如果行为一致,并且是外部接口调用，
     *需要手动计算出滑动的speed
     *  inner 用户内部滑动
     *  outer 外部接口调用
     */
    let outerSpeed

    /*外部调用*/
    if (action === 'outer') {
      /*如果是第二次开始同一个点击动作*/
      if (action === this.preTick.action) {
        /*最大的点击间隔时间不超过默认的_flipTime时间，最小的取间隔时间*/
        const time = getDate() - this.preTick.time
        if (time <= this._flipTime) {
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
    if (this._lockFlip) {
      return
    }

    //前后边界
    if (!this.options.linear) {
      if (this._isBorder(direction)) return;
    }

    this._addFlipLock()
    this._isQuickFlip()
    this.direction = direction

    /*监听内部翻页，通过接口调用，需要翻页结束后触发外部通知，绑定一次*/
    if (callback) {
      this.$once('innerFlipOver', callback)
    }

    this._distributeMove({
      outerCallFlip,
      'speed': outerSpeed || this._getFlipOverSpeed(),
      'distance': 0,
      'direction': this.direction,
      'action': 'flipOver'
    })


    if (this.pagePointer.createPointer) {
      this.recordLastPoionter = $.extend(true, {}, this.pagePointer)
    }

    setTimeout(() => {
      //更新this.pagePointer索引
      //增加处理标记
      this._updatePointer()
      this.$emit('onUpSlider', this.pagePointer)
      this._setVisualIndex(this.pagePointer.middleIndex)
    })
  }


  /**
   * 增加索引的动作
   * 修正页码指示
   */
  Swipe.prototype._updatePointer = function () {

    const pointer = this.pagePointer

    //获取动作索引
    const actionPointer = getActionPointer(this.direction, pointer.frontIndex, pointer.backIndex)
    const createIndex = actionPointer.createIndex
    const stopIndex = pointer.middleIndex

    switch (this.direction) {
      case 'prev':
        if (-1 < createIndex) { //首页情况
          this._updataPointer(createIndex, pointer.frontIndex, pointer.middleIndex);
        }
        if (-1 === createIndex) {
          this.pagePointer.backIndex = pointer.middleIndex;
          this.pagePointer.middleIndex = pointer.frontIndex;
          delete this.pagePointer.frontIndex;
        }
        break;
      case 'next':
        if (this.totalIndex > createIndex) {
          this._updataPointer(pointer.middleIndex, pointer.backIndex, createIndex);
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


  /**
   * 获取翻页结束的speed的速率
   * @return {[type]} [description]
   */
  Swipe.prototype._getFlipOverSpeed = function (visualWidth) {
    visualWidth = visualWidth || this._visualWidth
    const spped = (visualWidth - (ABS(this._deltaX))) * this._speedRate || this._flipTime;
    return ABS(spped)
  }


}

import { initPointer, calculationIndex } from './pointer'
import { ease } from './ease'

export default function api(Swiper) {

  /**
   * 获取动作
   * 是翻页还是反弹
   * @return {[type]} [description]
   */
  Swiper.prototype.getActionType = function (distX, distY, duration, orientation) {
    orientation = orientation || this.orientation
    if (orientation === 'h') {
      distX = Math.abs(distX)
      return duration < 200 && distX > 30 || distX > this.visualWidth / 6 ? 'flipOver' : 'flipRebound'
    } else if (orientation === 'v') {
      distY = Math.abs(distY)
      return duration < 200 && distY > 30 || distY > this.visualHeight / 6 ? 'flipOver' : 'flipRebound'
    }
  }

  /**
   * column的情况
   * 动态设置新的页面总数
   */
  Swiper.prototype.setLinearTotal = function (total, location) {

    //如果当前是column
    if (location === 'middle') {

      let borderIndex
        //必须是有2页以上并且当前页面就是最后一页
        //如果分栏默认只分出1页的情况，后需要不全就跳过这个处理
      if (this.totalIndex > 1 && this.visualIndex == this.totalIndex - 1) {
        borderIndex = this.visualIndex
      }

      this.totalIndex = total

      //如果是最后一页，叠加新的页面
      //需要重写一些数据
      if (borderIndex !== undefined) {
        this.setPointer(borderIndex - 1, total)
        this._updatePointer()
      }
    }

    //如果左边是column页面
    //改变总页面数
    //改变可视区页面为最后页
    if (location === 'left') {
      this.totalIndex = total
      this.visualIndex = total - 1;
      this.setPointer(this.visualIndex, total)
      this._updatePointer()
        //设置Transform的偏移量，为最后一页
      this._setTransform()
    }

    //如果是右边的column
    if (location === 'right') {
      this.totalIndex = total
    }

    this._setContainerValue()
  }


  /**
   * 获取初始化距离值
   * @return {[type]} [description]
   */
  Swiper.prototype.getInitDistance = function () {
    return this._initDistance
  }

  /**
   * 模拟完成状态调用
   * @return {[type]} [description]
   */
  Swiper.prototype.simulationComplete = function () {
    setTimeout(() => {
      this._setRestore()
      this.enable()
    })
  }


  /*启动滑动*/
  Swiper.prototype.enable = function () {
    this.enabled = true;
  }

  //禁止滑动
  Swiper.prototype.disable = function () {
    this.enabled = false;
  }

  /**
   * 是否锁定
   * @return {Boolean} [description]
   */
  Swiper.prototype.hasEnabled = function () {
    return this.enabled
  }


  /**
   * 是否为边界
   * @param  {[type]}  distance [description]
   * @return {Boolean}          [description]
   */
  Swiper.prototype.isBorder = function (...arg) {
    this._borderBounce(...arg)
  }


  /**
   * 获取移动状态
   * @return {Boolean} [description]
   */
  Swiper.prototype.getMoved = function () {
    return this._moved
  }


  /**
   * 外部直接调用
   * 前翻页接口
   * callback 翻页完成
   */
  Swiper.prototype.prev = function ({
    speed,
    callback
  }) {
    if (!this._borderBounce(1)) {
      this._slideTo({
        speed,
        callback,
        direction: 'prev',
        action: 'outer'
      });
    } else {
      //边界反弹
      this._setRebound('next')
    }
  }


  /**
   * 外部直接调用
   * 后翻页接口
   * Xut.View.GotoNextSlide
   * callback 翻页完成
   */
  Swiper.prototype.next = function ({
    speed,
    callback
  }) {
    if (!this._borderBounce(-1)) {
      this._slideTo({
        speed,
        callback,
        direction: 'next',
        action: 'outer'
      })
    } else {
      //边界反弹
      this._setRebound('prev', 'isAppBoundary')
    }
  }


  /**
   * 获取当前页码
   * @return {[type]} [description]
   */
  Swiper.prototype.getVisualIndex = function () {
    return this.visualIndex
  }


  /**
   * 主动设置页码编号
   * 因为分栏的关系，内部修改外部
   * 页面需要拼接
   */
  Swiper.prototype.setPointer = function (target, totalIndex) {
    this.pagePointer = initPointer(target, totalIndex || this.totalIndex)
  }


  /**
   * 获取页面Pointer
   * @return {[type]} [description]
   */
  Swiper.prototype.getPointer = function () {
    return this.pagePointer
  }


  /**
   * 跳指定页面
   * @param  {[type]} targetIndex [description]
   * @param  {[type]} preMode     [description]
   * @param  {[type]} complete    [description]
   * @return {[type]}             [description]
   */
  Swiper.prototype.scrollToPage = function (targetIndex) { //目标页面

    //如果还在翻页中
    if (!this.enabled) return

    const visualIndex = this.visualIndex //当前页面

    //相邻页
    switch (targetIndex) {
      //前一页
      case (visualIndex - 1):
        if (this.options.hasMultiPage) {
          return this.prev();
        }
        break
        //首页
      case visualIndex:
        if (visualIndex == 0) {
          this.$emit('onDropApp');
        }
        return
        //后一页
      case (visualIndex + 1):
        if (this.options.hasMultiPage) {
          return this.next();
        }
        break
    }

    //算出是相关数据
    const data = calculationIndex(visualIndex, targetIndex, this.totalIndex)

    //更新页码索引
    this._updatePointer(data)
    data.pagePointer = this.pagePointer

    this.$emit('onJumpPage', data)
  }


  /**
   * 销毁所有
   * @return {[type]} [description]
   */
  Swiper.prototype.destroy = function () {
    this._off();
    this.$off();
    if (this._childNodes) {
      this._childNodes.page = null
      this._childNodes.master = null
    }
    if (this.options.mouseWheel) {
      this.container.removeEventListener('wheel', this._onWheel, false);
      this.container.removeEventListener('mousewheel', this._onWheel, false);
      this.container.removeEventListener('DOMMouseScroll', this._onWheel, false);
    }
    this.container = null
  }


  /**
   * 调用动画完成
   * @param {[type]} element [description]
   */
  Swiper.prototype.setTransitionComplete = function (...arg) {
    this._distributeComplete(...arg)
  }


  /**
   * 目标元素
   * 找到li元素
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  Swiper.prototype.findBubbleRootNode = function (point, pageType) {
    let liNode, pageChpaterIndex
    let visualIndex = this.visualIndex
    let sectionRang = this.options.sectionRang

    //找到对应的li
    let childNodes = this._childNodes[pageType].childNodes
    let nodeTotal = childNodes.length

    while (nodeTotal--) {
      liNode = childNodes[nodeTotal]
      pageChpaterIndex = liNode.getAttribute('data-chapter-index');
      if (sectionRang) {
        visualIndex += sectionRang.start;
      }
      if (pageChpaterIndex == visualIndex) {
        return liNode
      }
      visualIndex = this.visualIndex;
    }
  }


}

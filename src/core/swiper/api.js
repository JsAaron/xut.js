import { initPointer, getJumpDepend } from './pointer'
import { ease } from './ease'
import { requestInterrupt } from 'preload/index'
import { config } from '../config/index'

export default function api(Swiper) {

  /**
   * 在column中滑动的时候，会丢失Direction
   * 具体就是flow在首页，而且chpater只有一个flow的情况下
   */
  Swiper.prototype.setDirection = function(value) {
    if (value !== undefined) {
      this.direction = value > 0 ? 'prev' : 'next'
    }
  }

  /**
   * 获取动作
   * 是翻页还是反弹
   * @return {[type]} [description]
   */
  Swiper.prototype.getActionType = function(touchX, touchY, duration, orientation) {
    orientation = orientation || this.orientation
    if (orientation === 'h') {
      /**单独PPT页面内部滑动 */
      if (this.options.insideScroll) {
        //////////////////
        /// 判断是内部滑动
        //////////////////
        /*left/up* 并且不是前边界*/
        if (this.direction === 'prev' && this.distX < 0) {
          return 'flipMove'
        }
        /*right/down ,如果移动的距离小于页面宽度*/
        if (this.direction === 'next' && Math.abs(this.distX) < this.visualWidth) {
          return 'flipMove'
        }
        ///////////////////////////////
        /// 判断是单页面，强制打开了滑动
        /// 翻页强制改为反弹
        ///////////////////////////////
        if (!this.options.hasMultiPage) {
          return 'flipRebound'
        }
      }
      /*PPT页面之间的处理*/
      touchX = Math.abs(touchX)
      return duration < 200 && touchX > 30 || touchX > this.actualWidth / 6 ? 'flipOver' : 'flipRebound'
    } else if (orientation === 'v') {
      touchY = Math.abs(touchY)
      return duration < 200 && touchY > 30 || touchY > this.actualHeight / 6 ? 'flipOver' : 'flipRebound'
    }
  }

  /**
   * column的情况
   * 动态设置新的页面总数
   */
  Swiper.prototype.setLinearTotal = function(total, location) {

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
  Swiper.prototype.getInitDistance = function() {
    return this._initDistance
  }

  /**
   * 模拟完成状态调用
   * @return {[type]} [description]
   */
  Swiper.prototype.simulationComplete = function() {
    setTimeout(() => {
      this._setRestore()
      this.enable()
    })
  }


  /*启动滑动*/
  Swiper.prototype.enable = function() {
    this.enabled = true;
  }

  //禁止滑动
  Swiper.prototype.disable = function() {
    this.enabled = false;
  }

  /**
   * 是否锁定
   * @return {Boolean} [description]
   */
  Swiper.prototype.hasEnabled = function() {
    return this.enabled
  }


  /**
   * 是否为边界
   * @param  {[type]}  distance [description]
   * @return {Boolean}          [description]
   */
  Swiper.prototype.isBorder = function(...arg) {
    this._borderBounce(...arg)
  }


  /**
   * 获取移动状态
   * @return {Boolean} [description]
   */
  Swiper.prototype.getMoved = function() {
    return this._moved
  }



  /**
   * 外部直接调用
   * 前翻页接口
   * callback 翻页完成
   * {
      speed,
      callback
    }
   */
  Swiper.prototype.prev = function({
    speed,
    callback
  } = {}) {
    if (!this._borderBounce(1)) {

      const toNext = () => {
        this._slideTo({ speed, callback, direction: 'prev', action: 'outer' })
      }

      /*启动了预加载模式*/
      if (config.launch.preload) {
        const status = requestInterrupt({
          type: 'linear',
          direction: 'prev',
          processed() {
            toNext()
            Xut.View.HideBusy()
          }
        }, this);
        /*如果还在预加载，禁止跳转*/
        if (status) {
          Xut.View.ShowBusy()
          return
        }
      }

      /*正常跳页面*/
      toNext()
    } else {
      //边界反弹
      this._setRebound({ direction: 'next' })
      callback && callback()
    }
  }


  /**
   * 外部直接调用
   * 后翻页接口
   * Xut.View.GotoNextSlide
   * callback 翻页完成
   */
  Swiper.prototype.next = function({
    speed,
    callback
  } = {}) {
    if (!this._borderBounce(-1)) {

      const toNext = () => {
        this._slideTo({ speed, callback, direction: 'next', action: 'outer' })
      }

      /*启动了预加载模式*/
      if (config.launch.preload) {
        const status = requestInterrupt({
          type: 'linear',
          direction: 'next',
          processed() {
            toNext()
            Xut.View.HideBusy()
          }
        }, this);
        /*如果还在预加载，禁止跳转*/
        if (status) {
          Xut.View.ShowBusy()
          return
        }
      }

      /*正常模式*/
      toNext()
    } else {
      //边界反弹
      this._setRebound({
        direction: 'prev',
        isAppBoundary: true
      })
      callback && callback()
    }
  }


  /**
   * 获取当前页码
   * @return {[type]} [description]
   */
  Swiper.prototype.getVisualIndex = function() {
    return this.visualIndex
  }


  /**
   * 主动设置页码编号
   * 因为分栏的关系，内部修改外部
   * 页面需要拼接
   */
  Swiper.prototype.setPointer = function(target, totalIndex) {
    this.pagePointer = initPointer(target, totalIndex || this.totalIndex)
  }


  /**
   * 获取页面Pointer
   * @return {[type]} [description]
   */
  Swiper.prototype.getPointer = function() {
    return this.pagePointer
  }


  /**
   * 跳指定页面
   * targetIndex：目标页面
   * 在一个场景内部跳转
   * 提供一个跳转完毕后的回调
   */
  Swiper.prototype.scrollToPage = function(targetIndex, callback) {

    //如果还在翻页中
    if (!this.enabled) return

    const visualIndex = this.visualIndex //当前页面

    /*跳转页面复位上一个页面的初始化坐标值*/
    this._setKeepDist(0, 0)

    //相邻页
    switch (targetIndex) {
      //前一页
      case (visualIndex - 1):
        if (this.options.hasMultiPage) {
          return this.prev({ callback });
        }
        break
        //首页
      case visualIndex:
        if (visualIndex == 0) {
          this.$$emit('onDropApp');
        }
        return
        //后一页
      case (visualIndex + 1):
        if (this.options.hasMultiPage) {
          return this.next({ callback });
        }
        break
    }

    //算出是跳页相关数据
    const data = getJumpDepend(visualIndex, targetIndex, this.totalIndex)

    data.callback = callback

    //更新新的页码索引
    this._updatePointer(data)

    data.pagePointer = this.pagePointer

    this.$$emit('onJumpPage', data)
  }


  /**
   * 设置页面移动
   */
  Swiper.prototype._setPageMove = function(position, speed) {
    let distance = (this.actualWidth * (position / 100)) / 2

    /*必须有效*/
    if (distance == 0) {
      return
    }

    this.distX = this.distY = -distance
    this._setKeepDist(this.distX, this.distY)

    const self = this
    this._distributeMove({
      distance: this.distX,
      speed: speed,
      action: 'flipMove',
      /**
       * 是否无效函数
       * 如果无效，end方法抛弃掉
       * 必须是同步方法：
       * 动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
       */
      setSwipeInvalidCallback: function() {
        self._isInvalid = true
      }
    })
  }

  /**
   * 清理延时运行
   * @return {[type]} [description]
   */
  Swiper.prototype.clearDelayTimer = function() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }
  }

  /**
   * 移动指定的距离
   * position 默认最右边
   * speed 默认3秒
   * delay 默认没有延时
   */

  Swiper.prototype.scrollToPosition = function(position = 100, speed = 5000, delay = 0) {
    /*清理上一个延时*/
    this.clearDelayTimer()

    /*如果有延时运行*/
    /*这里没用动画的时间延时，因为运动中延时有问题*/
    if (delay) {
      this.delayTimer = setTimeout(() => {
        this.clearDelayTimer()
        this._setPageMove(position, speed)
      }, delay)
      return
    }
    this._setPageMove(position, speed)
  }


  /**
   * 销毁所有
   * @return {[type]} [description]
   */
  Swiper.prototype.destroy = function() {
    this._off();
    this.$$unWatch();
    this.clearDelayTimer()
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
  Swiper.prototype.setTransitionComplete = function(...arg) {
    this._distributeComplete(...arg)
  }


  /**
   * 目标元素
   * 找到li元素
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  Swiper.prototype.findBubbleRootNode = function(point, pageType) {
    let liNode, pageChpaterIndex
    let visualIndex = this.visualIndex
    let sectionRang = this.options.sectionRang

    //找到对应的li
    let childNodes = this._childNodes[pageType].childNodes
    let nodeTotal = childNodes.length

    while (nodeTotal--) {
      liNode = childNodes[nodeTotal]
      pageChpaterIndex = liNode.getAttribute('data-cix');
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

import { $on, $warn } from '../util/index'
import { LINEARTAG } from './type'

export default function init(Swiper) {


  Swiper.prototype._init = function () {
    this._initMode()
    this._initEvents()
    this._initPrevent()
    if (this.options.mouseWheel) {
      this._initWheel();
    }
  }


  /*基本模式设置*/
  Swiper.prototype._initMode = function () {
    /*分段模式*/
    if (this.options.snap) {
      //用于查找跟元素
      //ul => page
      //ul => master
      const ul = this.container.querySelectorAll('ul')
      if (!ul.length) {
        $warn(" ul element don't found !")
      } else {
        this._childNodes = {
          page: ul[0],
          master: ul[1]
        }
      }
    }

    /*父容器滑动模式*/
    if (this.options.scope === 'parent') {
      if (this.options.scrollX) {
        this.container.setAttribute(LINEARTAG, true)
        this._setTransform()
        this._setContainerValue()
      } else if (this.options.scrollY) {
        this.options.scrollerMode = true

        /*竖版处理,滚动容器*/
        this.scroller = this.container.children[0];
        this.scrollerStyle = this.scroller.style;
        /*最大溢出高度*/
        this.wrapperHeight = this.container.clientHeight
        this.maxScrollY = this.wrapperHeight - this.scroller.offsetHeight;
        this._setTransform(this.scroller)
        this._setContainerValue(this.scroller)
      }
    }
  }

  /*默认行为*/
  Swiper.prototype._initPrevent = function () {
    this._stopDefault = this.options.preventDefault ? function (e) {
      e.preventDefault && e.preventDefault()
    } : function () {}
  }

  /**
   * 设置初始的
   */
  Swiper.prototype._setTransform = function (element) {
    this._initDistance = (-this.visualIndex * this._getRollVisual())
    if (element) {
      element.style[Xut.style.transform] = `translate3d(0px,${this._initDistance}px,0px)`
    } else {
      this.container.style[Xut.style.transform] = `translate3d(${this._initDistance}px,0px,0px)`
    }
  }

  /**
   * 设置容易溢出的尺寸
   */
  Swiper.prototype._setContainerValue = function (element) {
    if (element) {
      element.style.height = this.actualHeight * this.totalIndex + 'px'
    } else {
      this.container.style.width = this.actualWidth * this.totalIndex + 'px'
    }
  }

  /**
   * 绑定事件
   */
  Swiper.prototype._initEvents = function () {
    const callback = {
      start: this,
      end: this,
      cancel: this,
      leave: this
    }

    //移动被锁定，不绑定滑动事件
    if (this.options.banMove) {
      //不需要绑定transitionend，会设置手动会触发
    } else if (this.options.hasMultiPage) {
      callback.move = this
      callback.transitionend = this
    }
    $on(this.container, callback)
  }

  /*滚轮*/
  Swiper.prototype._initWheel = function () {
    this.container.addEventListener('wheel', this._onWheel.bind(this), false);
    this.container.addEventListener('mousewheel', this._onWheel.bind(this), false);
    this.container.addEventListener('DOMMouseScroll', this._onWheel.bind(this), false);
  }

}

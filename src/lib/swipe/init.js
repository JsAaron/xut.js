import { $on, $warn } from '../util/index'
import { LINEARTAG } from './type'

export default function init(Swipe) {


  Swipe.prototype._init = function () {
    this._initMode()
    this._initEvents()
    this._initPrevent()
    if (this.options.mouseWheel) {
      this._initWheel();
    }
  }


  /*基本模式设置*/
  Swipe.prototype._initMode = function () {
    if (this.options.snap) {
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
    } else {
      //初始化线性翻页
      //全局只创建一个翻页容器
      this.container.setAttribute(LINEARTAG, true)
      this._setTransform()
      this._setContainerWidth()
    }
  }

  /*默认行为*/
  Swipe.prototype._initPrevent = function () {
    this._stopDefault = this.options.preventDefault ? function (e) {
      e.preventDefault && e.preventDefault()
    } : function () {}
  }

  /**
   * 设置初始的
   */
  Swipe.prototype._setTransform = function (newIndex) {
    if (this.options.flipMode === 'horizontal') {
      let visualIndex = newIndex || this.visualIndex
      this._initDistance = -visualIndex * (this._visualWidth + this.extraGap)
      if (this.container) {
        this.container.style[Xut.style.transform] = 'translate3d(' + this._initDistance + 'px,0px,0px)'
      }
    } else if (this.options.flipMode === 'vertical') {

    }
  }

  /**
   * 设置容易溢出的宽度
   */
  Swipe.prototype._setContainerWidth = function () {
    if (this.container) {
      this.container.style.width = this._visualWidth * this.totalIndex + 'px'
    }
  }

  /**
   * 绑定事件
   */
  Swipe.prototype._initEvents = function () {
    const callback = {
      start: this,
      end: this,
      cancel: this,
      leave: this
    }

    //flipMode启动，没有滑动处理
    if (this.options.flipBan) {
      //不需要绑定transitionend，会设置手动会触发
    } else if (this.options.multiplePages) {
      callback.move = this
      callback.transitionend = this
    }
    $on(this.container, callback)
  }

  /*滚轮*/
  Swipe.prototype._initWheel = function () {
    this.container.addEventListener('wheel', this._onWheel.bind(this), false);
    this.container.addEventListener('mousewheel', this._onWheel.bind(this), false);
    this.container.addEventListener('DOMMouseScroll', this._onWheel.bind(this), false);
  }

}

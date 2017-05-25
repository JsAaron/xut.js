import MiniSuper from './super'
import { config } from '../../config/index'

/**
 * 迷你杂志页面工具栏扩展
 * 卷滚类型
 */
export default class Scrollbar extends MiniSuper {
  constructor(pageBar, options) {
    super(pageBar, options)
  }

  _init() {
    this.visualHeight = config.visualSize.height;
    this.visualWidth = config.visualSize.width;
  }

  _parseBar() {
    this.direction = this.pageBar.direction || config.launch.scrollMode
  }

  _createHTML() {
    //横向翻页
    if (this.direction == "h") {
      this.ratio = this.visualWidth / this.pageTotal;
      return `<div class="xut-iscroll-bar"
                   style="height:.3rem;left: 2px; right: 2px; bottom: 1px; overflow: hidden;">
                <div class="xut-iscroll-indicator" style="height: 100%;width: ${this.ratio}px; "></div>
             </div>`
    } else {
      this.ratio = this.visualHeight / this.pageTotal
      return `<div class="xut-iscroll-bar"
                   style="width:.3rem;bottom: 2px; top: 2px; right: 1px; overflow: hidden;">
                <div class="xut-iscroll-indicator" style="width: 100%;height: ${this.ratio}px;"></div>
             </div>`
    }
  }

  /**
   * 获取卷滚条对象
   */
  _getContextNode() {
    this.$indicatorNode = this.$container.find('div:first')
    this.indicatorNode = this.$indicatorNode[0]
  }

  _render() {
    this.$sceneNode.append(this.$container)
  }


  _setTranslate(updateIndex, speed) {
    if (this.indicatorNode) {
      let distance;
      let translate
      if (this.direction == "h") {
        distance = this.visualWidth * (updateIndex - 1) / this.pageTotal;
        translate = `translate3d(${distance}px,0px,0px)`
      } else {
        distance = this.visualHeight * (updateIndex - 1) / this.pageTotal;
        translate = `translate3d(0px,${distance}px,0px)`
      }
      this.indicatorNode.style[Xut.style.transitionDuration] = speed + 'ms'
      this.indicatorNode.style[Xut.style.transform] = translate
      this.baesTranslateY = this.initTranslateY = distance
    }
  }

  _clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex, speed) {

    this._clearTimer()

    if (this.barState === 'hide') {
      this.showBar()
    }

    this.timer = setTimeout(() => {
      // this.hideBar()
    }, 1500)

    /*初始化处理*/
    if (action === 'init') {
      this._setTranslate(updateIndex, 0)
      this.$container.show()
    } else {
      /*边界处翻页处理*/
      this._setTranslate(updateIndex, speed)
    }
  }


  _destroy() {
    this._clearTimer()
    this.$indicatorNode = null
    this.indicatorNode = null
  }

  //==========================
  //        对外接口
  //==========================


  /**
   * 内部滑动页面操作
   * 更新坐标
   */
  updatePosition(scrollY, time = 0, action) {
    let distance
      /*向下*/
    if (action === 'down') {
      distance = scrollY + this.initTranslateY
      this.preTranslateY = distance
        /*清楚上滑动的参考基础值*/
      this.baesTranslateY = null
    }
    /*向上*/
    if (action === 'up') {
      /*preTranslateY的值是一直在变化的，但是每次改变其实只要拿到最后一次值，当做基础值设置*/
      if (!this.baesTranslateY) {
        this.baesTranslateY = this.preTranslateY
      }
      distance = this.baesTranslateY - scrollY
      this.preTranslateY = distance
    }
    this.indicatorNode.style[Xut.style.transitionDuration] = time + 'ms'
    this.indicatorNode.style[Xut.style.transform] = `translate3d(0px,${distance}px,0px)`
  }

  /*显示滚动条*/
  showBar() {
    if (this.barState === 'hide') {
      this.$indicatorNode.css('opacity', '0.5')
      this.barState = 'show'
    }
  }

  /*隐藏滚动条*/
  hideBar() {
    this.barState = 'hide'
    this.$indicatorNode.transition({
      opacity: 0,
      duration: 1500,
      easing: 'in'
    });
    this._clearTimer()
  }

  /**
   * 更新总页数
   */
  updateTotal(newTotalIndex) {
    Xut.nextTick(() => {
      this._setTranslate()
      this._setTranslate(this.visualHeight / newTotalIndex, 0)
    })
  }

}

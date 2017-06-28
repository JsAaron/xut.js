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


  _setTranslate(x = 0, y = 0, speed = 0) {
    Xut.style.setTranslate({ x, y, speed, node: this.indicatorNode })
  }


  _updateTranslate(updateIndex, speed) {
    if (this.indicatorNode) {
      let distance;
      if (this.direction == "h") {
        distance = this.visualWidth * (updateIndex - 1) / this.pageTotal;
        this._setTranslate(distance, 0, speed)
      } else {
        distance = this.visualHeight * (updateIndex - 1) / this.pageTotal;
        this._setTranslate(0, distance, speed)
      }
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
   * PPT页面更新
   */
  _updateSingle(action, updateIndex, speed) {
    if (this.barState === 'hide') {
      this.showBar()
    }

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.hideBar()
      }, 1500)
    }

    /*初始化处理*/
    if (action === 'init') {
      this._updateTranslate(updateIndex, 0)
      this.$container.show()
    } else {
      /*边界处翻页处理*/
      this._updateTranslate(updateIndex, speed)
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
   * Flow内部滚动
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
    this._setTranslate(0, distance, time)
  }

  /*显示滚动条*/
  showBar() {
    if (this.barState === 'hide') {
      this.$indicatorNode.css('opacity', 1)
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
   * flow数据开始不完全，动态补全后重新处理
   */
  updateTotal(newTotalIndex) {
    /*更新数必须大于当前数*/
    if (newTotalIndex > this.pageTotal) {
      this.pageTotal = newTotalIndex
        /*更新基数*/
      if (this.direction == "h") {
        this.ratio = this.visualWidth / this.pageTotal;
        this.$indicatorNode.css('width', this.ratio)
      } else {
        this.ratio = this.visualHeight / this.pageTotal
        this.$indicatorNode.css('height', this.ratio)
      }
    }
  }

}

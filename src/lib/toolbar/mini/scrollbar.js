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
      const width = this.visualWidth / this.pageTotal;
      return `<div class="iScrollHorizontalScrollbar iScrollLoneScrollbar"
                   style="position: absolute; z-index: 9999; height: 7px;
                   left: 2px; right: 2px; bottom: 1px; overflow: hidden;
                   pointer-events: none;display:none;">
                <div class="iScrollIndicator"
                   style="box-sizing: border-box; position: absolute;
                   background: rgba(0, 0, 0, 0.498039)
                   border: 1px solid rgba(255, 255, 255, 0.901961);
                   border-radius: 3px; height: 100%;;
                   display: block; width: ${width}px;
                   transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);">
                </div>
             </div>`
    } else {
      const height = this.visualHeight / this.pageTotal;
      return `<div class="iScrollVerticalScrollbar iScrollLoneScrollbar"
                   style="position: absolute; z-index: 9999; width: 7px;
                   bottom: 2px; top: 2px; right: 1px; overflow: hidden;
                   pointer-events: none;display:none;">
                <div class="iScrollIndicator"
                   style="box-sizing: border-box; position: absolute;
                   background: rgba(0, 0, 0, 0.498039)
                   border: 1px solid rgba(255, 255, 255, 0.901961);
                   border-radius: 3px; width: 100%;;
                   display: block; height: ${height}px;
                   transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);">
                </div>
             </div>`
    }
  }


  _getContextNode() {
    this.currentNode = this.$container.find('div:first')[0];
  }

  _render() {
    this.$sceneNode.append(this.$container)
  }


  _setTranslate(updateIndex, speed) {
    if (this.currentNode) {
      let distance;
      let translate
      if (this.direction == "h") {
        distance = this.visualWidth * (updateIndex - 1) / this.pageTotal;
        translate = `translate3d(${distance}px,0px,0px)`
      } else {
        distance = this.visualHeight * (updateIndex - 1) / this.pageTotal;
        translate = `translate3d(0px,${distance}px,0px)`
      }
      this.currentNode.style[Xut.style.transitionDuration] = speed + 'ms'
      this.currentNode.style[Xut.style.transform] = translate
    }
  }

  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex, speed) {
    if (action === 'init') {
      this._setTranslate(updateIndex, 0)
      this.$container.show()
    } else {
      this._setTranslate(updateIndex, speed)
    }
  }


  //==========================
  //        对外接口
  //==========================


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

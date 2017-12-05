import MiniSuper from './super'
import { config } from '../../config/index'

/**
 * 迷你杂志页面工具栏扩展
 * 数字类型
 */
export default class Digital extends MiniSuper {
  constructor(pageBar, options) {
    super(pageBar, options)
  }

  _createHTML() {
    //存在模式3的情况，所以页码要处理溢出的情况。left值
    let right = 0
    if (config.visualSize.overflowWidth) {
      right = Math.abs(config.visualSize.left * 2) + 'px'
    }
    return `<div class="xut-page-number" style="right:${right};bottom:0;">
                  <div>1</div>
                  <strong>/</strong>
                  <div>${this.pageTotal}</div>
            </div>`
  }

  _getContextNode() {
    this.$currtNode = this.$container.find('div:first')
    this.$allNode = this.$container.find('div:last')
  }

  _render() {
    this.$sceneNode.append(this.$container)
  }


  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex) {
    Xut.nextTick(() => {
      this.$currtNode.text(updateIndex)
      if (action === 'init') {
        this.$container.show()
      }
    })
  }

  _destroy() {
    this.$currtNode = null
    this.$allNode = null
  }


  //==========================
  //        对外接口
  //==========================


  /**
   * 更新总页数
   */
  updateTotal(newTotalIndex) {
    /*更新数必须大于当前数*/
    if (newTotalIndex > this.pageTotal) {
      this.pageTotal = newTotalIndex
      this.$allNode.text(newTotalIndex)
    }
  }


}

import MiniSuper from './super'
import { config } from '../../config/index'

/**
 * 迷你杂志页面工具栏扩展
 * 卷滚类型
 */
export default class Scrollbar extends MiniSuper {
  constructor(pageBar, options) {
    super(pageBar, options)
    this.$$template()
  }

  _getContextNode() {

  }

  _createHTML() {

  }

  toggle(state, pointer) {
    this.$$toggle()
  }

  /**
   * 更新总页数
   */
  updateTotal(newTotalIndex) {
    Xut.nextTick(() => {

    })
  }

  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex) {
    Xut.nextTick(() => {

    })
  }

  /**
   * 更新页码
   */
  updatePointer(...arg) {
    this.$$updatePointer(...arg)
  }

}

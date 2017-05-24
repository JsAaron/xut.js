import { hasColumn, getBeforeCount, getCurrentBeforeCount } from '../../component/column/api'

/**
 * 迷你工具栏超类
 *$sceneNode: $sceneNode,
  visualIndex: pageIndex,
  pageTotal: getPageTotal()
 */
export default class MiniSuper {

  constructor(pageBar, options) {
    this.pageBar = pageBar
    for (let key in options) {
      this[key] = options[key]
    }
    this._$$template()
  }

  /**
   * 模板初始化
   * @return {[type]} [description]
   */
  _$$template() {
    this._init && this._init()
    this._parseBar && this._parseBar()
    const html = this._createHTML()
    if (html) {
      this.$container = $(String.styleFormat(html))
      this._getContextNode()
      this.status = true
      Xut.nextTick(() => {
        this._render()
      })
    }
  }

  _$$showlBar() {
    this.status = true
    this.$container.show()
  }

  _$$hideBar() {
    this.status = false
    this.$container.hide()
  }


  _$$update(action, index, time) {
    /*避免滚动页面重复更新*/
    if (this._visualIndex != index) {
      this._updateSingle(action, index, time)
    }
    this._visualIndex = index
  }


  //==========================
  //        对外接口
  //==========================


  destroy() {
    if (this._destroy) {
      this._destroy()
    }
    this.$sceneNode = null
    this.$container = null
  }


  toggle(state, pointer) {
    if (pointer !== 'pageNumber') return
    switch (state) {
      case 'show':
        this._$$showlBar();
        break;
      case 'hide':
        this._$$hideBar();
        break;
      default:
        //默认：工具栏显示隐藏互斥处理
        this.status ? this._$$showlBar() : this._$$hideBar();
        break;
    }
  }


  /**
   * 更新页码
   */
  updatePointer({
    time = 600,
    action,
    direction,
    parentIndex, //chpater的pageIndex
    hasSon = false,
    sonIndex = 0
  }) {

    let chapterData = Xut.Presentation.GetPageData('page', parentIndex)

    //从正索引开始
    ++parentIndex

    //没有column
    if (!hasColumn()) {
      this._$$update(action, parentIndex, time)
      return
    }

    //默认，需要拿到前置的总和(出去当前)
    let beforeCount = getBeforeCount(chapterData.seasonId, chapterData._id)
    let updateIndex = parentIndex + beforeCount + sonIndex

    //前翻页，需要叠加flow的总和
    if (direction === 'prev') {
      //前翻页：内部翻页
      if (hasSon) {
        updateIndex = parentIndex + beforeCount + sonIndex - 2
      }
      //前翻页：外部往内部翻页，正好前一页是内部页，所以需要获取内部页总和
      else {
        //前翻页，需要拿到当期那到前置的总和
        updateIndex = parentIndex + getCurrentBeforeCount(chapterData.seasonId, chapterData._id)
      }
    }

    this._$$update(action, updateIndex, time)
  }


}

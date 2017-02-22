/**
 * 迷你杂志页面工具栏
 */
import {
  config
} from '../../config/index'
import {
  hasColumn,
  getBeforeCount,
  getCurrentBeforeCount
} from '../../scenario-core/component/column/depend'

//样式类型
const dotStyleClass = [
  "dotIcon-brightness_1",
  "dotIcon-circle-full",
  "dotIcon-cd",
  "dotIcon-adjust",
  "dotIcon-stop",
  "dotIcon-record"
]

export default class NumberBar {

  constructor({
    $rootNode,
    pageTotal,
    visualIndex,
    /**
     * type
     * mode
     * position:top/bottom
     */
    pageBar
  }) {

    //数字模式模式
    this.dotTrue = 'digital';

    //圆形
    if (pageBar.type === 'circular') {
      //圆点模式
      this.dotTrue = pageBar.type;
      //圆点模式样式
      this.dotStyle = Number(pageBar.mode) || 1;
      //样式
      this.dotStyleClass = dotStyleClass[this.dotStyle - 1];
      //位置
      if (pageBar.position) {
        let left = pageBar.position.left
        let top = pageBar.position.top
        let width = 'width:100%;'
        if (_.isUndefined(left)) {
          left = 'width:100%;text-align:center;'
        } else {
          width = `width:${100-parseInt(left)}%;`
          left = `left:${left};`
        }
        if (_.isUndefined(top)) {
          top = 'bottom:0;'
        } else {
          top = `top:${top};`
        }
        this.position = `${width}${left}${top}`
      } else {
        this.position = "width:100%;text-align:center;bottom:0;margin-bottom:0.3rem";
      }
    }

    //结构
    const html = String.styleFormat(this._createDom(pageTotal))
    this.$container = $(html)

    if (this.dotTrue === 'circular') {
      this.$currtNode = this.$container.find('span:first')
    } else {
      this.$currtNode = this.$container.find('div:first')
      this.$allNode = this.$container.find('div:last')
    }

    this.toolBarStatus = true
    Xut.nextTick(() => {
      $rootNode.append(this.$container)
    })

  }

  _createDom(pageTotal) {
    //圆点模式
    if (this.dotTrue === 'circular') {
      let dotString = ''
      let countPage = pageTotal
      while (countPage--) {
        dotString += `<span class="slider-pager-page"><i class= ${this.dotStyleClass}></i></span>`;
      }
      return `<div class="xut-page-number"style="${this.position};">${dotString}</div>`
    }
    //数字模式
    else {
      //存在模式3的情况，所以页码要处理溢出的情况。left值
      let right = 0
      if (config.visualSize.overflowWidth) {
        right = Math.abs(config.visualSize.left * 2) + 'px'
      }
      return `<div class="xut-page-number"style="right:${right};bottom:0;">
                  <div>1</div>
                  <strong>/</strong>
                  <div>${pageTotal}</div>
              </div>`
    }
  }

  _showToolBar() {
    this.$container.show()
  }

  _hideToolBar() {
    this.$container.hide()
  }

  toggle(state, pointer) {
    if (pointer !== 'pageNumber') return
    switch (state) {
      case 'show':
        this._showToolBar();
        break;
      case 'hide':
        this._hideToolBar();
        break;
      default:
        //默认：工具栏显示隐藏互斥处理
        this.toolBarStatus ? this._hideToolBar() : this._showToolBar();
        break;
    }
  }

  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex) {
    Xut.nextTick(() => {
      //圆点模式
      if (this.dotTrue === 'circular') {
        this.$container.find('span.slider-pager-page.active').removeClass('active')
        $(this.$container.find('span.slider-pager-page')[updateIndex - 1]).addClass("active");
      } else {
        this.$currtNode.text(updateIndex)
      }
      if (action === 'init') {
        this.$container.show()
      }
    })
  }

  /**
   * 更新总页数
   */
  updateTotal(newTotalIndex) {
    Xut.nextTick(() => {
      //圆点模式
      if (this.dotTrue === 'circular') {
        var visualIndex = 0;
        var span, iconi;
        _.each(this.$container.find('span.slider-pager-page'), function(value, index) {
          if (value.className != "slider-pager-page") {
            visualIndex = index;
          }
        })
        this.$container.empty();
        for (var i = 0; i < newTotalIndex; i++) {
          span = document.createElement('span')
          if (i == visualIndex) {
            span.className = "slider-pager-page active";
          } else {
            span.className = "slider-pager-page";
          }
          iconi = document.createElement('i');
          iconi.className = this.dotStyleClass;
          span.append(iconi);
          this.$container.append(span)
        }

      } else {
        this.$allNode.text(newTotalIndex)
      }
    })
  }

  /**
   * 更新页码
   */
  updatePointer({
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
      this._updateSingle(action, parentIndex)
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

    this._updateSingle(action, updateIndex)
  }

}

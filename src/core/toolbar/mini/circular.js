import MiniSuper from './super'

//样式类型
const dotStyleClass = [
  "xut-dotIcon-brightness_1",
  "xut-dotIcon-circle-full",
  "xut-dotIcon-cd",
  "xut-dotIcon-adjust",
  "xut-dotIcon-stop",
  "xut-dotIcon-record"
]

/**
 * 迷你杂志页面工具栏扩展
 * 圆形类型
 */
export default class Circular extends MiniSuper {

  constructor(pageBar, options) {
    super(pageBar, options)
  }

  /**
   * 解析参数
   * @return {[type]} [description]
   */
  _parseBar() {
    const pageBar = this.pageBar;
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

  _createHTML() {
    let dotString = ''
    let countPage = this.pageTotal
    while (countPage--) {
      dotString += `<span class="slider-pager-page"><i class= ${this.dotStyleClass}></i></span>`;
    }
    return `<div class="xut-page-number" style="${this.position};">${dotString}</div>`
  }

  _getContextNode() {
    this.$currtNode = this.$container.find('span:first')
  }

  _render() {
    this.$sceneNode.append(this.$container)
  }


  /**
   * 更新单页
   */
  _updateSingle(action, updateIndex) {
    Xut.nextTick(() => {
      this.$container.find('span.slider-pager-page.active').removeClass('active')
      $(this.$container.find('span.slider-pager-page')[updateIndex - 1]).addClass("active");
      if (action === 'init') {
        this.$container.show()
      }
    })
  }

  _destroy() {
    this.$currtNode = null
  }

  //==========================
  //        对外接口
  //==========================

  /**
   * 更新总页数
   */
  updateTotal(newTotalIndex) {
    if (newTotalIndex > this.pageTotal) {
      var visualIndex = 0;
      var span, iconi;
      _.each(this.$container.find('span.slider-pager-page'), function (value, index) {
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
        span.appendChild(iconi);
        this.$container.append(span)
      }
    }
  }

}

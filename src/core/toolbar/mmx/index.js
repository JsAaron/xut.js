/**
 * 秒秒学定制工具栏
 */
import {
  config
} from '../../config/index'
import {
  getPostMessageFn
} from '../../api/post-message'
import {
  hash,
  $on,
  $off,
  $handle,
  $target,
  defAccess
} from '../../util/index'

/**
 * 全局工具栏
 */
export default class GlobalBar {

  constructor(options) {
    _.extend(this, options)
    this._init()
  }

  _init() {
    this._initData()
    this._initContainer()
    this._dirButton()
    this._coverButton()
    this._centerView()
    this._rightView()
    this._bindEvent()
    this.pageElement = this.container.find('.g-page > a:first')
    this.$sceneNode.append(this.container)
  }

  /**
   * 绑定事件
   * @return {[type]} [description]
   */
  _bindEvent() {
    const self = this
    $on(this.container, {
      end: function(event) {
        event.stopPropagation()

        let className
        if (event.target.tagName.toLowerCase() === 'a') {
          className = event.target.parentNode.className
        } else {
          className = event.target.className
        }

        switch (className) {
          case "g-cover":
            Xut.View.GotoSlide(1)
            break;
          case "g-dir":
            Xut.Assist.GlobalDirToggle({
              open: function() {
                console.log(1)
              },
              close: function() {
                console.log(2)
              }
            })
            break;
          case "g-prev":
            Xut.View.GotoPrevSlide()
            break;
          case "g-next":
            Xut.View.GotoNextSlide()
            break;
          case "g-forum":
            Xut.Assist.ForumToggle({
              open: function() {
                console.log(1)
              },
              close: function() {
                console.log(2)
              }
            })
            break;
          case "g-page":
            break;
        }
      }
    })
  }

  _initData() {
    this.basePadding = 3 //基础值
    this.currentPage = 1 //当前页面
      //工具栏的高度
    this.barHeight = config.launch.pageBar.bottom || Math.round(config.visualSize.height / 17)
      //设置了padding的top与bottom 所以height需要*2
    this.baseHeight = this.barHeight - this.basePadding * 2
  }

  /**
   * 获取缩放尺寸
   * @return {[type]} [description]
   */
  _getSize(width, height) {
    //根据高度获取缩放比
    const ratio = this.baseHeight / height
    return {
      width: Math.round(width * ratio),
      height: this.baseHeight
    }
  }

  /**
   * 获取基础style
   * @return {[type]} [description]
   */
  _getBaseStyle(width, height) {
    const size = this._getSize(width, height)
    return `width:${size.width}px;height:${size.height}px`
  }

  /**
   * 容器
   * @return {[type]} [description]
   */
  _initContainer() {
    //设置了padding的top与bottom 所以height需要*2
    const style = `height:${this.baseHeight}px;padding:${this.basePadding}px 0;`
    this.container = $(`<ul class="xut-global-bar" style="${style}"></ul>`)
  }

  /**
   * 目录
   * @return {[type]} [description]
   * background-image:url(images/icons/global-bar.png);
   */
  _dirButton() {
    const html = `<li class="g-dir" style="${this._getBaseStyle(66, 44)}"></li>`
    this.container.append(html)
  }

  /**
   * 封面页面
   * @return {[type]} [description]
   */
  _coverButton() {
    const html = `<li class="g-cover" style="${this._getBaseStyle(66, 44)}"></li>`
    this.container.append(html)
  }

  /**
   * 中间区域，拼接问题
   * 所以合并到一个li中
   * @return {[type]} [description]
   */
  _centerView() {
    const html =
      `<li class="g-center" style="height:${this.baseHeight}px;line-height:${this.baseHeight}px;">
         <a class="g-prev" style="${this._getBaseStyle(59, 44)}"></a>
         <div>
            <a class="g-title">${config.data.shortName}</a>
         </div>
         <a class="g-next" style="${this._getBaseStyle(59, 44)}"></a>
       </li>`
    this.container.append(String.styleFormat(html))
  }

  /**
   * 右边区域
   * @return {[type]} [description]
   */
  _rightView() {
    const style = `height:${this.baseHeight}px`
    const html =
      `<li class="g-right" style="${style}">
          <div class="g-section" style="${style}"><a></a></div>
          <div class="g-work" style="${style}"><a></a></div>
          <div class="g-forum" style="${style}"><a></a></div>
          <div class="g-page" style="${style}">
            <div>
              <a>${this.currentPage}</a>
              <a>${this.pageTotal}</a>
            </div>
          </div>
       </li>`
    this.container.append(String.styleFormat(html))
  }


  /**
   * 更新页码
   * @return {[type]} [description]
   */
  updatePointer({
    parentIndex
  }) {
    ++parentIndex //从1开始索引，parentIndex默认从0开始
    if (parentIndex !== undefined && parentIndex !== this.$currentPage) {
      this.$currentPage = parentIndex
      this.pageElement.html(parentIndex)
    }
  }

  /**
   * 销毁
   * @return {[type]} [description]
   */
  destroy() {
    $off(this.container)
    this.$sceneNode = null
    this.container = null
    this.pageElement = null
  }

}

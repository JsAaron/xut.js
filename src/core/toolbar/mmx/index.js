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
    this._leftView()
    this._centerView()
    this._rightView()
    this._bindEvent()
    this.pageElement = this.container.find('.g-page .g-page-current')
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
        switch (event.target.className) {
          case "g-cover":
            Xut.View.GotoSlide(1)
            break;
          case "g-dir":
            Xut.Assist.GlobalDirToggle()
            break;
          case "g-prev":
            Xut.View.GotoPrevSlide()
            break;
          case "g-next":
            Xut.View.GotoNextSlide()
            break;
          case "g-learn-click":
            break;
          case "g-work-click":
            break;
          case "g-forum-click":
            Xut.Assist.ForumToggle()
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
    const style = `height:${this.barHeight}px;`
    this.container = $(`<ul class="xut-global-bar"></ul>`)
  }

  /**
   * 左边区域
   * @return {[type]} [description]
   */
  _leftView(){
    const html =
      `<li class="g-left">
          <div><a class="g-dir"></a></div>
          <div><a class="g-cover"></a></div>
       </li>`
    this.container.append(String.styleFormat(html))
  }

  /**
   * 中间区域，拼接问题
   * 所以合并到一个li中
   * @return {[type]} [description]
   */
  _centerView() {
    const html =
      `<li class="g-center">
         <a class="g-prev"></a>
         <div><a class="g-title">${config.data.shortName}</a></div>
         <a class="g-next"></a>
       </li>`
    this.container.append(String.styleFormat(html))
  }

  /**
   * 右边区域
   * @return {[type]} [description]
   */
  _rightView() {
    const html =
      `<li class="g-right">
          <div class="g-learn"><a class="g-learn-click"></a></div>
          <div class="g-work"><a class="g-work-click"></a></div>
          <div class="g-forum"><a class="g-forum-click"></a></div>
          <div class="g-page">
            <div>
              <a class="g-page-current">${this.currentPage}</a>
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

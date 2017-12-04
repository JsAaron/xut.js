/**
 * 秒秒学定制工具栏
 */
import { config } from '../../config/index'
import {
  hash,
  $on,
  $off,
  $handle,
  $target
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
    this._prevButton()
    this._titleButton()
    this._nextButton()
    this._forumButton()
    this._forumPage()
    this.$sceneNode.append(this.container)
    this._bindEvent()
  }


  /**
   * 绑定事件
   * @return {[type]} [description]
   */
  _bindEvent() {
    const self = this
    $on(this.container, {
      end: function(event) {
        switch (event.target.className) {
          case "xut-global-bar-cover":
            Xut.View.GotoSlide(1)
            break;
          case "xut-global-bar-dir":
            console.log(2)
            break;
          case "xut-global-bar-prev":
            break;
          case "xut-global-bar-next":
            break;
          case "xut-global-bar-forum":
            break;
          case "xut-global-bar-page":
            break;
        }
      }
    })
  }

  _initData() {
    //工具栏的高度
    this.barHeight = config.launch.pageBar.bottom || Math.round(config.visualSize.height / 17)
  }

  /**
   * 获取缩放尺寸
   * @return {[type]} [description]
   */
  _getSize(width, height) {
    //根据高度获取缩放比
    const ratio = this.barHeight / height
    return {
      width: width * ratio,
      height: this.barHeight
    }
  }

  /**
   * 容器
   * @return {[type]} [description]
   */
  _initContainer() {
    const style = `position:absolute;z-index:9999;bottom:0;width:100%;height:${this.barHeight};background:#ccc;`
    this.container = $(`<ul class="xut-global-bar" style="${style}"></ul>`)
  }

  /**
   * 目录
   * @return {[type]} [description]
   * background-image:url(images/icons/global-bar.png);
   */
  _dirButton() {
    const size = this._getSize(66, 44)
    const style = `width:${size.width}px;height:${size.height}px`
    const html = `<li class="xut-global-bar-dir" style="${style}"></li>`
    this.container.append(html)
  }

  /**
   * 封面
   * @return {[type]} [description]
   * background-image:url(images/icons/global-bar.png);
   */
  _coverButton() {
    const size = this._getSize(66, 44)
    const style = `width:${size.width}px;height:${size.height}px`
    const html = `<li class="xut-global-bar-cover" style="${style}"></li>`
    this.container.append(html)
  }

  /**
   * 上一页
   * @return {[type]} [description]
   */
  _prevButton() {
    const style = `width:32%;background:yellow`
    const html = `<li class="xut-global-bar-prev" style="${style}"></li>`
    this.container.append(html)
  }


  /**
   * 标题
   * @return {[type]} [description]
   */
  _titleButton() {
    const style = `width:16%;background:red`
    const html = `<li class="xut-global-bar-title" style="${style}"></li>`
    this.container.append(html)
  }


  /**
   * 下一页
   * @return {[type]} [description]
   */
  _nextButton() {
    const style = `width:22%;background:yellow`
    const html = `<li class="xut-global-bar-next" style="${style}"></li>`
    this.container.append(html)
  }


  /**
   * 讨论区
   * @return {[type]} [description]
   */
  _forumButton() {
    const style = `width:10%;background:red`
    const html = `<li class="xut-global-bar-forum" style="${style}"></li>`
    this.container.append(html)
  }

  /**
   * 页码
   * @return {[type]} [description]
   */
  _forumPage() {
    const style = `width:10%;background:blue`
    const html = `<li class="xut-global-bar-page" style="${style}"></li>`
    this.container.append(html)
  }

}

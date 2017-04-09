import { config } from '../config/index'
import { hash } from '../util/index'

const isIOS = Xut.plat.isIOS
const isBrowser = Xut.plat.isBrowser

/**
 * 获取翻页按钮位置
 * @return {[type]} [description]
 */
const getArrowStyle = function() {
  let height = config.iconHeight
  let styleText = `height:${height}px;width:${height}px`
  let settings = config.data.settings
  if (settings) {
    switch (settings.NavbarPos) {
      case 0:
        styleText += ';top:0';
        break; //顶部
      case 1:
        styleText += ';margin-top:' + (-height / 2) + 'px';
        break; //中间
      case 2:
        styleText += ';top:auto;bottom:0';
        break; //底部
      default:
        break;
    }
  }
  return styleText;
}

const gotoPrevSlide = function() {
  Xut.View.GotoPrevSlide();
}

const gotoNextSlide = function() {
  Xut.View.GotoNextSlide();
}


/**
 * 工具栏超类
 */
export default class Bar {

  constructor() {

    /**
     * 系统状态栏高度
     * 在ios浏览器中状态栏高度为0
     * @type {[type]}
     */
    this.super_barHeight = isIOS && !isBrowser ? 20 : 0

    const prop = config.proportion;
    const iconHeight = config.iconHeight;

    //获取高度缩放比
    //自动选择缩放比例
    this.super_propHeight = config.layoutMode == "horizontal" ? prop.width : prop.height;

    //获取图标高度
    //工具栏图标高度
    this.super_iconHeight = isIOS ? iconHeight : Math.round(this.super_propHeight * iconHeight)

    //应用标题
    this.appName = config.data.shortName

    //应用默认配置
    this.settings = config.data.settings
  }

  /**
   * 创建翻页按钮
   * @return {[type]} [description]
   */
  super_createArrows() {

    /**
     * 存放左右翻页按钮
     * @type {[type]}
     */
    this.arrows = hash()

    //是否使用自定义的翻页按钮: true /false
    //图标名称是客户端指定的：pageforward_'+appId+'.svg
    const isCustom = this.settings.customButton;

    let $str

    //动态图标，数据库定义的翻页图标
    //font字体画翻页图标
    if (isCustom) {
      $str = $(String.styleFormat(this._createIcon()))
    } else {
      $str = $(String.styleFormat(this._createArrow()))
    }
    const $left = $str.eq(0)
    const $right = $str.eq($str.length - 1) //存在文本节点

    this.arrows = {
      prev: {
        off: this._onArrow($left, gotoPrevSlide),
        el: $left,
        able: true
      },
      next: {
        off: this._onArrow($right, gotoNextSlide),
        el: $right,
        able: true
      }
    }

    this.$sceneNode.append($str)
  }

  _onArrow(el, callback) {
    el.on("mouseup touchend", e => {
      callback()
      return false
    })
    return function() {
      el.off()
      el = null
    }
  }

  _getArrowOption() {
    const style = getArrowStyle()
    const state = this.barStatus ? '' : 'hide'
    const height = config.iconHeight
    return {
      style,
      state,
      height
    }
  }

  /**
   * font字体版本：箭头翻页按钮
   * @return {[type]} [description]
   */
  _createArrow() {
    const option = this._getArrowOption()
    return `<div class="si-icon xut-flip-control xut-flip-control-left icon-angle-left ${option.state}"
                     style="${option.style};text-align:center;line-height:${option.height}px;font-size:4vh;">
                </div>
                <div class="si-icon xut-flip-control xut-flip-control-right icon-angle-right ${option.state}"
                     style="${option.style};text-align:center;line-height:${option.height}px;">
                </div>`
  }


  /**
   * 客户端指定：自定义翻页按钮
   * @return {[type]} [description]
   */
  _createIcon() {
    let style = getArrowStyle()
    let state = this.toolBarStatus ? '' : 'hide'

    //默认图标路径
    let leftStyle = `${style};background-image:url(images/icons/pageforward_${config.data.appId}.svg);background-size:cover`
    let rightStyle = `${style};background-image:url(images/icons/pageback_${config.data.appId}.svg);background-size:cover`

    return `<div name="prevArrow"
                     class="xut-flip-control xut-flip-control-left ${state}"
                     style="${leftStyle}">
               </div>
                <div name="nextArrow"
                     class="xut-flip-control xut-flip-control-right ${state}"
                     style="${rightStyle}">
                </div>`
  }


  /**
   * 针对单个按钮的显示隐藏处理
   * @param  {[type]} dir [next,prev]
   * @param  {[type]} status  [true/false]
   * @return {[type]}       [description]
   */
  _toggleArrow(dir, status) {
    if (!this.arrows) return
    var arrow = this.arrows[dir];
    //如果没有创建翻页按钮,则不处理
    if (!arrow) return;
    arrow.able = status;
    //如果人为隐藏了工具栏,则不显示翻页按钮
    if (this.hasTopBar && !this.toolBarStatus && status) {
      return;
    }
    arrow.el[status ? 'show' : 'hide']();
  }

  /**
   * 显示翻页按钮
   * @return {[type]}        [description]
   */
  _showArrow() {
    var arrows = this.arrows;
    for (var dir in arrows) {
      var arrow = arrows[dir];
      arrow.able && arrow.el.show();
    }
  }

  /**
   * 隐藏翻页按钮
   * @param  {[type]} unlock [description]
   * @return {[type]}        [description]
   */
  _hideArrow() {
    var arrows = this.arrows;
    for (var dir in arrows) {
      arrows[dir].el.hide();
    }
  }

  /**
   * 显示IOS系统工具栏
   *  iOS状态栏0=show,1=hide
   * @return {[type]} [description]
   */
  super_showSystemBar() {
    isIOS && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
  }


  /**
   * 隐藏IOS系统工具栏
   * @return {[type]} [description]
   */
  super_hideSystemBar() {
    isIOS && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
  }

  /**
   * 超类销毁
   * @return {[type]} [description]
   */
  super_destory() {
    if (this.arrows) {
      this.arrows.prev.off();
      this.arrows.next.off();
      this.arrows = null
    }
  }

  /**
   * 隐藏下一页按钮
   * @return {[type]} [description]
   */
  hideNext() {
    this._toggleArrow('next', false);
  }

  /**
   * 显示下一页按钮
   * @return {[type]} [description]
   */
  showNext() {
    this._toggleArrow('next', true);
  }


  /**
   * 隐藏上一页按钮
   * @return {[type]} [description]
   */
  hidePrev() {
    this._toggleArrow('prev', false);
  }


  /**
   * 显示上一页按钮
   * @return {[type]} [description]
   */
  showPrev() {
    this._toggleArrow('prev', true);
  }




  /**
   * [ 显示工具栏]
   * @param  {[type]} pointer [description]
   * @return {[type]}         [description]
   */
  _showToolBar(pointer) {
    switch (pointer) {
      case 'controlBar':
        this.showTopBar()
        break;
      case 'button':
        this._showArrow()
        this.Lock = false
        break;
      default:
        this.showTopBar()
        this._showArrow()
    }
  }

  /**
   * [ 隐藏工具栏]
   * @param  {[type]} pointer [description]
   * @return {[type]}         [description]
   */
  _hideToolBar(pointer) {
    switch (pointer) {
      case 'controlBar':
        this.hideTopBar()
        break;
      case 'button':
        this._hideArrow()
        this.Lock = false
        break;
      default:
        this.hideTopBar()
        this._hideArrow()
    }

  }


  /**
   * 切换状态
   * @param  {[type]} state   [description]
   * @param  {[type]} pointer [description]
   * @return {[type]}         [description]
   */
  toggle(state, pointer) {
    if (this.Lock) return
    this.Lock = true;
    switch (state) {
      case 'show':
        this._showToolBar(pointer);
        break;
      case 'hide':
        this._hideToolBar(pointer);
        break;
      default:
        //默认：工具栏显示隐藏互斥处理
        this.toolBarStatus ? this._hideToolBar(pointer) : this._showToolBar(pointer);
        break;
    }
  }


  /**
   * 重置翻页按钮,状态以工具栏为标准
   * @return {[type]} [description]
   */
  resetArrow() {
    this.toolBarStatus ? this._showArrow() : this._hideArrow();
  }



}

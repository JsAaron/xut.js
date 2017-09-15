import { config } from '../../config/index'
import { hash } from '../../util/index'

const isIOS = Xut.plat.isIOS
const isBrowser = Xut.plat.isBrowser

/**
 * 获取翻页按钮位置
 * @return {[type]} [description]
 */
const getArrowStyle = function () {
  let height = config.data.iconHeight
  let styleText = `height:${height}px;width:${height}px`
  let setTable = config.data.settings
  if (setTable) {
    switch (setTable.NavbarPos) {
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


/**
 * 工具栏超类
 */
export default class BarSuper {

  constructor(options) {

    if (options) {
      _.extend(this, options)
    }

    /**
     * 系统状态栏高度
     * 在ios浏览器中状态栏高度为0
     * @type {[type]}
     */
    this.$$barHeight = isIOS && !isBrowser ? 20 : 0

    //获取高度缩放比
    //自动选择缩放比例
    const prop = config.proportion;
    this.$$propHeight = config.layoutMode == "horizontal" ? prop.width : prop.height;

    //获取图标高度
    //工具栏图标高度
    const iconHeight = config.data.iconHeight;
    this.$$iconHeight = isIOS ? iconHeight : Math.round(this.$$propHeight * iconHeight)

    //应用标题
    this.$$appName = config.data.shortName

    //应用默认配置
    this.$$setTable = config.data.settings

    /*模板*/
    this._initState()
    this._initToolbar()
  }


  /////////////////////////////////////
  ///        超类私有方法
  /////////////////////////////////////

  _$$getArrowOption() {
    const style = getArrowStyle()
    const state = this.barStatus ? '' : 'hide'
    const height = config.data.iconHeight
    return {
      style,
      state,
      height
    }
  }

  /**
   * 客户端指定：自定义翻页按钮
   * @return {[type]} [description]
   */
  _$$createIcon() {
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
   * font字体版本：箭头翻页按钮
   */
  _$$createArrow() {
    const option = this._$$getArrowOption()
    return `<div class="si-icon xut-flip-control xut-flip-control-left xut-icon-angle-left ${option.state}"
                 style="${option.style};text-align:center;line-height:${option.height}px;font-size:4vh;">
            </div>
            <div class="si-icon xut-flip-control xut-flip-control-right xut-icon-angle-right ${option.state}"
                 style="${option.style};text-align:center;line-height:${option.height}px;">
            </div>`
  }

  /**
   * 绑定左右翻页事件响应
   */
  _$$bindArrow(el, callback) {
    el.on("mouseup touchend", e => {
      callback()
      return false
    })
    return function () {
      el.off()
      el = null
    }
  }

  /**
   * 显示工具栏
   */
  _$$showToolBar(pointer) {
    switch (pointer) {
      case 'controlBar':
        this._showTopBar()
        break;
      case 'button':
        this._$$showArrow()
        this.Lock = false
        break;
      default:
        this._showTopBar()
        this._$$showArrow()
    }
  }

  /**
   *  隐藏工具栏
   */
  _$$hideToolBar(pointer) {
    switch (pointer) {
      case 'controlBar':
        this._hideTopBar()
        break;
      case 'button':
        this._$$hideArrow()
        this.Lock = false
        break;
      default:
        this._hideTopBar()
        this._$$hideArrow()
    }
  }

  /**
   * 针对单个按钮的显示隐藏处理
   */
  _$$toggleArrow(dir, status) {
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


  /////////////////////////////////////
  ///       超类暴露给子类接口
  /////////////////////////////////////

  /**
   * 显示IOS系统工具栏
   *  iOS状态栏0=show,1=hide
   */
  _$$showSystemBar() {
    isIOS && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
  }

  /**
   * 隐藏IOS系统工具栏
   */
  _$$hideSystemBar() {
    isIOS && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
  }

  /**
   * 创建翻页按钮
   * @return {[type]} [description]
   */
  _$$createArrows() {

    /*存放左右翻页按钮*/
    this.arrows = hash()

    let $str

    //动态图标，数据库定义的翻页图标
    //font字体画翻页图标
    //是否使用自定义的翻页按钮: true /false
    //图标名称是客户端指定的：pageforward_'+appId+'.svg
    if (this.$$setTable.customButton) {
      $str = $(String.styleFormat(this._$$createIcon()))
    } else {
      $str = $(String.styleFormat(this._$$createArrow()))
    }
    const $left = $str.eq(0)
    const $right = $str.eq($str.length - 1) //存在文本节点

    this.arrows = {
      prev: {
        off: this._$$bindArrow($left, function () {
          Xut.View.GotoPrevSlide();
        }),
        el: $left,
        able: true
      },
      next: {
        off: this._$$bindArrow($right, function () {
          Xut.View.GotoNextSlide();
        }),
        el: $right,
        able: true
      }
    }

    this.$sceneNode.append($str)
  }

  /**
   * 显示翻页按钮
   */
  _$$showArrow() {
    var arrows = this.arrows;
    for (var dir in arrows) {
      var arrow = arrows[dir];
      arrow.able && arrow.el.show();
    }
  }

  /**
   * 隐藏翻页按钮
   */
  _$$hideArrow() {
    var arrows = this.arrows;
    for (var dir in arrows) {
      arrows[dir].el.hide();
    }
  }



  /////////////////////////////////////
  ///   对外接口，子类向上转型接口
  /////////////////////////////////////


  /**
   * 重置翻页按钮,状态以工具栏为标准
   */
  resetArrow() {
    this.toolBarStatus ? this._$$showArrow() : this._$$hideArrow();
  }

  /**
   * 隐藏导航栏
   */
  hideNavbar() {
    this.navbarObj && this.navbarObj.hide('hide')
  }


  /**
   * 隐藏下一页按钮
   */
  hideNext() {
    this._$$toggleArrow('next', false);
  }

  /**
   * 显示下一页按钮
   */
  showNext() {
    this._$$toggleArrow('next', true);
  }

  /**
   * 隐藏上一页按钮
   */
  hidePrev() {
    this._$$toggleArrow('prev', false);
  }

  /**
   * 显示上一页按钮
   */
  showPrev() {
    this._$$toggleArrow('prev', true);
  }


  /**
   * 切换状态
   */
  toggle(state, pointer) {
    if (this.Lock) return
    this.Lock = true;
    switch (state) {
      case 'show':
        this._$$showToolBar(pointer);
        break;
      case 'hide':
        this._$$hideToolBar(pointer);
        break;
      default:
        //默认：工具栏显示隐藏互斥处理
        this.toolBarStatus ? this._$$hideToolBar(pointer) : this._$$showToolBar(pointer);
        break;
    }
  }


  /**
   * 超类销毁
   */
  destroy() {
    /*销毁子类*/
    this._destroy();
    /*销毁自身*/
    if (this.arrows) {
      this.arrows.prev.off();
      this.arrows.next.off();
      this.arrows = null
    }
  }

}

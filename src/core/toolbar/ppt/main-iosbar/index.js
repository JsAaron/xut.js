/**
 * 系统工具栏
 * 主场景工具栏
 */
import BarSuper from '../super'
import Navbar from '../nav-bar/index'

import {
  createHomeIcon,
  createDirIcon,
  createTitle,
  createPageNumber,
  createHideToolbar,
  createCloseIcon
} from './str-conf'

import {
  hash,
  $on,
  $off,
  $handle,
  $target
} from '../../../util/index'

/**
 * 系统工具栏
 * 模拟ios风格
 */
export default class IosBar extends BarSuper {
  /**
      $sceneNode,
      arrowButton,
      pageTotal,
      currentPage,
      toolType
   */
  constructor(options) {
    super(options)
  }


  ////////////////////////
  ///  私有方法
  ///////////////////////

  _initState() {
    this.Lock = false //操作锁
    this.delay = 50 //动画延时
    this.hasTopBar = true //有顶部工具条
    this.currPageNode = null //当前页码对象
    this.$controlNode = this.$sceneNode.find('.xut-control-bar')
    this.eventElement = this.$controlNode[0] //绑定事件
  }

  /**
   * 初始化工具栏
   */
  _initToolbar() {
    //顶部工具栏可配置
    //0 禁止工具栏
    //1 系统工具栏 - 显示IOS系统工具栏
    if (_.some(this.toolType)) {
      this._initTopBar()
    }

    /*翻页按钮*/
    if (this.arrowButton) {
      this._$$createArrows()
    }
  }


  /**
   * 系统工具条的位置
   * position
   *     0 顶部
   *     1 底部
   */
  _barPostion(element, position) {
    if (position == 1) { //在底部
      element.css({
        bottom: 0,
        height: `${this.$$iconHeight}px`
      });
    } else {
      element.css({ //在顶部
        top: 0,
        height: `${this.$$iconHeight}px`,
        paddingTop: `${this.$$barHeight}`
      })
    }
  }


  /**
   * 初始化顶部工具栏
   */
  _initTopBar() {

    const $controlNode = this.$controlNode

    //工具栏的显示状态
    this.toolBarStatus = ($controlNode.css('display') === 'none') ? false : true

    //工具栏摆放位置
    this._barPostion($controlNode, this.$$setTable.ToolbarPos)


    let html = ''

    //首页按钮
    if (this.$$setTable.HomeBut) {
      html += createHomeIcon(this.$$iconHeight)
    }
    //目录按钮
    if (this.$$setTable.ContentBut) {
      html += createDirIcon(this.$$iconHeight)
    }
    //添加标题
    html += createTitle(this.$$iconHeight, this.$$appName);
    //工具栏隐藏按钮
    html += createHideToolbar(this.$$iconHeight);
    //关闭子文档
    if (this.$$setTable.CloseBut) {
      html += createCloseIcon(this.$$iconHeight);
    }
    //页码数
    if (this.$$setTable.PageBut) {
      html += createPageNumber(this.$$iconHeight, this.currentPage, this.pageTotal)
    }

    //显示
    Xut.nextTick($controlNode.append(String.styleFormat(html)))

    //当前页码标识
    this.currPageNode = $controlNode.find('.control-current-page')

    //事件
    $on(this.eventElement, { start: this })
  }

  /**
   * 跳转到主页
   */
  static goHomePage() {
    if (window.DUKUCONFIG) {
      Xut.Application.Suspend({
        processed: function () {
          Xut.Application.DropApp() //退出应用
        }
      });
      return;
    }
    //动作处理
    //如果有动作则关闭，否则直接跳转
    Xut.Application.Suspend({
      processed: function () {
        Xut.View.GotoSlide(1)
      }
    })
  }

  /**
   * 切换目录导航
   */
  _toggleNavBar() {
    const pageIndex = Xut.Presentation.GetPageIndex()
    if (this.navbarObj) {
      this.navbarObj.toggle(pageIndex)
    } else {
      this.navbarObj = new Navbar(pageIndex)
    }
  }


  /**
   * 相应事件
   */
  handleEvent(e) {
    $handle({
      start(e) {
        switch ($target(e).className) {
          //跳主页
          case "xut-control-backhome":
            IosBar.goHomePage();
            break;
            //切换目录
          case "xut-control-navbar":
            this._toggleNavBar();
            break;
            //隐藏工具栏
          case 'xut-control-hidebar':
            this._hideTopBar();
            break;
        }
      }
    }, this, e)
  }


  ////////////////////////
  ///  提供super接口
  ///////////////////////

  /**
   * 显示顶部工具栏
   */
  _showTopBar() {
    var self = this;

    if (this.toolBarStatus) {
      this.Lock = false;
      return;
    }
    this.$controlNode.css({
      'display': 'block',
      'opacity': 0
    });

    self.$controlNode && self.$controlNode.transition({
      'opacity': 1
    }, self.delay, 'in', function () {
      self.hideNavbar()
      self._$$showSystemBar()
      self.toolBarStatus = true
      self.Lock = false
    });
  }


  /**
   * 隐藏顶部工具栏
   */
  _hideTopBar() {
    var self = this;
    if (!this.toolBarStatus) {
      this.Lock = false;
      return;
    }
    this.$controlNode && this.$controlNode.transition({
      'opacity': 0
    }, self.delay, 'in', function () {
      self.hideNavbar()
      self.$controlNode.hide();
      self._$$hideSystemBar();
      self.toolBarStatus = false;
      self.Lock = false;
    });
  }


  /**
   * 销毁
   * @return {[type]} [description]
   */
  _destroy() {
    //目录导航
    this.navbarObj && this.navbarObj.destroy();
    //解除事件
    $off(this.eventElement)
    this.currPageNode = null;
    this.toolBarStatus = false
    this.$controlNode = null
    this.eventElement = null
  }


  ////////////////////////
  ///  外部接口
  ///////////////////////

  /**
   * 更新页码指示
   */
  updatePointer({ parentIndex }) {
    this.currPageNode && this.currPageNode.html(parentIndex + 1)
  }


}

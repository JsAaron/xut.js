import BarSuper from '../super'
import BookMark from './mark'
import { IScroll } from '../../../expand/iscroll'
import {
  $on,
  $off,
  $handle,
  $target,
  parseJSON
} from '../../../util/index'

/**
 * 阅读模式工具栏
 * @param options object
 * @demo {$sceneNode:页面容器,$controlNode:工具栏容器,...}
 * @desc 继承自Toolbar.js
 */
export default class BookBar extends BarSuper {

  /*
      arrowButton = false,
      sceneNode,
      toolType,
      pageTotal
   */
  constructor(options) {
    super(options)
  }


  ////////////////////////
  ///  私有方法
  ///////////////////////


  _initState() {
    //工具栏容器
    this.$controlNode = this.$sceneNode.find('.xut-control-bar');
    //是否有顶部工具栏
    this.hasTopBar = true
    this.Lock = false
    this.delay = 50

    //图书工具栏高度
    this.topBarHeight = this.$$iconHeight * 1.25
  }


  /**
   * 初始化
   */
  _initToolbar() {

    //工具栏的显示状态
    var display = this.$controlNode.css('display');
    this.barStatus = display == 'none' ? false : true;
    this._setToolbarStyle();

    this._createBackIcon();
    this._createDirIcon();
    this._createMarkIcon();

    // this._createStarIcon();

    //翻页按钮
    if (this.arrowButton) {
      this._$$createArrows();
    }

    //监听事件
    $on(this.$sceneNode, {
      end: this,
      cancel: this
    })
  }


  /**
   * 工具条的样式
   */
  _setToolbarStyle() {
    const height = this.topBarHeight

    //在顶部
    this.$controlNode.css({
      top: 0,
      height: height + 'px',
      paddingTop: this.$$barHeight + 'px', //系统工具栏占用的高度
      backgroundColor: 'rgba(0, 0, 0, 0.2)', //transparent
      fontSize: '0.625em',
      color: 'white'
    });

  }


  /**
   *  font版本：创建目录图标
   * @return {[type]} [description]
   */
  _createDirIcon() {
    var parent = document.createElement('div');
    var icon = document.createElement('div');
    var iconText = document.createElement('div');

    parent.style.width = '48px';
    parent.style.height = "100%";
    parent.style.float = "left";
    parent.style.marginLeft = "3vw";
    parent.style.cursor = "pointer";
    parent.style.position = "relative";

    icon.style.fontSize = "2.5vh";
    icon.style.color = "#fff";
    icon.className = 'xut-icon-th-list2';
    icon.style.position = "absolute";
    icon.style.bottom = this.$$iconHeight * 0.5 + 'px';

    iconText.innerHTML = '目录';
    iconText.className = "xut-book-dirFont"
    // iconText.style.height = "40%";
    // iconText.style.width = "100%";
    iconText.style.position = "absolute";
    iconText.style.bottom = "0";

    parent.appendChild(icon);
    parent.appendChild(iconText);
    this.$controlNode.append(parent)
  }


  /**
   * font版本：创建书签图标
   * @return {[type]} [description]
   */
  _createMarkIcon() {
    var parent = document.createElement('div');
    var icon = document.createElement('div');
    var iconText = document.createElement('div');

    parent.style.width = '48px';
    parent.style.height = "100%";
    parent.style.float = "left";
    parent.style.marginLeft = "1vw";
    parent.style.cursor = "pointer";
    parent.style.position = "relative";

    icon.style.fontSize = "2.5vh";
    icon.style.color = "#fff";
    icon.style.position = "absolute";
    icon.style.bottom = this.$$iconHeight * 0.5 + 'px';
    icon.className = 'xut-icon-bookmark2';

    iconText.innerHTML = '书签';
    iconText.className = "xut-book-markFont"
    //iconText.style.height = "40%";
    iconText.style.position = "absolute";
    iconText.style.bottom = "0";

    parent.appendChild(icon);
    parent.appendChild(iconText);
    this.$controlNode.append(parent)


  }

  /**
   * 创建评分图标
   */
  _createStarIcon(bar) {
    var icon = document.createElement('div');
    icon.innerHTML = '评分';
    icon.style.width = this.$$iconHeight + 'px';
    icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
    icon.className = 'xut-book-bar-star';
    this.$controlNode.append(icon)
  }


  /**
   * font字体版本：后退按钮
   * @return {[type]} [description]
   */
  _createBackIcon() {
    var icon = document.createElement('div');
    icon.style.width = this.topBarHeight + 'px';
    icon.style.lineHeight = this.topBarHeight + 'px';
    icon.style.color = "#fff";

    icon.className = 'xut-icon-angle-left xut-icon-book-bar';
    icon.style.fontSize = "6vh";
    this.$controlNode.append(icon)
  }



  /**
   * 创建目录菜单
   */
  _createDirMenu() {
    var self = this;
    var wrap = document.createElement('div');
    var mask = document.createElement('div');
    //添加遮层
    mask.className = 'xut-book-menu-mask';
    //获取内容
    this._getDirContent();
    wrap.className = 'xut-book-menu';
    wrap.innerHTML = '<ul>' + this.contentText + '</ul>';
    this.$sceneNode.append(wrap);
    //是否滚动
    this.isScrolled = false;

    //添加滚动条
    //url : http://iscrolljs.com/
    this.iscroll = IScroll(wrap, {
      scrollbars: 'custom',
      fadeScrollbars: true,
      scrollX: false
    });

    this.menu = wrap;

    this._setColor();

    this.iscroll.on('scrollStart', function(e) {
      self.isScrolled = true;
    });

    this.iscroll.on('scrollEnd', function(e) {
      self.isScrolled = false;
    });

    wrap.appendChild(mask);

  }


  /**
   *  显示目录菜单
   */
  _showDirMenu() {
    //获取当前页面
    var page = Xut.Presentation.GetPageRootNode('page')

    if (this.menu) {
      this.menu.style.display = 'block';
    } else {
      this._createDirMenu();
    }

    //添加模糊效果
    page.addClass('filter');
    this.page = page;

    //隐藏顶部工具栏
    this.$controlNode.hide();
    var iscroll = this.iscroll;
    //自动定位到上一位置
    if (iscroll.y > iscroll.wrapperHeight) {
      iscroll.scrollToElement(this.selectedChild);
    }
  }


  /**
   *  隐藏目录菜单
   */
  _hideDirMenu() {
    this.menu.style.display = 'none';
    //恢复顶部工具栏
    this.$controlNode.show();
    //移除模糊效果
    this.page.removeClass('filter');
  }


  /**
   *  创建目录内容
   */
  _getDirContent() {

    var Api = Xut.Presentation;
    var data = Api.GetAppSectionData();
    var sns = data[0];
    var seaonId = sns._id;
    var cids = Xut.data.Chapter;

    ////////////////////////////
    //针对book模式，合并了Season的参数 //
    //1 SeasonTitle
    //2 ChapterList列表的范围区间
    ////////////////////////////
    data = parseJSON(sns.parameter);

    if (!data) {
      console.log('book模式parameter数据出错')
      return;
    }

    //二级目录
    function secondaryDirectory(startCid, endCid) {
      var cid, str = '';
      for (startCid; startCid <= endCid; startCid++) {
        cid = cids.item(startCid - 1);
        if (cid && cid.chapterTitle) {
          str += '<section><a class="xut-book-menu-item" data-mark=' + seaonId + '-' + startCid + ' href="javascript:0">' + cid.chapterTitle + '</a></section>';
        }
      }
      return str;
    }

    var i = 0;
    var len = data.length;
    var li = '<li class="title"><center class="select">目录</center></li>';
    var seasonInfo, mark, seasonTitle, seaonId, startCid, endCid;

    for (i; i < len; i++) {
      seasonInfo = data[i];
      startCid = seasonInfo.ChapterList[0];
      endCid = seasonInfo.ChapterList[1];
      mark = seaonId + '-' + startCid;
      if (seasonInfo.SeasonTitle.length <= 0) continue;
      seasonTitle = seasonInfo.SeasonTitle || '第' + (i + 1) + '章';
      //第一级目录
      li += '<li>' +
        '<a class="xut-book-menu-item" data-mark="' + mark + '" href="javascript:0">' + seasonTitle + '</a>' +
        //第二级目录
        secondaryDirectory(startCid, endCid) +
        '</li>'
    }

    this.contentText = li;
  }


  /**
   * 突出显示点击颜色
   */
  _setColor(element) {
    if (this.selectedChild) {
      this.selectedChild.className = 'xut-book-menu-item';
    }
    if(!element || !this.menu){
      return
    }
    element = element || this.menu.querySelectorAll('li')[0].children[0];
    element.className = 'select';
    this.selectedChild = element;
  }


  /**
   * 跳转到指定书页
   */
  _turnToPage(target) {
    //忽略滚动点击
    if (this.isScrolled) return;
    this._setColor(target);
    this._hideDirMenu();
    var data = target.dataset.mark || '';
    if (data) {
      data = data.split('-');
      Xut.View.LoadScenario({
        'seasonId': data[0],
        'chapterId': data[1]
      })
    }
  }


  /**
   * 显示书签
   */
  _showBookMark() {
    if (this.bookMark) {
      this.bookMark.restore();
    } else {
      var pageData = Xut.Presentation.GetPageData();
      this.bookMark = new BookMark({
        parent: this.$sceneNode,
        seasonId: pageData.seasonId,
        pageId: pageData._id
      })
    }
  }

  /**
   * 返回首页
   */
  _goBack() {
    var self = this;
    Xut.Application.Suspend({
      processed() {
        Xut.View.GotoSlide(1) //调整到首页
        self._setColor();
      }
    });
  }


  /**
   * 相应事件
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleEvent(e) {
    var target = e.target || e.srcElement;
    $handle({
      end(e) {
        switch ($target(e).className) {
          case 'xut-icon-angle-left xut-icon-book-bar':
            this._goBack();
            //返回
            break;
          case 'xut-icon-th-list2':
          case 'xut-book-dirFont':
            //目录
            this._showDirMenu();
            break;
          case 'xut-icon-bookmark2':
          case 'xut-book-markFont':
            //书签
            this._showBookMark();
            break;
          case 'xut-book-bar-star':
            //评分
            break;
          case 'xut-book-menu-item':
            //跳转
            this._turnToPage(target);
            break;
          case 'xut-book-menu-mask':
          case 'select':
            this._hideDirMenu();
            break;
          default:
            // console.log(name+':undefined')
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
   * @return {[type]} [description]
   */
  _showTopBar() {
    var that = this;

    if (this.barStatus) {
      this.Lock = false;
      return;
    }

    this.$controlNode.css({
      'display': 'block',
      'opacity': 0
    });

    setTimeout(function() {
      that.$controlNode.transition({
        'opacity': 1
      }, that.delay, 'linear', function() {
        that._$$showSystemBar();
        that.barStatus = true;
        that.Lock = false;
      });
    }, 50);
  }


  /**
   * 隐藏顶部工具栏
   * @return {[type]} [description]
   */
  _hideTopBar() {
    var that = this;

    if (!this.barStatus) {
      this.Lock = false;
      return;
    }

    this.$controlNode.transition({
      'opacity': 0
    }, that.delay, 'linear', function() {
      that.$controlNode.hide();
      that._$$hideSystemBar();
      that.barStatus = false;
      that.Lock = false;
    });
  }


  /**
   * 销毁
   */
  _destroy() {
    this.iscroll && this.iscroll.destroy();
    this.bookMark && this.bookMark.destroy();
    $off(this.$sceneNode)
    this.iscroll = null;
    this.menu = null;
    this.page = null;
  }


  ////////////////////////
  ///  对外接口
  ///////////////////////

  /**
   * 更新页码
   */
  updatePointer() {
    //预留
  }


}

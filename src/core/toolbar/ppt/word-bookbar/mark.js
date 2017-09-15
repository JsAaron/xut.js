/**
 * 书签栏
 * 加入这个书签功能后，可以让用户自由选择哪页是需要保存记录的
 * @param options object
 * @example {parent:页面容器,pageId:chapterId,seasonId:seasionId}
 */
import { config } from '../../../config/index'
import {
  $on,
  $off,
  $handle,
  $target,
  $setStorage,
  $getStorage,
  $removeStorage
} from '../../../util/index'


/**
 * 行高
 * @type {[type]}
 */
let sLineHeiht = parseInt($('body').css('font-size')) || 16 //行高

/**
 * 书签缓存
 */
let BOOKCACHE


export default class Mark {

  constructor({
    parent,
    pageId,
    seasonId
  } = {}) {
    this.parent = parent;
    this.pageId = pageId;
    this.seasonId = seasonId;

    let visualSize = config.visualSize
    this.sHeight = visualSize.height
    this.sWidth = visualSize.width

    //是否已存储
    this.isStored = false;
    this.init();
  }


  /**
   * 初始化
   * @return {[type]} [description]
   */
  init() {
    var $bookMark = this.createBookMarkFont(),
      dom = this.parent[0],
      that = this;

    this.parent.append($bookMark);
    this.bookMarkMenu = $bookMark.eq(0);
    //显示书签
    setTimeout(function() {
      that.restore();
    }, 20);
    //获取历史记录
    BOOKCACHE = this.getHistory();

    //邦定用户事件
    $on(dom, {
      end: this
    })
  }



  /**
   * 创建书签(font版本)
   * @return {[object]} [jquery生成的dom对象]
   */
  createBookMarkFont() {
    const height = sLineHeiht * 3 // menu的高为3em
    const sHeight = this.sHeight
    const box =
      `<div class="xut-bookmark-menu"
               style="width:100%;height:${height}px;left:0;top:${sHeight}px;">
              <div class="xut-bookmark-wrap">
                <div class="xut-bookmark-add">加入书签</div>
                <div class="xut-bookmark-off xut-icon-chevron-down" style="vertical-align:bottom;"></div>
                <div class="xut-bookmark-view">书签记录</div>
              </div>
            </div>
            <div class="xut-bookmark-list" style="display:none;width:100%;height:${sHeight}px;">
              <ul class="xut-bookmark-head">
                <li class="xut-bookmark-back">返回</li>
                <li>书签</li>
              </ul>
              <ul class="xut-bookmark-body"></ul>
            </div>`;
    this.markHeight = height;
    return $(box);
  }


  /**
   * 生成书签列表
   * @return {[type]} [description]
   */
  createMarkList() {
    var tmp, seasonId, pageId,
      list = '',
      box = '',
      self = this;

    //取历史记录
    _.each(BOOKCACHE, function(mark) {
      tmp = mark.split('-');
      seasonId = tmp[0];
      pageId = tmp[1];
      mark = self.getMarkId(seasonId, pageId);
      list +=
        `<li>
               <a data-mark="${mark}" class="xut-bookmark-id" href="javascript:0">第${pageId}页</a>
               <a class="xut-bookmark-del" data-mark="${mark}" href="javascript:0">X</a>
             </li>`;
    })

    return list;
  }


  /**
   * 创建存储标签
   * 存储格式 seasonId-pageId
   * @return {string} [description]
   */
  getMarkId(seasonId, pageId) {
    return seasonId + '-' + pageId;
  }


  /**
   * 获取历史记录
   * @return {[type]} [description]
   */
  getHistory() {
    var mark = $getStorage('bookMark');
    if (mark) {
      return mark.split(',');
    }
    return [];
  }


  /**
   * 添加书签
   * @return {[type]} [description]
   */
  addBookMark() {
    var key;

    this.updatePageInfo();
    key = this.getMarkId(this.seasonId, this.pageId);

    //避免重复缓存
    if (BOOKCACHE.indexOf(key) > -1) {
      return;
    }
    BOOKCACHE.push(key)
    $setStorage('bookMark', BOOKCACHE);
  }


  /**
   * 更新页信息
   *  针对母板层上的书签
   */
  updatePageInfo() {
    var pageData = Xut.Presentation.GetPageData();
    this.pageId = pageData._id;
    this.seasonId = pageData.seasonId;
  }


  /**
   * 删除书签
   * @param {object} [key] [事件目标对象]
   * @return {[type]} [description]
   */
  delBookMark(target) {
    if (!target || !target.dataset) return;

    var key = target.dataset.mark,
      index = BOOKCACHE.indexOf(key);

    BOOKCACHE.splice(index, 1);
    $setStorage('bookMark', BOOKCACHE);

    if (BOOKCACHE.length == 0) {
      $removeStorage('bookMark');
    }

    //移除该行
    $(target).parent().remove();
  }


  /**
   * 显示书签
   * @param {object} [target] [事件目标对象]
   * @return {[type]} [description]
   */
  viewBookMark(target) {
    var $bookMarkList,
      list = this.createMarkList();

    if (this.bookMarkList) {
      $bookMarkList = this.bookMarkList;
    } else {
      $bookMarkList = $(target).parent().parent().next();
    }
    //更新书签内容
    $bookMarkList.find('.xut-bookmark-body').html(list);
    this.bookMarkList = $bookMarkList;
    $bookMarkList.fadeIn();
  }


  /**
   * 点击放大效果
   * @param  {[object]} target [事件目标对象]
   * @return {[type]}      [description]
   */
  iconManager(target) {
    var $icon = this.bookMarkIcon = $(target),
      restore = this.iconRestore;
    $icon.css({
      'transform': 'scale(1.2)',
      'transition-duration': '500ms'
    })[0].addEventListener(Xut.style.transitionEnd, restore.bind(this), false);

  }


  /**
   * 复原按钮
   * @return {[type]} [description]
   */
  iconRestore() {
    this.bookMarkIcon.css('transform', '');
  }


  /**
   * 跳转到书签页
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  goBookMark(target) {
    if (!target || !target.dataset) return;

    var key = target.dataset.mark.split('-')
    var seasonId = Number(key[0])
    var pageId = Number(key[1])

    this.updatePageInfo();
    //关闭书签列表
    this.backBookMark();

    //忽略当前页的跳转
    if (this.pageId == pageId && this.seasonId == seasonId) {
      return;
    }

    Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': pageId
    })

  }


  /**
   * 书签回退键
   * @return {[type]} [description]
   */
  backBookMark() {
    this.bookMarkList.fadeOut();
  }


  /**
   * 邦定事件
   * @param  {[type]} evt [事件]
   * @return {[type]}     [description]
   */
  handleEvent(e) {
    var target = e.target;
    $handle({
      end(e) {
        switch ($target(e).className) {
          //加入书签
          case 'xut-bookmark-add':
            this.addBookMark();
            this.iconManager(target);
            break;
            //显示书签记录
          case 'xut-bookmark-view':
            this.viewBookMark(target);
            this.iconManager(target);
            break;
            //关闭书签
          case 'xut-bookmark-off':
          case 'xut-bookmark-off xut-icon-chevron-down':
            this.closeBookMark(target);
            break;
            //返回书签主菜单
          case 'xut-bookmark-back':
            this.backBookMark();
            break;
            //删除书签记录
          case 'xut-bookmark-del':
            this.delBookMark(target);
            break;
            //跳转到书签页
          case 'xut-bookmark-id':
            this.goBookMark(target);
            break;
          default:
            //console.log(target.className)
            break;
        }
      }
    }, this, e)

  }


  /**
   * 关闭书签菜单
   * @return {[type]} [description]
   */
  closeBookMark(target) {
    Xut.style.setTranslate({
      speed: 1000,
      node: this.bookMarkMenu
    })
  }


  /**
   * 恢复书签菜单
   */
  restore() {
    Xut.style.setTranslate({
      y: (-this.markHeight),
      speed: 1000,
      node: this.bookMarkMenu
    })
  }


  /**
   * 销毁书签
   * @return {[type]} [description]
   */
  destroy() {

    $off(this.parent)

    //菜单部分
    if (this.bookMarkMenu) {
      this.bookMarkMenu.remove();
      this.bookMarkMenu = null;
    }

    //列表部分
    if (this.bookMarkList) {
      this.bookMarkList.remove();
      this.bookMarkList = null;
    }

    //按钮效果
    if (this.bookMarkIcon) {
      this.bookMarkIcon[0].removeEventListener(Xut.style.transitionEnd, this.iconRestore, false);
      this.bookMarkIcon = null;
    }

    this.parent = null;
  }

}

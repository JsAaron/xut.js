/**
 * 搜索栏
 * 方便用户更加便捷的找到所需要的信息
 *
 */

import { $on, $off } from '../../../util/event'

//图标
var icons = {
  search: 'images/icons/search.svg',
  clear: 'images/icons/clear.svg',
  exit: 'images/icons/exit.svg'
};

export function SearchBar(options) {
  //父容器
  this.parent = options.parent;
  //提示信息
  this.tips = options.tips;
  this.init();
}

/**
 * 初始化
 * @return {[type]} [description]
 */
SearchBar.prototype.init = function() {
  var $box = this.searchForm(),
    dom = this.parent[0];

  this.parent.append($box);
  this.searchBox = $box;
  this.resultBox = $box.find('.xut-search-result');
  this.input = $box.find('.xut-search-input');
  this.searchBtn = $box.find('.xut-search-btn');

  //用户操作事件邦定
  $on(dom, {
    end: this,
    cancel: this
  })

  //即时搜索
  dom.addEventListener('keyup', this, false);
}

/**
 * 创建搜索框
 * @return {[object]} [jquery生成的dom对象]
 */
SearchBar.prototype.searchForm = function() {
  var W = window.innerWidth * 0.3,
    H = window.innerHeight;
  var text = this.tips || '请在搜索框中输入要搜索的关键字';

  var box = '<div class="xut-form-search">' +
    '<div class="xut-form-search-wrap">' +
    '<div style="height:17%;">' +
    '<div style="height:20%"></div>' +
    '<div class="xut-search-row">' +
    '<input type="text" class="xut-search-input">' +
    '<div class="xut-search-btn" style="background-image: url(' + icons.search + ')"></div>' +
    '</div>' +
    '<p class="xut-search-tips" style="line-height:' + Math.round(H * 0.06) + 'px">' + text + '</p>' +
    '</div>' +
    '<div style="height:76%">' +
    '<ul class="xut-search-result"></ul>' +
    '</div>' +
    '<div style="height:7%">' +
    '<div class="xut-search-exit" style="background-image: url(' + icons.exit + ')"></div>' +
    '</div>' +
    '</div></div>';

  var $box = $(box);

  $box.css('width', W < 200 ? 200 : W)

  return $box;
}


/**
 * 搜索
 * @param {string} [keyword] [搜索关键字]
 */
SearchBar.prototype.search = function(keyword) {
  var data = Xut.data.Chapter,
    ln = data.length,
    list = '',
    rs, pageId, seasonId;

  if(!keyword) {
    this.resultBox.html('');
    return;
  }

  for(var i = 0; i < ln; i++) {
    rs = data.item(i);
    if(rs.chapterTitle.indexOf(keyword) > -1) {
      pageId = rs._id;
      seasonId = rs.seasonId;
      list += '<li><a class="xut-search-link" data-mark="' + seasonId + '-' + pageId + '" href="javascript:0">' + rs.chapterTitle + '</a></li>';
    }
  }

  this.resultBox.html(list);
}

/**
 * 切换搜索按钮图标
 * @param  {[type]} icon [图标路径]
 * @return {[type]}      [description]
 */
SearchBar.prototype.iconManager = function(icon) {
  if(this.isChange) {
    this.searchBtn.css('background-image', 'url(' + icon + ')');
  }
}

/**
 * 跳转到搜索结果页
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
SearchBar.prototype.searchLink = function(target) {
  if(!target || !target.dataset) return;
  var mark = target.dataset.mark.split('-'),
    seasonId = mark[0],
    pageId = mark[1];

  Xut.View.LoadScenario({
    'seasonId': seasonId,
    'chapterId': pageId
  })
}

/**
 * 邦定事件
 * @param  {[type]} evt [事件]
 * @return {[type]}     [description]
 */
SearchBar.prototype.handleEvent = function(evt) {
  var target = evt.target;
  switch(target.className) {
    case 'xut-search-btn':
      //点击搜索
      this.search(this.input.val());
      this.isChange = true;
      this.iconManager(icons.clear);
      break;
    case 'xut-search-input':
      //实时搜索
      this.search(target.value);
      //还原按钮图标
      this.iconManager(icons.search);
      this.isChange = false;
      break;
    case 'xut-search-exit':
      //关闭搜索框
      this.exit();
      break;
    case 'xut-search-link':
      //跳转
      this.searchLink(target);
      break;
    default:
      break;
  }
}

/**
 * 关闭搜索框
 * @return {[type]} [description]
 */
SearchBar.prototype.exit = function() {
  this.input.val('');
  this.resultBox.empty();
  this.searchBox.hide();
}

/**
 * 恢复搜索框
 */
SearchBar.prototype.restore = function() {
  var searchBox = this.searchBox;
  searchBox && searchBox.show();
}

/**
 * 销毁搜索框
 * @return {[type]} [description]
 */
SearchBar.prototype.destroy = function() {
  var dom = this.parent[0];

  $off(dom)
  dom.removeEventListener('keyup', this, false);

  this.searchBox.remove();
  this.searchBox = null;
  this.resultBox = null;
  this.searchBtn = null;
  this.input = null;
  this.parent = null;
}

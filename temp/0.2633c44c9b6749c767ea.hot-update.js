webpackHotUpdate(0,{

/***/ 147:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BookBar = undefined;

	var _bookmark = __webpack_require__(148);

	var _toolBar = __webpack_require__(23);

	var _index = __webpack_require__(2);

	var _tap = __webpack_require__(5);

	/**
	 * 阅读模式工具栏
	 * @param options object
	 * @demo {container:页面容器,controlBar:工具栏容器,...}
	 * @desc 继承自Toolbar.js
	 */
	var BookBar = _toolBar.ToolBar.extend({
	    init: function init(options) {
	        //左右箭头
	        this.arrows = {};
	        //工具栏父容器
	        this.container = options.container;
	        //工具栏容器
	        this.controlBar = options.controlBar;
	        this.pageMode = options.pageMode;
	        //是否有顶部工具栏
	        this.hasTopBar = true;
	        this.Lock = false;
	        this.delay = 50;
	        //图书工具栏高度
	        this.topBarHeight = this.iconHeight * 1.25;

	        //配置属性
	        //config
	        this.config = Xut.config;
	        this.initConfig(this.config);

	        this.initTool();
	    }
	});

	/**
	 * 初始化
	 */
	BookBar.prototype.initTool = function () {
	    //工具栏的显示状态
	    var display = this.controlBar.css('display');
	    this.barStatus = display == 'none' ? false : true;
	    this.setToolbarStyle();
	    this.createBackIcon();
	    this.createDirIcon();
	    this.createMarkIcon();
	    // this.createStarIcon();

	    //翻页按钮
	    if (this.pageMode == 2) {
	        this.createArrows();
	    }

	    //监听事件
	    (0, _tap.bindTap)(this.container[0], {
	        end: this
	    });
	};

	/**
	 * 工具条的样式
	 */
	BookBar.prototype.setToolbarStyle = function () {
	    var height = this.topBarHeight,
	        TOP = this.barHeight; //系统工具栏占用的高度

	    //在顶部
	    this.controlBar.css({
	        top: 0,
	        height: height + 'px',
	        paddingTop: TOP + 'px',
	        backgroundColor: 'rgba(0, 0, 0, 0.2)', //transparent
	        fontSize: '0.625em',
	        color: 'white'
	    });
	};

	/**
	 * 更新页码
	 */
	BookBar.prototype.updatePointer = function () {}
	//预留


	/**
	 * 创建目录图标
	 */
	;BookBar.prototype.createDirIcon = function (bar) {
	    var icon = document.createElement('div');
	    icon.innerHTML = '目录';
	    icon.style.width = this.iconHeight + 'px';
	    icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	    icon.className = 'xut-book-bar-dir';
	    this.controlBar.append(icon);
	};

	/**
	 * 创建书签图标
	 * @param  {[type]} bar [description]
	 * @return {[type]}     [description]
	 */
	BookBar.prototype.createMarkIcon = function (bar) {
	    var icon = document.createElement('div');
	    icon.innerHTML = '书签';
	    icon.style.width = this.iconHeight + 'px';
	    icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	    icon.className = 'xut-book-bar-mark';
	    this.controlBar.append(icon);
	};

	/**
	 * 创建评分图标
	 */
	BookBar.prototype.createStarIcon = function (bar) {
	    var icon = document.createElement('div');
	    icon.innerHTML = '评分';
	    icon.style.width = this.iconHeight + 'px';
	    icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	    icon.className = 'xut-book-bar-star';
	    this.controlBar.append(icon);
	};

	/**
	 * 后退按钮
	 * @return {[type]} [description]
	 */
	BookBar.prototype.createBackIcon = function () {
	    var icon = document.createElement('div');
	    icon.style.width = this.topBarHeight + 'px';
	    icon.className = 'xut-book-bar-back';
	    this.controlBar.append(icon);
	};

	/**
	 * 显示顶部工具栏
	 * @return {[type]} [description]
	 */
	BookBar.prototype.showTopBar = function () {
	    var that = this;

	    if (this.barStatus) {
	        this.Lock = false;
	        return;
	    }

	    this.controlBar.css({
	        'display': 'block',
	        'opacity': 0
	    });

	    setTimeout(function () {
	        that.controlBar.animate({
	            'opacity': 1
	        }, that.delay, 'linear', function () {
	            that.showSystemBar();
	            that.barStatus = true;
	            that.Lock = false;
	        });
	    }, 50);
	};

	/**
	 * 隐藏顶部工具栏
	 * @return {[type]} [description]
	 */
	BookBar.prototype.hideTopBar = function () {
	    var that = this;

	    if (!this.barStatus) {
	        this.Lock = false;
	        return;
	    }

	    this.controlBar.animate({
	        'opacity': 0
	    }, that.delay, 'linear', function () {
	        that.controlBar.hide();
	        that.hideSystemBar();
	        that.barStatus = false;
	        that.Lock = false;
	    });
	};

	/**
	 * 创建目录菜单
	 */
	BookBar.prototype.createDirMenu = function () {
	    var self = this;
	    var wrap = document.createElement('div');
	    var mask = document.createElement('div');
	    //添加遮层
	    mask.className = 'xut-book-menu-mask';
	    //获取内容
	    this.getDirContent();
	    wrap.className = 'xut-book-menu';
	    wrap.innerHTML = '<ul>' + this.contentText + '</ul>';
	    this.container.append(wrap);
	    //是否滚动
	    this.isScrolled = false;

	    //添加滚动条
	    //url : http://iscrolljs.com/
	    this.iscroll = new iScroll(wrap, {
	        scrollbars: true,
	        fadeScrollbars: true,
	        scrollX: false
	    });

	    this.menu = wrap;

	    this.setColor();

	    this.iscroll.on('scrollStart', function (e) {
	        self.isScrolled = true;
	    });

	    this.iscroll.on('scrollEnd', function (e) {
	        self.isScrolled = false;
	    });

	    wrap.appendChild(mask);
	};

	/**
	 *  显示目录菜单
	 */
	BookBar.prototype.showDirMenu = function () {
	    //获取当前页面
	    var page = Xut.Presentation.GetPageElement();

	    if (this.menu) {
	        this.menu.style.display = 'block';
	    } else {
	        this.createDirMenu();
	    }

	    //添加模糊效果
	    page.addClass('filter');
	    this.page = page;

	    //隐藏顶部工具栏
	    this.controlBar.hide();
	    var iscroll = this.iscroll;
	    //自动定位到上一位置
	    if (iscroll.y > iscroll.wrapperHeight) {
	        iscroll.scrollToElement(this.selectedChild);
	    }
	};

	/**
	 *  隐藏目录菜单
	 */
	BookBar.prototype.hideDirMenu = function () {
	    this.menu.style.display = 'none';
	    //恢复顶部工具栏
	    this.controlBar.show();
	    //移除模糊效果
	    this.page.removeClass('filter');
	};

	/**
	 *  创建目录内容
	 */
	BookBar.prototype.getDirContent = function () {

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
	    data = (0, _index.parseJSON)(sns.parameter);

	    if (!data) {
	        console.log('book模式parameter数据出错');
	        return;
	    }

	    //二级目录
	    function secondaryDirectory(startCid, endCid) {
	        var cid,
	            str = '';
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
	        li += '<li>' + '<a class="xut-book-menu-item" data-mark="' + mark + '" href="javascript:0">' + seasonTitle + '</a>' +
	        //第二级目录
	        secondaryDirectory(startCid, endCid) + '</li>';
	    }

	    this.contentText = li;
	};

	/**
	 * 突出显示点击颜色
	 */
	BookBar.prototype.setColor = function (element) {
	    if (this.selectedChild) {
	        this.selectedChild.className = 'xut-book-menu-item';
	    }

	    element = element || this.menu.querySelectorAll('li')[1].children[0];
	    element.className = 'select';
	    this.selectedChild = element;
	};

	/**
	 * 跳转到指定书页
	 */
	BookBar.prototype.turnToPage = function (target) {
	    //忽略滚动点击
	    if (this.isScrolled) return;
	    this.setColor(target);
	    this.hideDirMenu();
	    var data = target.dataset.mark || '';
	    if (data) {
	        data = data.split('-');
	        Xut.View.LoadScenario({
	            'scenarioId': data[0],
	            'chapterId': data[1]
	        });
	    }
	};

	/**
	 * 显示书签
	 */
	BookBar.prototype.showBookMark = function () {
	    if (this.bookMark) {
	        this.bookMark.restore();
	    } else {
	        var pageData = Xut.Presentation.GetPageData();
	        this.bookMark = new _bookmark.BookMark({
	            parent: this.container,
	            seasonId: pageData.seasonId,
	            pageId: pageData._id
	        });
	    }
	};

	/**
	 * 返回首页
	 */
	BookBar.prototype.goBack = function () {
	    var self = this;
	    Xut.Application.Suspend({
	        dispose: function dispose(promptMessage) {
	            //停止热点动作
	            //promptMessage('再按一次将跳至首页！')
	        },
	        processed: function processed() {
	            Xut.View.GotoSlide(1); //调整到首页
	            self.setColor();
	        }
	    });
	};

	/**
	 * 事件处理
	 */
	BookBar.prototype.handleEvent = function (e) {

	    var target = e.target || e.srcElement;

	    var name = target.className;

	    switch (name) {
	        case 'xut-book-bar-back':
	            this.goBack();
	            //返回
	            break;
	        case 'xut-book-bar-dir':
	            //目录
	            this.showDirMenu();
	            break;
	        case 'xut-book-bar-mark':
	            //书签
	            this.showBookMark();
	            break;
	        case 'xut-book-bar-star':
	            //评分
	            break;
	        case 'xut-book-menu-item':
	            //跳转
	            this.turnToPage(target);
	            break;
	        case 'xut-book-menu-mask':
	        case 'select':
	            this.hideDirMenu();
	            break;
	        default:
	            // console.log(name+':undefined')
	            break;
	    }
	};

	/**
	 * 销毁
	 */
	BookBar.prototype.destroy = function () {
	    this.iscroll && this.iscroll.destroy();
	    this.bookMark && this.bookMark.destroy();
	    var ele = this.container[0];
	    ele.removeEventListener('touchend', this, false);
	    ele.removeEventListener('mouseup', this, false);
	    this.iscroll = null;
	    this.menu = null;
	    this.page = null;
	};

	exports.BookBar = BookBar;

/***/ }

})
//# sourceMappingURL=0.2633c44c9b6749c767ea.hot-update.js.map
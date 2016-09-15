webpackHotUpdate(0,{

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bookmark = __webpack_require__(170);

	var _index = __webpack_require__(2);

	var _tap = __webpack_require__(5);

	var _bar = __webpack_require__(169);

	var _bar2 = _interopRequireDefault(_bar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * 阅读模式工具栏
	 * @param options object
	 * @demo {container:页面容器,controlBar:工具栏容器,...}
	 * @desc 继承自Toolbar.js
	 */
	var BookBar = function (_Bar) {
	    _inherits(BookBar, _Bar);

	    function BookBar() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var pageMode = _ref.pageMode;
	        var container = _ref.container;
	        var controlBar = _ref.controlBar;

	        _classCallCheck(this, BookBar);

	        //左右箭头
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BookBar).call(this));

	        _this.arrows = {};

	        //工具栏父容器
	        _this.container = container;

	        //工具栏容器
	        _this.controlBar = controlBar;

	        _this.pageMode = pageMode;

	        //是否有顶部工具栏
	        _this.hasTopBar = true;
	        _this.Lock = false;
	        _this.delay = 50;

	        //图书工具栏高度
	        _this.topBarHeight = _this.iconHeight * 1.25;

	        //配置属性
	        _this.initConfig();

	        _this.initTool();
	        return _this;
	    }

	    /**
	     * 初始化
	     */


	    _createClass(BookBar, [{
	        key: 'initTool',
	        value: function initTool() {
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
	        }

	        /**
	         * 工具条的样式
	         */

	    }, {
	        key: 'setToolbarStyle',
	        value: function setToolbarStyle() {
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
	        }

	        /**
	         * 更新页码
	         */

	    }, {
	        key: 'updatePointer',
	        value: function updatePointer() {}
	        //预留


	        /**
	         * 创建目录图标
	         */

	    }, {
	        key: 'createDirIcon',
	        value: function createDirIcon(bar) {
	            var icon = document.createElement('div');
	            icon.innerHTML = '目录';
	            icon.style.width = this.iconHeight + 'px';
	            icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	            icon.className = 'xut-book-bar-dir';
	            this.controlBar.append(icon);
	        }

	        /**
	         * 创建书签图标
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'createMarkIcon',
	        value: function createMarkIcon(bar) {
	            var icon = document.createElement('div');
	            icon.innerHTML = '书签';
	            icon.style.width = this.iconHeight + 'px';
	            icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	            icon.className = 'xut-book-bar-mark';
	            this.controlBar.append(icon);
	        }

	        /**
	         * 创建评分图标
	         */

	    }, {
	        key: 'createStarIcon',
	        value: function createStarIcon(bar) {
	            var icon = document.createElement('div');
	            icon.innerHTML = '评分';
	            icon.style.width = this.iconHeight + 'px';
	            icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
	            icon.className = 'xut-book-bar-star';
	            this.controlBar.append(icon);
	        }

	        /**
	         * 后退按钮
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createBackIcon',
	        value: function createBackIcon() {
	            var icon = document.createElement('div');
	            icon.style.width = this.topBarHeight + 'px';
	            icon.className = 'xut-book-bar-back';
	            this.controlBar.append(icon);
	        }

	        /**
	         * 显示顶部工具栏
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'showTopBar',
	        value: function showTopBar() {
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
	        }

	        /**
	         * 隐藏顶部工具栏
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'hideTopBar',
	        value: function hideTopBar() {
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
	        }

	        /**
	         * 创建目录菜单
	         */

	    }, {
	        key: 'createDirMenu',
	        value: function createDirMenu() {
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
	        }

	        /**
	         *  显示目录菜单
	         */

	    }, {
	        key: 'showDirMenu',
	        value: function showDirMenu() {
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
	        }

	        /**
	         *  隐藏目录菜单
	         */

	    }, {
	        key: 'hideDirMenu',
	        value: function hideDirMenu() {
	            this.menu.style.display = 'none';
	            //恢复顶部工具栏
	            this.controlBar.show();
	            //移除模糊效果
	            this.page.removeClass('filter');
	        }

	        /**
	         *  创建目录内容
	         */

	    }, {
	        key: 'getDirContent',
	        value: function getDirContent() {

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
	        }

	        /**
	         * 突出显示点击颜色
	         */

	    }, {
	        key: 'setColor',
	        value: function setColor(element) {
	            if (this.selectedChild) {
	                this.selectedChild.className = 'xut-book-menu-item';
	            }

	            element = element || this.menu.querySelectorAll('li')[1].children[0];
	            element.className = 'select';
	            this.selectedChild = element;
	        }

	        /**
	         * 跳转到指定书页
	         */

	    }, {
	        key: 'turnToPage',
	        value: function turnToPage(target) {
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
	        }

	        /**
	         * 显示书签
	         */

	    }, {
	        key: 'showBookMark',
	        value: function showBookMark() {
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
	        }

	        /**
	         * 返回首页
	         */

	    }, {
	        key: 'goBack',
	        value: function goBack() {
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
	        }

	        /**
	         * 事件处理
	         */

	    }, {
	        key: 'handleEvent',
	        value: function handleEvent(e) {

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
	        }

	        /**
	         * 销毁
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.iscroll && this.iscroll.destroy();
	            this.bookMark && this.bookMark.destroy();
	            var ele = this.container[0];
	            ele.removeEventListener('touchend', this, false);
	            ele.removeEventListener('mouseup', this, false);
	            this.iscroll = null;
	            this.menu = null;
	            this.page = null;
	        }
	    }]);

	    return BookBar;
	}(_bar2.default);

	exports.default = BookBar;

/***/ }

})
//# sourceMappingURL=0.7e923b885c4b5055e7bf.hot-update.js.map
webpackHotUpdate(0,{

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createNavbar = createNavbar;
	exports.closeNavbar = closeNavbar;
	exports.destroyNavbar = destroyNavbar;

	var _html = __webpack_require__(167);

	var _html2 = _interopRequireDefault(_html);

	var _section = __webpack_require__(168);

	var _section2 = _interopRequireDefault(_section);

	var _index = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 动画加锁
	 */
	var lockAnimation = void 0;

	/**
	 * 导航对象
	 * @type {[type]}
	 */
	/**
	 * 目录列表
	 * @param  {[type]} hindex    [description]
	 * @param  {[type]} pageArray [description]
	 * @param  {[type]} modules   [description]
	 * @return {[type]}           [description]
	 *
	 */
	var sectionInstance = null;

	/**
	 * 控制按钮改变
	 */
	function navControl(action, navhandle) {
	    navhandle.css('opacity', action === "in" ? 0.5 : 1);
	}

	/**
	 * 执行动画
	 */
	function toAnimation(navControlBar, navhandle, action) {

	    var complete = function complete() {
	        //恢复css
	        navControlBar.css(Xut.style.transition, '');
	        Xut.View.HideBusy();
	        lockAnimation = false;
	    };
	    //出现
	    if (action == 'in') {
	        //导航需要重置
	        //不同的页面定位不一定
	        sectionInstance.refresh();
	        sectionInstance.scrollTo();
	        //动画出现
	        navControlBar.animate({
	            'z-index': Xut.zIndexlevel(),
	            'opacity': 1
	        }, 'fast', 'linear', function () {
	            navhandle.attr('fly', 'out');
	            complete();
	        });
	    } else {
	        //隐藏
	        navhandle.attr('fly', 'in');
	        navControlBar.hide();
	        complete();
	    }
	}

	/**
	 * 预处理
	 */
	var _preProcess = function _preProcess() {

	    //控制按钮
	    var navhandle = $("#backDir");
	    var navControlBar = $("#navBar");

	    //判断点击的动作
	    var action = navhandle.attr('fly') || 'in';

	    //初始化目录栏的样式
	    //能够显示出来
	    sectionInstance.state = false;
	    if (action == 'in') {
	        sectionInstance.state = true;
	        navControlBar.css({
	            'z-index': 0,
	            'opacity': 0,
	            'display': 'block'
	        });
	    }

	    //触发控制条
	    navControl(action, navhandle);
	    //执行动画
	    toAnimation(navControlBar, navhandle, action);
	};

	/**
	 * 初始化
	 */
	var _initialize = function _initialize() {
	    if (lockAnimation) {
	        return false;
	    }
	    lockAnimation = true;
	    Xut.View.ShowBusy();
	    _preProcess();
	};

	/**
	 * 预先缓存加载
	 * @return {[type]} [description]
	 */
	var _create = function _create() {

	    var $navBar = $(".xut-navbar");

	    (0, _html2.default)($navBar, function (data) {
	        //目录对象
	        sectionInstance = new _section2.default(data);
	        //初始化滑动
	        // sectionInstance.userIscroll();
	        //初始缩略图
	        //  sectionInstance.createThumb()

	        //初始化样式
	        // _initialize()
	    });
	};

	/**
	 * 目录
	 */
	function createNavbar(pageIndex) {
	    if (sectionInstance) {
	        _initialize();
	    } else {
	        _create();
	    }
	}

	/**
	 * 关闭
	 */
	function closeNavbar(callback) {
	    if (sectionInstance && sectionInstance.state) {
	        callback && callback();
	        _initialize();
	    }
	}

	/**
	 * 销毁对象
	 * @return {[type]} [description]
	 */
	function destroyNavbar() {
	    if (sectionInstance) {
	        sectionInstance.destroy();
	        sectionInstance = null;
	    }
	}

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 下拉章节列表
	 */
	var Section = function () {
	    function Section(data) {
	        _classCallCheck(this, Section);

	        this._isHorizontal = _index.config.layoutMode === 'horizontal';

	        this.pageArray = data;
	        this.$sectionlist = $('#SectionThelist');
	        this.list = this.$sectionlist.find("li");
	    }

	    /**
	     * 卷滚条
	     */


	    _createClass(Section, [{
	        key: 'userIscroll',
	        value: function userIscroll(pageIndex) {
	            var self = this,
	                hBox = self.hBox,
	                H = !!this._isHorizontal;

	            if (hBox) {
	                if (H) {
	                    //hBox.goToPage(pageIndex, 0, 0)
	                } else {
	                    hBox.goToPage(0, pageIndex, 0);
	                }
	            } else {
	                hBox = new iScroll('#SectionWrapper', {
	                    snap: 'li',
	                    tap: true,
	                    scrollX: H,
	                    scrollY: !H,
	                    scrollbars: true,
	                    fadeScrollbars: true,
	                    stopPropagation: true
	                });

	                //滑动结束,动态处理缩略图
	                hBox.on('scrollEnd', function (e) {
	                    self.createThumb();
	                    self.removeThumb();
	                });

	                this.$sectionlist.on('tap', self.tojump);

	                self.hBox = hBox;
	            }
	        }

	        /**
	         * [ 创建缩略图]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createThumb',
	        value: function createThumb() {
	            var index = this.getPageIndex(),
	                //最左边的索引
	            count = this.getViewLen(),
	                //允许显示的页数
	            createBak = this.createBak || [],
	                //已创建的页码索引
	            createNew = [],
	                //新建的页码索引
	            pageArray = this.pageArray,
	                list = this.list,
	                maxLen = pageArray.length,
	                path = _index.config.pathAddress;

	            //确保不会溢出
	            count = count > maxLen ? maxLen : count;
	            //尽可能地填满
	            index = index + count > maxLen ? maxLen - count : index;

	            for (var i = 0; i < count; i++) {
	                var j = index + i,
	                    page = pageArray[j];

	                createNew.push(j);

	                if (_.contains(createBak, j)) continue;

	                createBak.push(j);

	                //如果是分层母板了,此时用icon代替
	                if (page.iconImage) {
	                    list.eq(j).css({
	                        'background-image': 'url(' + path + page.iconImage + ')'
	                    });
	                } else {
	                    list.eq(j).css({
	                        'background-image': 'url(' + path + page.md5 + ')',
	                        'background-color': 'white'
	                    });
	                }
	            }

	            this.createNew = createNew;
	            this.createBak = createBak;
	        }

	        /**
	         * [ 清理隐藏的缩略图]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'removeThumb',
	        value: function removeThumb() {
	            var list = this.list,
	                createNew = this.createNew,
	                createBak = this.createBak;

	            _.each(createBak, function (val, i) {
	                if (!_.contains(createNew, val)) {
	                    //标记要清理的索引
	                    createBak[i] = -1;
	                    list.eq(val).css({
	                        'background': ''
	                    });
	                }
	            });

	            //执行清理
	            this.createBak = _.without(createBak, -1);
	        }

	        /**
	         * [ 得到滑动列表中最左侧的索引]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'getPageIndex',
	        value: function getPageIndex() {
	            if (this.hBox.options.scrollX) {
	                return this.hBox.currentPage.pageX;
	            } else {
	                return this.hBox.currentPage.pageY;
	            }
	        }

	        /**
	         * [ 获取待创建的缩略图的个数]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'getViewLen',
	        value: function getViewLen() {
	            var hBox = this.hBox,
	                eleSize = 1,
	                //单个li的高度,
	            count = 1,
	                len = this.pageArray.length; //li的总数

	            if (this._isHorizontal) {
	                eleSize = hBox.scrollerWidth / len;
	                count = hBox.wrapperWidth / eleSize;
	            } else {
	                eleSize = hBox.scrollerHeight / len;
	                count = hBox.wrapperHeight / eleSize;
	            }
	            //多创建一个
	            return Math.ceil(count) + 1;
	        }

	        /**
	         * 点击元素跳转
	         */

	    }, {
	        key: 'tojump',
	        value: function tojump(env) {
	            var target;
	            var xxtlink;
	            if (target = env.target) {
	                // initialize();
	                if (xxtlink = target.getAttribute('data-xxtlink')) {
	                    xxtlink = xxtlink.split('-');
	                    Xut.View.GotoSlide(xxtlink[0], xxtlink[1]);
	                }
	            }
	        }

	        /**
	         * 滚动指定位置
	         */

	    }, {
	        key: 'scrollTo',
	        value: function scrollTo() {
	            this.userIscroll();
	        }

	        /**
	         * 刷新
	         */

	    }, {
	        key: 'refresh',
	        value: function refresh() {
	            this.hBox && this.hBox.refresh();
	        }

	        /**
	         * 销毁
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            if (this.hBox) {
	                this.$sectionlist.off();
	                this.hBox.destroy();
	                this.hBox = null;
	            }
	            this.pageArray = null;
	        }
	    }]);

	    return Section;
	}();

	exports.default = Section;

/***/ }

})
//# sourceMappingURL=0.67e83048975371ce520c.hot-update.js.map
webpackHotUpdate(0,{

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.load = load;
	exports.openNavbar = openNavbar;
	exports.close = close;
	exports.destroy = destroy;

	var _html = __webpack_require__(167);

	var _html2 = _interopRequireDefault(_html);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = void 0; /**
	                      * 目录列表
	                      * @param  {[type]} hindex    [description]
	                      * @param  {[type]} pageArray [description]
	                      * @param  {[type]} modules   [description]
	                      * @return {[type]}           [description]
	                      *
	                      */

	var _layoutMode = void 0;
	var pageIndex = 0;

	var sectionInstance = null;
	var directory = 'images/icons/directory.png';
	var directory_act = 'images/icons/directory_act.png';
	var lockAnimation = void 0; //动画加锁

	var $navbal = void 0;

	/**
	 * 下拉章节列表
	 */
	function SectionList(pageArray) {
	    this.pageArray = pageArray;
	    this.$sectionlist = $('#SectionThelist');
	    this.list = this.$sectionlist.find("li");
	};

	SectionList.prototype = {

	    /**
	     * 卷滚条
	     */
	    userIscroll: function userIscroll() {
	        var self = this,
	            hBox = self.hBox,
	            H = !!(_layoutMode === 'horizontal');

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
	    },

	    /**
	     * [ 创建缩略图]
	     * @return {[type]} [description]
	     */
	    createThumb: function createThumb() {
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
	            path = config.pathAddress;

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
	    },

	    /**
	     * [ 清理隐藏的缩略图]
	     * @return {[type]} [description]
	     */
	    removeThumb: function removeThumb() {
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
	    },

	    /**
	     * [ 得到滑动列表中最左侧的索引]
	     * @return {[type]} [description]
	     */
	    getPageIndex: function getPageIndex() {
	        if (this.hBox.options.scrollX) {
	            return this.hBox.currentPage.pageX;
	        } else {
	            return this.hBox.currentPage.pageY;
	        }
	    },

	    /**
	     * [ 获取待创建的缩略图的个数]
	     * @return {[type]} [description]
	     */
	    getViewLen: function getViewLen() {
	        var hBox = this.hBox,
	            eleSize = 1,
	            //单个li的高度,
	        count = 1,
	            len = this.pageArray.length; //li的总数

	        if (_layoutMode === 'horizontal') {
	            eleSize = hBox.scrollerWidth / len;
	            count = hBox.wrapperWidth / eleSize;
	        } else {
	            eleSize = hBox.scrollerHeight / len;
	            count = hBox.wrapperHeight / eleSize;
	        }
	        //多创建一个
	        return Math.ceil(count) + 1;
	    },

	    /**
	     * 点击元素跳转
	     */
	    tojump: function tojump(env) {
	        var target;
	        var xxtlink;
	        if (target = env.target) {
	            initialize();
	            if (xxtlink = target.getAttribute('data-xxtlink')) {
	                xxtlink = xxtlink.split('-');
	                Xut.View.GotoSlide(xxtlink[0], xxtlink[1]);
	            }
	        }
	    },

	    /**
	     * 滚动指定位置
	     */
	    scrollTo: function scrollTo() {
	        this.userIscroll();
	    },

	    /**
	     * 刷新
	     */
	    refresh: function refresh() {
	        this.hBox && this.hBox.refresh();
	    },

	    /**
	     * 销毁
	     */
	    destroy: function destroy() {
	        if (this.hBox) {
	            this.$sectionlist.off();
	            this.hBox.destroy();
	            this.hBox = null;
	        }
	        this.pageArray = null;
	    }

	};

	/**
	 * 初始化
	 */
	function initialize() {
	    //动画状态
	    if (lockAnimation) {
	        return false;
	    }
	    lockAnimation = true;
	    Xut.View.ShowBusy();
	    startpocess();
	};

	/**
	 * 控制处理
	 */
	function startpocess() {
	    //控制按钮
	    var navhandle = $("#backDir");
	    var navControlBar = $("#navBar");
	    //判断点击的动作
	    var action = navhandle.attr('fly') || 'in';

	    /**
	     * 初始化目录栏的样式
	     * 能够显示出来
	     */
	    var initStyle = function initStyle(callback) {
	        sectionInstance.state = false;
	        if (action == 'in') {
	            sectionInstance.state = true;
	            navControlBar.css({
	                'z-index': 0,
	                'opacity': 0,
	                'display': 'block'
	            });
	        }
	        callback();
	    };

	    //初始化样式
	    initStyle(function () {
	        //触发控制条
	        navControl(action, navhandle);
	        //执行动画
	        toAnimation(navControlBar, navhandle, action);
	    });
	};

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
	 * 预先缓存加载
	 * @return {[type]} [description]
	 */
	function load() {
	    $navbal = $("#navBar");

	    //创建dom
	    //返回页面数据
	    (0, _html2.default)($navbal, function (pageArray) {
	        //目录对象
	        sectionInstance = new SectionList(pageArray);
	        //初始化滑动
	        sectionInstance.userIscroll();
	        //初始缩略图
	        sectionInstance.createThumb();
	        //初始化样式
	        initialize();
	    });
	};

	/**
	 * 配置
	 */
	function initconf(index) {
	    config = Xut.config;
	    _layoutMode = config.layoutMode;
	    pageIndex = index;
	}

	/**
	 * 打开目录
	 */
	function openNavbar(index) {
	    initconf(index);
	    if (sectionInstance) {
	        initialize();
	    } else {
	        load();
	    }
	}

	/**
	 * 关闭
	 */
	function close(callback) {
	    if (sectionInstance && sectionInstance.state) {
	        callback && callback();
	        initialize();
	    }
	}

	/**
	 * 销毁对象
	 * @return {[type]} [description]
	 */
	function destroy() {
	    if (sectionInstance) {
	        sectionInstance.destroy();
	        sectionInstance = null;
	    }
	}

/***/ }

})
//# sourceMappingURL=0.f23448c9310228cd73c6.hot-update.js.map
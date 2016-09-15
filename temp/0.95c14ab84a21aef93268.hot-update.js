webpackHotUpdate(0,{

/***/ 143:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SceneFactory = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(1);

	var _sysbar = __webpack_require__(151);

	var _sysbar2 = _interopRequireDefault(_sysbar);

	var _fnbar = __webpack_require__(149);

	var _fnbar2 = _interopRequireDefault(_fnbar);

	var _index2 = __webpack_require__(171);

	var _index3 = _interopRequireDefault(_index2);

	var _layout = __webpack_require__(43);

	var _controller = __webpack_require__(13);

	var _index4 = __webpack_require__(118);

	var _barconf = __webpack_require__(142);

	var _nexttick = __webpack_require__(3);

	var _nexttick2 = _interopRequireDefault(_nexttick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 找到对应容器
	 * @return {[type]}            [description]
	 */
	var findContainer = function findContainer(elements, scenarioId, isMain) {
	    return function (pane, parallax) {
	        var node;
	        if (isMain) {
	            node = '#' + pane;
	        } else {
	            node = '#' + parallax + scenarioId;
	        }
	        return elements.find(node)[0];
	    };
	};

	/**
	 * 如果启动了缓存记录
	 * 加载新的场景
	 * @return {[type]} [description]
	 */
	var checkHistory = function checkHistory(history) {

	    //直接启用快捷调试模式
	    if (_index.config.deBugHistory) {
	        Xut.View.LoadScenario(_index.config.deBugHistory);
	        return true;
	    }

	    //如果有历史记录
	    if (history) {
	        var scenarioInfo = _controller.sceneController.seqReverse(history);
	        if (scenarioInfo) {
	            scenarioInfo = scenarioInfo.split('-');
	            Xut.View.LoadScenario({
	                'scenarioId': scenarioInfo[0],
	                'chapterId': scenarioInfo[1],
	                'pageIndex': scenarioInfo[2]
	            });
	            return true;
	        } else {
	            return false;
	        }
	    }
	};

	/**
	 * 场景创建类
	 * @param  {[type]} seasonId               [description]
	 * @param  {[type]} chapterId              [description]
	 * @param  {[type]} createCompleteCallback [创建完毕通知回调]
	 * @param  {[type]} createMode             [创建模式]
	 * @param  {[type]} sceneChainId           [场景ID链,用于后退按钮加载前一个场景]
	 * @return {[type]}                        [description]
	 */

	var SceneFactory = exports.SceneFactory = function () {
	    function SceneFactory(data) {
	        var _this = this;

	        _classCallCheck(this, SceneFactory);

	        //基本配置信息
	        var seasonId = data.seasonId;
	        var chapterId = data.chapterId;

	        var options = _.extend(this, data, {
	            'scenarioId': seasonId,
	            'chapterId': chapterId,
	            'container': $('#xut-scene-container')
	        });

	        //创建主场景
	        this._createHTML(options, function () {
	            //配置工具栏行为
	            if (!Xut.IBooks.Enabled) {
	                _.extend(_this, _this._initToolBar());
	            }
	            //构建Mediator对象
	            _this._createMediator();
	            //注入场景管理
	            _controller.sceneController.add(seasonId, chapterId, _this);
	        });
	    }

	    /**
	     * 创建场景
	     * @return {[type]} [description]
	     */


	    _createClass(SceneFactory, [{
	        key: '_createHTML',
	        value: function _createHTML(options, callback) {

	            //如果是静态文件执行期
	            //支持Xut.IBooks模式
	            //都不需要创建节点
	            if (Xut.IBooks.runMode()) {
	                this.elements = $('#sceneHome');
	                callback();
	                return;
	            }

	            var str = void 0;

	            if (options.isMain) {
	                str = (0, _layout.home)();
	            } else {
	                str = (0, _layout.scene)(this.scenarioId);
	            }

	            this.elements = $(str);

	            (0, _nexttick2.default)({
	                'container': this.container,
	                'content': this.elements
	            }, callback);
	        }

	        /**
	         *
	         * 配置工具栏行为
	         *  1.  工具栏类型
	         *  tbType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
	         *   0  禁止工具栏
	         *   1  系统工具栏   - 显示IOS系统工具栏
	         *   2  场景工具栏   - 显示关闭按钮
	         *   3  场景工具栏   - 显示返回按钮
	         *   4  场景工具栏   - 显示顶部小圆点式标示
	         *
	         *  2.  翻页模式
	         *  pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
	         *   0禁止滑动
	         *   1 允许滑动无翻页按钮
	         *   2 允许滑动带翻页按钮
	         *
	         * @return {[type]} [description]
	         */

	    }, {
	        key: '_initToolBar',
	        value: function _initToolBar() {
	            var scenarioId = this.scenarioId;
	            var pageTotal = this.pageTotal;
	            var pageIndex = this.pageIndex;
	            var elements = this.elements;
	            var findControlBar = function findControlBar() {
	                return elements.find('#controlBar');
	            };

	            //工具栏配置信息
	            var conf = void 0;

	            //主场景工具栏设置
	            if (this.isMain) {
	                conf = (0, _barconf.pMainBar)(scenarioId, pageTotal);

	                if (_index.config.scrollPaintingMode) {
	                    //word模式,自动启动工具条
	                    this.sToolbar = new _index3.default({
	                        container: elements,
	                        controlBar: findControlBar(),
	                        pageMode: conf.pageMode
	                    });
	                } else if (_.some(conf.tbType)) {
	                    //普通模式
	                    this.sToolbar = new _sysbar2.default({
	                        container: elements,
	                        controlBar: findControlBar(),
	                        pageTotal: pageTotal,
	                        currentPage: pageIndex + 1,
	                        pageMode: conf.pageMode
	                    });
	                }
	            } else {
	                //副场景
	                conf = (0, _barconf.pDeputyBar)(this.barInfo, pageTotal);
	                //创建工具栏
	                if (conf) {
	                    this.cToolbar = new _fnbar2.default({
	                        id: scenarioId,
	                        container: elements,
	                        tbType: conf.tbType,
	                        pageTotal: pageTotal,
	                        currentPage: pageIndex,
	                        pageMode: conf.pageMode
	                    });
	                }
	            }

	            return conf;
	        }

	        /**
	         * 构建创建对象
	         * @return {[type]} [description]
	         */

	    }, {
	        key: '_createMediator',
	        value: function _createMediator() {

	            var self = this;
	            var scenarioId = this.scenarioId;
	            var pageTotal = this.pageTotal;
	            var pageIndex = this.pageIndex;
	            var elements = this.elements;
	            var pageMode = this.pageMode;
	            var isMain = this.isMain;
	            var tempfind = findContainer(elements, scenarioId, isMain);
	            //页面容器
	            var scenarioPage = tempfind('pageContainer', 'scenarioPage-');
	            //视差容器
	            var scenarioMaster = tempfind('masterContainer', 'scenarioMaster-');

	            //场景容器对象
	            var vm = this.vm = new _index4.Mediator({
	                'container': this.elements[0],
	                'pageMode': pageMode,
	                'multiScenario': !isMain,
	                'rootPage': scenarioPage,
	                'rootMaster': scenarioMaster,
	                'initIndex': pageIndex, //保存索引从0开始
	                'pagetotal': pageTotal,
	                'sectionRang': this.sectionRang,
	                'scenarioId': scenarioId,
	                'chapterId': this.chapterId,
	                'isInApp': this.isInApp //提示页面
	            });

	            /**
	             * 配置选项
	             * @type {[type]}
	             */
	            var isToolbar = this.isToolbar = this.cToolbar ? this.cToolbar : this.sToolbar;

	            /**
	             * 监听翻页
	             * 用于更新页码
	             * @return {[type]} [description]
	             */
	            vm.$bind('pageUpdate', function (pageIndex) {
	                isToolbar && isToolbar.updatePointer(pageIndex);
	            });

	            /**
	             * 显示下一页按钮
	             * @return {[type]} [description]
	             */
	            vm.$bind('showNext', function () {
	                isToolbar && isToolbar.showNext();
	            });

	            /**
	             * 隐藏下一页按钮
	             * @return {[type]} [description]
	             */
	            vm.$bind('hideNext', function () {
	                isToolbar && isToolbar.hideNext();
	            });

	            /**
	             * 显示上一页按钮
	             * @return {[type]} [description]
	             */
	            vm.$bind('showPrev', function () {
	                isToolbar && isToolbar.showPrev();
	            });

	            /**
	             * 隐藏上一页按钮
	             * @return {[type]} [description]
	             */
	            vm.$bind('hidePrev', function () {
	                isToolbar && isToolbar.hidePrev();
	            });

	            /**
	             * 切换工具栏
	             * @return {[type]} [description]
	             */
	            vm.$bind('toggleToolbar', function (state, pointer) {
	                isToolbar && isToolbar.toggle(state, pointer);
	            });

	            /**
	             * 复位工具栏
	             * @return {[type]} [description]
	             */
	            vm.$bind('resetToolbar', function () {
	                self.sToolbar && self.sToolbar.reset();
	            });

	            /**
	             * 监听创建完成
	             * @return {[type]} [description]
	             */
	            vm.$bind('createComplete', function (nextAction) {
	                self.complete && setTimeout(function () {
	                    if (isMain) {
	                        self.complete(function () {
	                            Xut.View.HideBusy();
	                            //检测是不是有缓存加载
	                            if (!checkHistory(self.history)) {
	                                //指定自动运行的动作
	                                nextAction && nextAction();
	                            }
	                            //全局接口,应用加载完毕
	                            Xut.Application.AddEventListener();
	                        });
	                    } else {
	                        self.complete(nextAction);
	                    }
	                }, 200);
	            });

	            //如果是读酷端加载
	            if (window.DUKUCONFIG && isMain && window.DUKUCONFIG.success) {
	                window.DUKUCONFIG.success();
	                vm.$init();
	                //如果是客户端加载
	            } else if (window.CLIENTCONFIGT && isMain && window.CLIENTCONFIGT.success) {
	                window.CLIENTCONFIGT.success();
	                vm.$init();
	            } else {
	                //正常加载
	                vm.$init();
	            }

	            /**
	             * 绑定桌面调试
	             */
	            _index.config.debugMode && Xut.plat.isBrowser && this._bindWatch();
	        }

	        /**
	         * 为桌面测试
	         * 绑定调试
	         * @return {[type]} [description]
	         */

	    }, {
	        key: '_bindWatch',
	        value: function _bindWatch() {
	            // for test
	            if (Xut.plat.isBrowser) {
	                var vm = this.vm;
	                this.testWatch = $(".xut-controlBar-pageNum").click(function () {
	                    console.log('主场景', vm);
	                    console.log('主场景容器', vm.$scheduler.pageMgr.Collections);
	                    console.log('主场景视觉差容器', vm.$scheduler.parallaxMgr && vm.$scheduler.parallaxMgr.Collections);
	                    console.log('多场景', _controller.sceneController.expose());
	                    console.log('数据库', Xut.data);
	                });
	            }
	        }

	        /**
	         * 销毁场景对象
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            /**
	             * 桌面调试
	             */
	            if (this.testWatch) {
	                this.testWatch.off();
	                this.testWatch = null;
	            }

	            /**
	             * 销毁当前场景
	             */
	            this.vm.$destroy();

	            /**
	             * 销毁工具栏
	             */
	            if (this.isToolbar) {
	                this.isToolbar.destroy();
	                this.isToolbar = null;
	            }

	            this.container = null;

	            //销毁节点
	            this.elements.off();
	            this.elements.remove();
	            this.elements = null;

	            //销毁引用
	            _controller.sceneController.remove(this.scenarioId);
	        }
	    }]);

	    return SceneFactory;
	}();

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 书签栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 加入这个书签功能后，可以让用户自由选择哪页是需要保存记录的
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param options object
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example {parent:页面容器,pageId:chapterId,seasonId:seasionId}
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _tap = __webpack_require__(5);

	var _index = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var icons = {
	    hide: 'images/icons/arrowDown.svg'
	};

	/**
	 * 行高
	 * @type {[type]}
	 */
	var sLineHeiht = parseInt($('body').css('font-size')) || 16; //行高

	/**
	 * 书签缓存
	 */
	var BOOKCACHE = void 0;

	var BookMark = function () {
	    function BookMark() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var parent = _ref.parent;
	        var pageId = _ref.pageId;
	        var seasonId = _ref.seasonId;

	        _classCallCheck(this, BookMark);

	        this.parent = parent;
	        this.pageId = pageId;
	        this.seasonId = seasonId;

	        this.screenSize = Xut.config.screenSize;
	        this.sHeight = this.screenSize.height;
	        this.sWidth = this.screenSize.width;

	        //是否已存储
	        this.isStored = false;
	        this.init();
	    }

	    /**
	     * 初始化
	     * @return {[type]} [description]
	     */


	    _createClass(BookMark, [{
	        key: 'init',
	        value: function init() {
	            var $bookMark = this.createBookMark(),
	                dom = this.parent[0],
	                that = this;

	            this.parent.append($bookMark);
	            this.bookMarkMenu = $bookMark.eq(0);
	            //显示书签
	            setTimeout(function () {
	                that.restore();
	            }, 20);
	            //获取历史记录
	            BOOKCACHE = this.getHistory();

	            //邦定用户事件
	            (0, _tap.bindTap)(dom, {
	                end: this
	            });
	        }

	        /**
	         * 创建书签
	         * @return {[object]} [jquery生成的dom对象]
	         */

	    }, {
	        key: 'createBookMark',
	        value: function createBookMark() {
	            var height = sLineHeiht * 3,
	                // menu的高为3em
	            box = '<div class="xut-bookmark-menu" style="width:100%;height:{0}px;left:0;top:{1}px;">' + '<div class="xut-bookmark-wrap">' + '<div class="xut-bookmark-add">加入书签</div>' + '<div class="xut-bookmark-off" style="background-image:url({2})"></div>' + '<div class="xut-bookmark-view">书签记录</div>' + '</div>' + '</div>' + '<div class="xut-bookmark-list" style="display:none;width:100%;height:{3}px;">' + '<ul class="xut-bookmark-head">' + '<li class="xut-bookmark-back">返回</li>' + '<li>书签</li>' + '</ul>' + '<ul class="xut-bookmark-body"></ul>' + '</div>';
	            box = String.format(box, height, this.sHeight, icons.hide, this.sHeight);
	            this.markHeight = height;
	            return $(box);
	        }

	        /**
	         * 生成书签列表
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createMarkList',
	        value: function createMarkList() {
	            var tmp,
	                seasonId,
	                pageId,
	                list = '',
	                box = '',
	                self = this;

	            //取历史记录
	            _.each(BOOKCACHE, function (mark) {
	                tmp = mark.split('-');
	                seasonId = tmp[0];
	                pageId = tmp[1];
	                mark = self.getMarkId(seasonId, pageId);
	                list += '<li><a data-mark="' + mark + '" class="xut-bookmark-id" href="javascript:0">第' + pageId + '页</a><a class="xut-bookmark-del" data-mark="' + mark + '" href="javascript:0">X</a></li>';
	            });

	            return list;
	        }

	        /**
	         * 创建存储标签
	         * 存储格式 seasonId-pageId
	         * @return {string} [description]
	         */

	    }, {
	        key: 'getMarkId',
	        value: function getMarkId(seasonId, pageId) {
	            return seasonId + '-' + pageId;
	        }

	        /**
	         * 获取历史记录
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'getHistory',
	        value: function getHistory() {
	            var mark = (0, _index._get)('bookMark');
	            if (mark) {
	                return mark.split(',');
	            }
	            return [];
	        }

	        /**
	         * 添加书签
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'addBookMark',
	        value: function addBookMark() {
	            var key;

	            this.updatePageInfo();
	            key = this.getMarkId(this.seasonId, this.pageId);

	            //避免重复缓存
	            if (BOOKCACHE.indexOf(key) > -1) {
	                return;
	            }
	            BOOKCACHE.push(key);
	            (0, _index._set)('bookMark', BOOKCACHE);
	        }

	        /**
	         * 更新页信息
	         *  针对母板层上的书签
	         */

	    }, {
	        key: 'updatePageInfo',
	        value: function updatePageInfo() {
	            var pageData = Xut.Presentation.GetPageData();
	            this.pageId = pageData._id;
	            this.seasonId = pageData.seasonId;
	        }

	        /**
	         * 删除书签
	         * @param {object} [key] [事件目标对象]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'delBookMark',
	        value: function delBookMark(target) {
	            if (!target || !target.dataset) return;

	            var key = target.dataset.mark,
	                index = BOOKCACHE.indexOf(key);

	            BOOKCACHE.splice(index, 1);
	            (0, _index._set)('bookMark', BOOKCACHE);

	            if (BOOKCACHE.length == 0) {
	                (0, _index._remove)('bookMark');
	            }

	            //移除该行
	            $(target).parent().remove();
	        }

	        /**
	         * 显示书签
	         * @param {object} [target] [事件目标对象]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'viewBookMark',
	        value: function viewBookMark(target) {
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

	    }, {
	        key: 'iconManager',
	        value: function iconManager(target) {
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

	    }, {
	        key: 'iconRestore',
	        value: function iconRestore() {
	            this.bookMarkIcon.css('transform', '');
	        }

	        /**
	         * 跳转到书签页
	         * @param  {[type]} target [description]
	         * @return {[type]}        [description]
	         */

	    }, {
	        key: 'goBookMark',
	        value: function goBookMark(target) {
	            if (!target || !target.dataset) return;

	            var key = target.dataset.mark.split('-');
	            var seasonId = Number(key[0]);
	            var pageId = Number(key[1]);

	            this.updatePageInfo();
	            //关闭书签列表
	            this.backBookMark();

	            //忽略当前页的跳转
	            if (this.pageId == pageId && this.seasonId == seasonId) {
	                return;
	            }

	            Xut.View.LoadScenario({
	                'scenarioId': seasonId,
	                'chapterId': pageId
	            });
	        }

	        /**
	         * 书签回退键
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'backBookMark',
	        value: function backBookMark() {
	            this.bookMarkList.fadeOut();
	        }

	        /**
	         * 邦定事件
	         * @param  {[type]} evt [事件]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'handleEvent',
	        value: function handleEvent(evt) {
	            var target = evt.target;
	            switch (target.className) {
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

	        /**
	         * 关闭书签菜单
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'closeBookMark',
	        value: function closeBookMark(target) {
	            this.bookMarkMenu.css({
	                transform: 'translate3d(0,0,0)',
	                'transition-duration': '1s'
	            });
	        }

	        /**
	         * 恢复书签菜单
	         */

	    }, {
	        key: 'restore',
	        value: function restore() {
	            this.bookMarkMenu.css({
	                transform: 'translate3d(0,-' + this.markHeight + 'px,0)',
	                'transition-duration': '1s'
	            });
	        }

	        /**
	         * 销毁书签
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var dom = this.parent[0];

	            dom.removeEventListener('touchend', this, false);
	            dom.removeEventListener('mouseup', this, false);

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
	    }]);

	    return BookMark;
	}();

	exports.default = BookMark;

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bookmark = __webpack_require__(170);

	var _toolBar = __webpack_require__(23);

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
//# sourceMappingURL=0.95c14ab84a21aef93268.hot-update.js.map
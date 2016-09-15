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

	var _bookbar = __webpack_require__(147);

	var _layout = __webpack_require__(43);

	var _controller = __webpack_require__(13);

	var _index2 = __webpack_require__(118);

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
	                    this.sToolbar = new _bookbar.BookBar({
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
	            var vm = this.vm = new _index2.Mediator({
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

/***/ 149:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bar = __webpack_require__(169);

	var _bar2 = _interopRequireDefault(_bar);

	var _index = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 函数工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var fnBar = function (_Bar) {
	    _inherits(fnBar, _Bar);

	    function fnBar(options) {
	        _classCallCheck(this, fnBar);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(fnBar).call(this));

	        _this.pageTips = null;
	        _this.currTip = null;
	        _this.tipsMode = 0;
	        _this.top = 0;
	        _this.Lock = false;
	        _this.delay = 50;
	        _this.hasTopBar = false;
	        _this.barStatus = true;
	        _this.arrows = Object.create(null);
	        //options
	        _this.pageMode = options.pageMode;
	        _this.id = options.id;
	        _this.container = options.container;
	        _this.tbType = options.tbType;
	        _this.pageTotal = options.pageTotal;
	        _this.currentPage = options.currentPage;

	        _this.initConfig();

	        _this.initTool();
	        return _this;
	    }

	    /**
	     * 创建工具栏
	     * tbType:
	     *      0   禁止工具栏
	     *      1   系统工具栏   - 显示IOS系统工具栏
	     *      2   场景工具栏   - 显示关闭按钮
	     *      3   场景工具栏   - 显示返回按钮
	     *      4   场景工具栏   - 显示顶部小圆点式标示
	     *  pageMode:
	     *      0禁止滑动
	     *      1允许滑动无翻页按钮
	     *      2 允许滑动带翻页按钮
	     * @return {[type]} [description]
	     */


	    _createClass(fnBar, [{
	        key: 'initTool',
	        value: function initTool() {
	            var container = this.container,
	                type;

	            container.hide();
	            this.controlBar = [];

	            while (type = this.tbType.shift()) {
	                switch (type) {
	                    case 1:
	                        this.createSystemBar();
	                        break;
	                    case 2:
	                        this.createCloseIcon();
	                        break;
	                    case 3:
	                        this.createBackIcon(container);
	                        break;
	                    case 4:
	                        this.createPageTips();
	                        break;
	                    default:
	                        this.barStatus = false;
	                        this.hasTopBar = false;
	                        break;
	                }
	            }

	            //创建翻页按钮
	            if (this.pageMode === 2) {
	                this.createArrows();
	            }

	            container.show();

	            //邦定事件
	            this.bindButtonsEvent();
	        }

	        /**
	         * 系统工具栏
	         */

	    }, {
	        key: 'createSystemBar',
	        value: function createSystemBar() {
	            var id = this.id,
	                TOP = this.barHeight,
	                html = '',
	                style = 'top:0;height:' + this.iconHeight + 'px;padding-top:' + TOP + 'px';
	            html = '<div id="controlBar' + id + '" class="xut-controlBar" style="' + style + '"></div>';
	            html = $(html);
	            this.top = TOP;
	            this.showSystemBar();
	            this.createBackIcon(html);
	            this.createTitle(html);
	            this.createPageNum(html);
	            this.controlBar = html;
	            this.container.append(html);
	            this.hasTopBar = true;
	        }

	        /**
	         * 页码小圆点
	         */

	    }, {
	        key: 'createPageTips',
	        value: function createPageTips() {
	            var chapters = this.pageTotal,
	                height = this.iconHeight,
	                TOP = this.top,
	                isIOS = Xut.plat.isIOS,
	                html = '';

	            //如果只有一页则不显示小圆
	            if (chapters < 2) {
	                return '';
	            }

	            var calculate = _index.config.proportion.calculateContainer();
	            //圆点尺寸
	            var size = isIOS ? 7 : Math.max(8, Math.round(this.propHeight * 8)),
	                width = 2.5 * size,
	                //圆点间距
	            tipsWidth = chapters * width,
	                //圆点总宽度
	            top = (height - size) / 2,
	                //保持圆点垂直居中
	            left = (calculate.width - tipsWidth) / 2; //保持圆点水平居中

	            html = '<ul class="xut-scenario-tips"  style="top:' + TOP + 'px;left:' + left + 'px;width:' + tipsWidth + 'px;opacity:0.6">';
	            for (var i = 1; i <= chapters; i++) {
	                html += '<li class="xut-scenario-dark" style="float:left;width:' + width + 'px;height:' + height + 'px;" data-index="' + i + '">';
	                html += '<div class="xut-scenario-radius" style="width:' + size + 'px;height:' + size + 'px;margin:' + top + 'px auto"></div></li>';
	            }
	            html += '</ul>';
	            html = $(html);
	            this.pageTips = html.children();
	            this.tipsMode = 1;
	            this.controlBar.push(html);
	            this.container.append(html);
	        }

	        /**
	         * 更新页码指示
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'updatePointer',
	        value: function updatePointer(pageIndex) {
	            switch (this.tipsMode) {
	                case 1:
	                    if (this.prevTip) {
	                        this.prevTip.className = 'xut-scenario-dark';
	                    }
	                    this.currTip = this.pageTips[pageIndex];
	                    this.currTip.className = 'xut-scenario-light';
	                    this.prevTip = this.currTip;
	                    break;
	                case 2:
	                    this.currTip.html(pageIndex + 1);
	                    break;
	                default:
	                    break;
	            }
	        }

	        /**
	         * [ 关闭按钮]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createCloseIcon',
	        value: function createCloseIcon() {
	            var style,
	                html,
	                TOP = this.top,
	                height = this.iconHeight;
	            style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
	            html = '<div class="si-icon xut-scenario-close" data-icon-name="close" style="' + style + '"></div>';
	            html = $(html);
	            this.createSVGIcon($(html)[0], function () {
	                Xut.View.CloseScenario();
	            });
	            this.controlBar.push(html);
	            this.container.append(html);
	        }

	        /**
	         * [ 返回按钮]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createBackIcon',
	        value: function createBackIcon(container) {
	            var style,
	                html,
	                TOP = this.top,
	                height = this.iconHeight;
	            style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
	            html = '<div class="si-icon xut-scenario-back" data-icon-name="back" style="' + style + '"></div>';
	            html = $(html);
	            this.createSVGIcon(html[0], function () {
	                Xut.View.CloseScenario();
	            });
	            this.controlBar.push(html);
	            container.append(html);
	        }

	        //创建页码数

	    }, {
	        key: 'createPageNum',
	        value: function createPageNum(container) {
	            var pageTotal = this.pageTotal,
	                TOP = this.top,
	                height = this.iconHeight,
	                currentPage = this.currentPage,
	                style,
	                html;
	            style = 'position:absolute;right:4px;top:' + (height * 0.25 + TOP) + 'px;padding:0 0.25em;height:' + height * 0.5 + 'px;line-height:' + height * 0.5 + 'px;border-radius:0.5em';
	            html = '<div class="xut-controlBar-pageNum" style="' + style + '">';
	            html += '<span class="currentPage">' + currentPage + '</span>/<span>' + pageTotal + '</span>';
	            html += '</div>';
	            html = $(html);
	            this.tipsMode = 2;
	            this.currTip = html.children().first();
	            container.append(html);
	        }

	        //工具栏隐藏按钮

	    }, {
	        key: 'createHideToolbar',
	        value: function createHideToolbar(container) {
	            var html,
	                style,
	                TOP = this.top,
	                height = this.iconHeight,
	                right = this.iconHeight * 2.5;
	            style = 'position:absolute;right:' + right + 'px;top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px;background-size:cover';
	            html = '<div class="xut-controlBar-hide" style="' + style + '"></div>';
	            container.append(html);
	        }

	        //应用标题

	    }, {
	        key: 'createTitle',
	        value: function createTitle(container) {
	            var style,
	                html,
	                appName = this.appName;
	            style = 'line-height:' + this.iconHeight + 'px';
	            html = '<div class="xut-controlBar-title" style="' + style + '">' + appName + '</div>';
	            container.append(html);
	        }

	        /**
	         * [ 普通按钮邦定事件]
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'bindButtonsEvent',
	        value: function bindButtonsEvent() {
	            var that = this,
	                index = 1,
	                id = this.id;

	            this.container.on("touchend touchend", function (e) {
	                var target = Xut.plat.evtTarget(e),
	                    type = target.className;
	                switch (type) {
	                    case 'xut-controlBar-hide':
	                        that.hideTopBar();
	                        break;
	                    case 'xut-scenario-dark':
	                        if (that.pageMode) {
	                            index = target.getAttribute('data-index') || 1;
	                            Xut.View.GotoSlide(Number(index));
	                        }
	                        break;
	                    default:
	                        break;
	                }
	            });
	        }

	        /**
	         * [ 显示顶部工具栏]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'showTopBar',
	        value: function showTopBar() {
	            var that = this,
	                delay = this.delay,
	                controlBar = this.controlBar;
	            if (this.barStatus) {
	                this.Lock = false;
	                return;
	            }
	            if (this.hasTopBar) {
	                controlBar.css({
	                    'display': 'block',
	                    'opacity': 0
	                });
	                setTimeout(function () {
	                    controlBar.animate({
	                        'opacity': 1
	                    }, delay, 'linear', function () {
	                        that.showSystemBar();
	                        that.barStatus = true;
	                        that.Lock = false;
	                    });
	                });
	            } else {
	                controlBar.forEach(function (el) {
	                    el.show();
	                    that.Lock = false;
	                    that.barStatus = true;
	                });
	            }
	        }

	        /**
	         * [ 隐藏顶部工具栏]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'hideTopBar',
	        value: function hideTopBar() {
	            var that = this,
	                delay = this.delay,
	                controlBar = this.controlBar;

	            if (!this.barStatus) {
	                this.Lock = false;
	                return;
	            }
	            if (this.hasTopBar) {
	                controlBar.animate({
	                    'opacity': 0
	                }, delay, 'linear', function () {
	                    that.controlBar.hide();
	                    that.hideSystemBar();
	                    that.barStatus = false;
	                    that.Lock = false;
	                });
	            } else {
	                controlBar.forEach(function (el) {
	                    el.hide(delay, function () {
	                        that.Lock = false;
	                        that.barStatus = false;
	                    });
	                });
	            }
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.container.off();
	            this.controlBar = null;
	            this.arrows = null;
	            this.pageTips = null;
	            this.currTip = null;
	            this.prevTip = null;
	        }
	    }]);

	    return fnBar;
	}(_bar2.default);

	exports.default = fnBar;

/***/ }

})
//# sourceMappingURL=0.516a82a6a47a9831425f.hot-update.js.map
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

	var _fnbar = __webpack_require__(149);

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
	                    this.sToolbar = new _sysbar.sysBar({
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
	                    this.cToolbar = new _fnbar.fToolbar({
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

/***/ 151:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Bar2 = __webpack_require__(168);

	var _index = __webpack_require__(14);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 系统工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 主场景工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var sysBar = function (_Bar) {
	    _inherits(sysBar, _Bar);

	    function sysBar(options) {
	        _classCallCheck(this, sysBar);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(sysBar).call(this));

	        _this.arrows = Object.create(null);
	        _this.curTips = null; //当前页码对象
	        _this.Lock = false; //操作锁
	        _this.delay = 50; //动画延时
	        _this.hasTopBar = true; //有顶部工具条
	        _this.controlBar = options.controlBar;
	        _this.container = options.container;
	        _this.pageMode = options.pageMode;
	        _this.pageTotal = options.pageTotal;
	        _this.currentPage = options.currentPage;

	        //配置属性
	        //config
	        _this.config = Xut.config;
	        _this.initConfig(_this.config);

	        _this.initTool();
	        return _this;
	    }

	    _createClass(sysBar, [{
	        key: 'initTool',
	        value: function initTool() {

	            var bar = this.controlBar,
	                setting = this.settings;

	            //工具栏的显示状态
	            this.barStatus = bar.css('display') === 'none' ? false : true;

	            //工具栏摆放位置
	            this.toolbarPostion(bar, setting.ToolbarPos);

	            //首页按钮
	            setting.HomeBut && this.createHomeIcon(bar);

	            //目录按钮
	            setting.ContentBut && this.createDirIcon(bar);

	            //添加标题
	            this.createTitle(bar);

	            //关闭子文档
	            setting.CloseBut && this.createCloseIcon(bar);

	            //页码数
	            setting.PageBut && this.createPageNum(bar);

	            //工具栏隐藏按钮
	            this.createHideToolbar(bar);

	            //翻页按钮
	            if (this.pageMode == 2) {
	                this.createArrows();
	            }

	            //邦定事件
	            this.bindButtonsEvent(bar);
	        }

	        //工具条的位置

	    }, {
	        key: 'toolbarPostion',
	        value: function toolbarPostion(bar, position) {
	            var height = this.iconHeight,
	                TOP = this.barHeight;
	            if (position == 1) {
	                //在底部
	                bar.css({
	                    bottom: 0,
	                    height: height + 'px'
	                });
	            } else {
	                //在顶部
	                bar.css({
	                    top: 0,
	                    height: height + 'px',
	                    paddingTop: TOP + 'px'
	                });
	            }
	        }

	        //创建主页按钮

	    }, {
	        key: 'createHomeIcon',
	        value: function createHomeIcon(bar) {
	            var str = '<div id="backHome" style="float:left;text-indent:0.25em;height:{0}px;line-height:{1}px;color:#007aff">主页</div>',
	                height = this.iconHeight,
	                html = $(String.format(str, height, height));
	            bar.append(html);
	        }

	        //创建目录按钮

	    }, {
	        key: 'createDirIcon',
	        value: function createDirIcon(bar) {
	            var str = '<div id="backDir" class="xut-controlBar-backDir" style="float:left;margin-left:4px;width:{0}px;height:{1}px;background-size:cover"></div>',
	                height = this.iconHeight,
	                html = $(String.format(str, height, height));
	            bar.append(html);
	        }

	        //创建页码数

	    }, {
	        key: 'createPageNum',
	        value: function createPageNum(bar) {
	            var height = this.iconHeight,
	                marginTop = height * 0.25,
	                iconH = height * 0.5,
	                str,
	                html;
	            str = '<div class="xut-controlBar-pageNum" style="float:right;margin:{0}px 4px;padding:0 0.25em;height:{1}px;line-height:{2}px;border-radius:0.5em"><span>{3}</span>/<span>{4}</span></div>';
	            html = $(String.format(str, marginTop, iconH, iconH, this.currentPage, this.pageTotal));
	            this.curTips = html.children().first();
	            bar.append(html);
	        }

	        //工具栏隐藏按钮

	    }, {
	        key: 'createHideToolbar',
	        value: function createHideToolbar(bar) {
	            var html,
	                style,
	                height = this.iconHeight;
	            style = 'float:right;width:' + height + 'px;height:' + height + 'px;background-size:cover';
	            html = '<div id="hideToolbar" class="xut-controlBar-hide" style="' + style + '"></div>';
	            bar.append(html);
	        }

	        //关闭子文档按钮

	    }, {
	        key: 'createCloseIcon',
	        value: function createCloseIcon(bar) {
	            var style,
	                html,
	                height = this.iconHeight;
	            style = 'float:right;margin-right:4px;width:' + height + 'px;height:' + height + 'px';
	            html = '<div class="si-icon" data-icon-name="close" style="' + style + '"></div>';
	            html = $(html);
	            this.createSVGIcon(html[0], function () {
	                if (window.SUbDOCCONTEXT) {
	                    window.SUbDOCCONTEXT.Xut.publish('subdoc:dropApp');
	                } else {
	                    Xut.publish('magazine:dropApp');
	                }
	            });
	            bar.append(html);
	        }

	        //应用标题

	    }, {
	        key: 'createTitle',
	        value: function createTitle(bar) {
	            var style,
	                html,
	                appName = this.appName,
	                height = this.iconHeight;
	            style = 'width:100%;position:absolute;line-height:' + height + 'px;pointer-events:none';
	            html = '<div class="xut-controlBar-title" style="z-index:-99;' + style + '">' + appName + '</div>';
	            bar.append(html);
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
	                height = this.iconHeight;
	            style = 'float:left;width:' + height + 'px;height:' + height + 'px';
	            html = '<div class="si-icon" data-icon-name="back" style="' + style + '"></div>';
	            html = $(html);
	            this.createSVGIcon(html[0], function () {
	                Xut.Application.Suspend({
	                    dispose: function dispose() {
	                        //停止热点动作
	                        Xut.Application.DropApp(); //退出应用
	                    },
	                    processed: function processed() {
	                        Xut.Application.DropApp(); //退出应用
	                    }
	                });
	            });
	            container.append(html);
	        }

	        /**
	         * 更新页码指示
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'updatePointer',
	        value: function updatePointer(pageIndex) {
	            this.curTips && this.curTips.html(pageIndex + 1);
	        }
	    }, {
	        key: 'bindButtonsEvent',
	        value: function bindButtonsEvent(bar) {
	            var that = this;
	            bar.on("touchend mouseup", function (e) {
	                var type = Xut.plat.evtTarget(e).id;
	                switch (type) {
	                    case "backHome":
	                        that.homeControl();
	                        break;
	                    case "backDir":
	                        that.navigationBar();
	                        break;
	                    case 'hideToolbar':
	                        that.hideTopBar();
	                        break;
	                }
	            });
	        }

	        /**
	         * [ 跳转处理]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'homeControl',
	        value: function homeControl() {
	            if (window.DUKUCONFIG) {
	                Xut.Application.Suspend({
	                    dispose: function dispose() {
	                        Xut.Application.DropApp(); //退出应用
	                    },
	                    processed: function processed() {
	                        Xut.Application.DropApp(); //退出应用
	                    }
	                });
	                return;
	            }

	            Xut.Application.Suspend({
	                dispose: function dispose(promptMessage) {
	                    //停止热点动作
	                    //promptMessage('再按一次将跳至首页！')
	                },
	                processed: function processed() {
	                    Xut.View.GotoSlide(1); //调整到首页
	                }
	            });
	        }

	        /**
	         * [ 打开目录关闭当前页面活动热点]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'navigationBar',
	        value: function navigationBar() {
	            (0, _index.oepn)(Xut.Presentation.GetPageIndex());
	        }

	        /**
	         * [ 显示顶部工具栏]
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
	                that.controlBar && that.controlBar.animate({
	                    'opacity': 1
	                }, that.delay, 'linear', function () {
	                    (0, _index.close)();
	                    that.showSystemBar();
	                    that.barStatus = true;
	                    that.Lock = false;
	                });
	            });
	        }

	        /**
	         * [ 隐藏顶部工具栏]
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
	                (0, _index.close)();
	                that.controlBar.hide();
	                that.hideSystemBar();
	                that.barStatus = false;
	                that.Lock = false;
	            });
	        }

	        //销毁 

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.controlBar.off();
	            this.controlBar = null;
	            this.arrows = null;
	            this.curTips = null;
	            this.barStatus = false;
	        }
	    }]);

	    return sysBar;
	}(_Bar2.Bar);

	exports.default = sysBar;

/***/ }

})
//# sourceMappingURL=0.dfe0e56708be6bcbce5b.hot-update.js.map
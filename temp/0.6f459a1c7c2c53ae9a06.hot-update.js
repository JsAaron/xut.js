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

	var _layout = __webpack_require__(43);

	var _controller = __webpack_require__(13);

	var _sysbar = __webpack_require__(151);

	var _fnbar = __webpack_require__(149);

	var _bookbar = __webpack_require__(147);

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
	                    this.sToolbar = new _sysbar.sToolbar({
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

/***/ }

})
//# sourceMappingURL=0.6f459a1c7c2c53ae9a06.hot-update.js.map
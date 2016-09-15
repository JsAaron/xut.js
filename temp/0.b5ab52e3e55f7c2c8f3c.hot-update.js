webpackHotUpdate(0,{

/***/ 151:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bar = __webpack_require__(169);

	var _bar2 = _interopRequireDefault(_bar);

	var _lang = __webpack_require__(47);

	var _index = __webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 系统工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 主场景工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var sysBar = function (_Bar) {
	    _inherits(sysBar, _Bar);

	    function sysBar() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var controlBar = _ref.controlBar;
	        var container = _ref.container;
	        var pageMode = _ref.pageMode;
	        var pageTotal = _ref.pageTotal;
	        var currentPage = _ref.currentPage;

	        _classCallCheck(this, sysBar);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(sysBar).call(this));

	        _this.arrows = (0, _lang.hash)();
	        _this.curTips = null; //当前页码对象
	        _this.Lock = false; //操作锁
	        _this.delay = 50; //动画延时
	        _this.hasTopBar = true; //有顶部工具条
	        _this.controlBar = controlBar;
	        _this.container = container;
	        _this.pageMode = pageMode;
	        _this.pageTotal = pageTotal;
	        _this.currentPage = currentPage;

	        //配置属性
	        _this.initConfig();

	        _this._initTool();
	        return _this;
	    }

	    /**
	     * init tool
	     * @return {[type]} [description]
	     */


	    _createClass(sysBar, [{
	        key: '_initTool',
	        value: function _initTool() {

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

	        /**
	         * 工具条的位置
	         * @param  {[type]} bar      [description]
	         * @param  {[type]} position [description]
	         * @return {[type]}          [description]
	         */

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

	        /**
	         * 创建主页按钮
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'createHomeIcon',
	        value: function createHomeIcon(bar) {
	            var str = '<div id="backHome" style="float:left;text-indent:0.25em;height:{0}px;line-height:{1}px;color:#007aff">主页</div>',
	                height = this.iconHeight,
	                html = $(String.format(str, height, height));
	            bar.append(html);
	        }

	        /**
	         * 创建目录按钮
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'createDirIcon',
	        value: function createDirIcon(bar) {
	            var str = '<div id="backDir" class="xut-controlBar-backDir" style="float:left;margin-left:4px;width:{0}px;height:{1}px;background-size:cover"></div>',
	                height = this.iconHeight,
	                html = $(String.format(str, height, height));
	            bar.append(html);
	        }

	        /**
	         * 创建页码数
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

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

	        /**
	         * 工具栏隐藏按钮
	         * @param  {[type]} bar [description]
	         * @return {[type]}     [description]
	         */

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
	}(_bar2.default);

	exports.default = sysBar;

/***/ }

})
//# sourceMappingURL=0.b5ab52e3e55f7c2c8f3c.hot-update.js.map
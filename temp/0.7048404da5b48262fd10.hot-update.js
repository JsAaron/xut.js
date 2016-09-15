webpackHotUpdate(0,{

/***/ 149:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bar = __webpack_require__(24);

	var _bar2 = _interopRequireDefault(_bar);

	var _index = __webpack_require__(1);

	var _lang = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 函数工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var fnBar = function (_Bar) {
	    _inherits(fnBar, _Bar);

	    function fnBar() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var pageMode = _ref.pageMode;
	        var id = _ref.id;
	        var container = _ref.container;
	        var tbType = _ref.tbType;
	        var pageTotal = _ref.pageTotal;
	        var currentPage = _ref.currentPage;

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
	        _this.arrows = (0, _lang.hash)();
	        //options
	        _this.pageMode = pageMode;
	        _this.id = id;
	        _this.container = container;
	        _this.tbType = tbType;
	        _this.pageTotal = pageTotal;
	        _this.currentPage = currentPage;

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
	            html = '<div class="xut-nav-title" style="' + style + '">' + appName + '</div>';
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
//# sourceMappingURL=0.7048404da5b48262fd10.hot-update.js.map
webpackHotUpdate(0,{

/***/ 151:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.sysbar = undefined;

	var _Bar2 = __webpack_require__(168);

	var _index = __webpack_require__(14);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 系统工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 主场景工具栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var sysbar = function (_Bar) {
	    _inherits(sysbar, _Bar);

	    function sysbar(options) {
	        _classCallCheck(this, sysbar);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(sysbar).call(this));

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

	    return sysbar;
	}(_Bar2.Bar);

	exports.default = sysbar;


	sysbar.prototype.initTool = function () {

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
	};

	//工具条的位置
	sysbar.prototype.toolbarPostion = function (bar, position) {
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
	};

	//创建主页按钮
	sysbar.prototype.createHomeIcon = function (bar) {
	    var str = '<div id="backHome" style="float:left;text-indent:0.25em;height:{0}px;line-height:{1}px;color:#007aff">主页</div>',
	        height = this.iconHeight,
	        html = $(String.format(str, height, height));
	    bar.append(html);
	};

	//创建目录按钮
	sysbar.prototype.createDirIcon = function (bar) {
	    var str = '<div id="backDir" class="xut-controlBar-backDir" style="float:left;margin-left:4px;width:{0}px;height:{1}px;background-size:cover"></div>',
	        height = this.iconHeight,
	        html = $(String.format(str, height, height));
	    bar.append(html);
	};

	//创建页码数
	sysbar.prototype.createPageNum = function (bar) {
	    var height = this.iconHeight,
	        marginTop = height * 0.25,
	        iconH = height * 0.5,
	        str,
	        html;
	    str = '<div class="xut-controlBar-pageNum" style="float:right;margin:{0}px 4px;padding:0 0.25em;height:{1}px;line-height:{2}px;border-radius:0.5em"><span>{3}</span>/<span>{4}</span></div>';
	    html = $(String.format(str, marginTop, iconH, iconH, this.currentPage, this.pageTotal));
	    this.curTips = html.children().first();
	    bar.append(html);
	};

	//工具栏隐藏按钮
	sysbar.prototype.createHideToolbar = function (bar) {
	    var html,
	        style,
	        height = this.iconHeight;
	    style = 'float:right;width:' + height + 'px;height:' + height + 'px;background-size:cover';
	    html = '<div id="hideToolbar" class="xut-controlBar-hide" style="' + style + '"></div>';
	    bar.append(html);
	};

	//关闭子文档按钮
	sysbar.prototype.createCloseIcon = function (bar) {
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
	};

	//应用标题
	sysbar.prototype.createTitle = function (bar) {
	    var style,
	        html,
	        appName = this.appName,
	        height = this.iconHeight;
	    style = 'width:100%;position:absolute;line-height:' + height + 'px;pointer-events:none';
	    html = '<div class="xut-controlBar-title" style="z-index:-99;' + style + '">' + appName + '</div>';
	    bar.append(html);
	};

	/**
	 * [ 返回按钮]
	 * @return {[type]} [description]
	 */
	sysbar.prototype.createBackIcon = function (container) {
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
	};

	/**
	 * 更新页码指示
	 * @return {[type]} [description]
	 */
	sysbar.prototype.updatePointer = function (pageIndex) {
	    this.curTips && this.curTips.html(pageIndex + 1);
	};

	sysbar.prototype.bindButtonsEvent = function (bar) {
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
	};

	/**
	 * [ 跳转处理]
	 * @return {[type]} [description]
	 */
	sysbar.prototype.homeControl = function () {
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
	};

	/**
	 * [ 打开目录关闭当前页面活动热点]
	 * @return {[type]} [description]
	 */
	sysbar.prototype.navigationBar = function () {
	    (0, _index.oepn)(Xut.Presentation.GetPageIndex());
	};

	/**
	 * [ 显示顶部工具栏]
	 * @return {[type]} [description]
	 */
	sysbar.prototype.showTopBar = function () {
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
	};

	/**
	 * [ 隐藏顶部工具栏]
	 * @return {[type]} [description]
	 */
	sysbar.prototype.hideTopBar = function () {
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
	};

	//销毁 
	sysbar.prototype.destroy = function () {
	    this.controlBar.off();
	    this.controlBar = null;
	    this.arrows = null;
	    this.curTips = null;
	    this.barStatus = false;
	};

	exports.sysbar = sysbar;

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _svgicon = __webpack_require__(146);

	var _iconconfig = __webpack_require__(145);

	var _index = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var isIOS = Xut.plat.isIOS;

	/**
	 * 获取翻页按钮位置
	 * @return {[type]} [description]
	 */
	var arrowStyle = function arrowStyle() {
	    var height = _index.config.iconHeight;
	    var settings = _index.config.settings;
	    var styleText = 'height:' + height + 'px;width:' + height + 'px';
	    switch (settings.NavbarPos) {
	        case 0:
	            styleText += ';top:0';
	            break; //顶部
	        case 1:
	            styleText += ';margin-top:' + -height / 2 + 'px';
	            break; //中间
	        case 2:
	            styleText += ';top:auto;bottom:0';
	            break; //底部
	        default:
	            break;
	    }

	    return styleText;
	};

	var Bar = function () {
	    function Bar() {
	        _classCallCheck(this, Bar);

	        /**
	         * 系统状态栏高度
	         * @type {[type]}
	         */
	        this.barHeight = isIOS ? 20 : 0;

	        /**
	         * 默认创建左翻页按钮
	         * @type {Boolean}
	         */
	        this.enableLeft = true;

	        /**
	         * 默认创建右翻页按钮 
	         * @type {Boolean}
	         */
	        this.enableRight = true;
	    }

	    _createClass(Bar, [{
	        key: 'initConfig',
	        value: function initConfig(config) {
	            var propHeight;
	            //获取高度缩放比
	            //自动选择缩放比例
	            this.propHeight = propHeight = function () {
	                var layout = config.layoutMode,
	                    prop = config.proportion;
	                return layout == "horizontal" ? prop.width : prop.height;
	            }();

	            //获取图标高度
	            //工具栏图标高度
	            this.iconHeight = function () {
	                var height = config.iconHeight;
	                return isIOS ? height : Math.round(propHeight * height);
	            }();

	            this.appName = config.shortName; //应用标题
	            this.settings = config.settings; //应用默认配置
	        }

	        /**
	         * 创建翻页按钮
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createArrows',
	        value: function createArrows() {
	            //是否使用自定义的翻页按钮: true /false
	            //图标名称是客户端指定的：pageforward_'+appId+'.svg
	            var isCustom = this.settings.customButton;

	            if (this.enableLeft) {
	                isCustom ? this.createLeftIcon() : this.createLeftArrow();
	            }

	            if (this.enableRight) {
	                isCustom ? this.createRightIcon() : this.createRightArrow();
	            }
	        }

	        /**
	         * 左箭头翻页按钮
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createLeftArrow',
	        value: function createLeftArrow() {
	            var style = arrowStyle(),
	                state = this.barStatus ? '' : 'hide',
	                $dom;
	            $dom = $('<div class="si-icon xut-flip-control xut-flip-control-left ' + state + '" data-icon-name="prevArrow" style="' + style + '"></div>');

	            this.createSVGIcon($dom[0], function () {
	                Xut.View.GotoPrevSlide();
	            });

	            this.container.append($dom);
	            this.arrows.prev = {
	                el: $dom,
	                able: true
	            };
	        }

	        /**
	         * 右箭头翻页按钮
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createRightArrow',
	        value: function createRightArrow() {
	            var style = arrowStyle(),
	                state = this.barStatus ? '' : 'hide',
	                $dom;
	            $dom = $('<div class="si-icon xut-flip-control xut-flip-control-right ' + state + '" data-icon-name="nextArrow" style="' + style + '"></div>');

	            this.createSVGIcon($dom[0], function () {
	                Xut.View.GotoNextSlide();
	            });

	            this.container.append($dom);
	            this.arrows.next = {
	                el: $dom,
	                able: true
	            };
	        }

	        /**
	         * 自定义左翻页按钮
	         * [createLeftIcon description]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createLeftIcon',
	        value: function createLeftIcon() {
	            var style = arrowStyle(),
	                appId = this.config.appId,
	                state = this.barStatus ? '' : 'hide',
	                $dom;
	            style += ';background-image:url(images/icons/pageforward_' + appId + '.svg);background-size:cover';
	            $dom = $('<div name="prevArrow" class="xut-flip-control xut-flip-control-left ' + state + '" style="' + style + '"></div>');

	            $dom.on("touchend mouseup", function () {
	                Xut.View.GotoPrevSlide();
	            });

	            this.container.append($dom);
	            this.arrows.prev = {
	                el: $dom,
	                able: true
	            };
	        }

	        //自定义右翻页按钮

	    }, {
	        key: 'createRightIcon',
	        value: function createRightIcon() {
	            var style = arrowStyle(),
	                appId = this.config.appId,
	                state = this.barStatus ? '' : 'hide',
	                $dom;
	            style += ';background-image:url(images/icons/pageback_' + appId + '.svg);background-size:cover';
	            $dom = $('<div name="nextArrow" class="xut-flip-control xut-flip-control-right ' + state + '" style="' + style + '"></div>');

	            $dom.on("touchend mouseup", function () {
	                Xut.View.GotoNextSlide();
	            });

	            this.container.append($dom);
	            this.arrows.next = {
	                el: $dom,
	                able: true
	            };
	        }

	        /**
	         * [ description]
	         * @param  {[type]} dir [next,prev]
	         * @param  {[type]} status  [true/false]
	         * @return {[type]}       [description]
	         */

	    }, {
	        key: 'toggleArrow',
	        value: function toggleArrow(dir, status) {
	            var arrow = this.arrows[dir];
	            //如果没有创建翻页按钮,则不处理
	            if (!arrow) return;
	            arrow.able = status;
	            //如果人为隐藏了工具栏,则不显示翻页按钮
	            if (this.hasTopBar && !this.barStatus && status) {
	                return;
	            }
	            arrow.el[status ? 'show' : 'hide']();
	        }

	        //隐藏下一页按钮

	    }, {
	        key: 'hideNext',
	        value: function hideNext() {
	            this.toggleArrow('next', false);
	        }

	        //显示下一页按钮

	    }, {
	        key: 'showNext',
	        value: function showNext() {
	            this.toggleArrow('next', true);
	        }

	        //隐藏上一页按钮

	    }, {
	        key: 'hidePrev',
	        value: function hidePrev() {
	            this.toggleArrow('prev', false);
	        }

	        //显示上一页按钮

	    }, {
	        key: 'showPrev',
	        value: function showPrev() {
	            this.toggleArrow('prev', true);
	        }

	        /**
	         * [ 显示翻页按钮]
	         * @return {[type]}        [description]
	         */

	    }, {
	        key: 'showPageBar',
	        value: function showPageBar() {
	            var arrows = this.arrows;

	            for (var dir in arrows) {
	                var arrow = arrows[dir];
	                arrow.able && arrow.el.show();
	            }
	        }

	        /**
	         * [ 隐藏翻页按钮]
	         * @param  {[type]} unlock [description]
	         * @return {[type]}        [description]
	         */

	    }, {
	        key: 'hidePageBar',
	        value: function hidePageBar() {
	            var arrows = this.arrows;
	            for (var dir in arrows) {
	                arrows[dir].el.hide();
	            }
	        }

	        /**
	         * [description]
	         * @param  {[type]} state   [description]
	         * @param  {[type]} pointer [description]
	         * @return {[type]}         [description]
	         */

	    }, {
	        key: 'toggle',
	        value: function toggle(state, pointer) {
	            if (this.Lock) return;
	            this.Lock = true;

	            switch (state) {
	                case 'show':
	                    this.showToolbar(pointer);
	                    break;
	                case 'hide':
	                    this.hideToolbar(pointer);
	                    break;
	                default:
	                    this.barStatus ? this.hideToolbar(pointer) : this.showToolbar(pointer);
	                    break;
	            }
	        }

	        /**
	         * [ 显示工具栏]
	         * @param  {[type]} pointer [description]
	         * @return {[type]}         [description]
	         */

	    }, {
	        key: 'showToolbar',
	        value: function showToolbar(pointer) {
	            switch (pointer) {
	                case 'controlBar':
	                    this.showTopBar();
	                    break;
	                case 'button':
	                    this.showPageBar();
	                    this.Lock = false;
	                    break;
	                default:
	                    this.showTopBar();
	                    this.showPageBar();
	            }
	        }

	        /**
	         * [ 隐藏工具栏]
	         * @param  {[type]} pointer [description]
	         * @return {[type]}         [description]
	         */

	    }, {
	        key: 'hideToolbar',
	        value: function hideToolbar(pointer) {
	            switch (pointer) {
	                case 'controlBar':
	                    this.hideTopBar();
	                    break;
	                case 'button':
	                    this.hidePageBar();
	                    this.Lock = false;
	                    break;
	                default:
	                    this.hideTopBar();
	                    this.hidePageBar();
	            }
	        }

	        /**
	         * 显示IOS系统工具栏
	         *  iOS状态栏0=show,1=hide
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'showSystemBar',
	        value: function showSystemBar() {
	            isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
	        }

	        /**
	         * 隐藏IOS系统工具栏
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'hideSystemBar',
	        value: function hideSystemBar() {
	            isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
	        }

	        /**
	         * 创建SVG按钮
	         * @param  {[type]}   el       [description]
	         * @param  {Function} callback [description]
	         * @return {[type]}            [description]
	         */

	    }, {
	        key: 'createSVGIcon',
	        value: function createSVGIcon(el, callback) {
	            var options = {
	                speed: 6000,
	                size: {
	                    w: this.iconHeight,
	                    h: this.iconHeight
	                },
	                onToggle: callback
	            };
	            return new _svgicon.svgIcon(el, _iconconfig.iconConfig, options);
	        }

	        /**
	         * 重置翻页按钮,状态以工具栏为标准
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.barStatus ? this.showPageBar() : this.hidePageBar();
	        }
	    }]);

	    return Bar;
	}();

	exports.default = Bar;

/***/ }

})
//# sourceMappingURL=0.521e0853e6438829d6ab.hot-update.js.map
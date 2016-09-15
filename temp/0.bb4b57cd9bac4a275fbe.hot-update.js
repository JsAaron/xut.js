webpackHotUpdate(0,{

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ToolBar = undefined;

	var _svgicon = __webpack_require__(146);

	var _iconconfig = __webpack_require__(145);

	var isIOS = Xut.plat.isIOS;

	//获取翻页按钮位置
	var arrowStyle = function arrowStyle() {
	    var config = Xut.config;
	    var height = config.iconHeight;
	    var settings = config.settings;
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

	//工具栏基础类
	var ToolBar = Xut.CoreObject.extend({
	    barHeight: isIOS ? 20 : 0, //系统状态栏高度
	    enableLeft: true, //默认创建左翻页按钮
	    enableRight: true //默认创建右翻页按钮
	});

	ToolBar.prototype.initConfig = function (config) {
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
	};

	//创建翻页按钮
	ToolBar.prototype.createArrows = function () {
	    //是否使用自定义的翻页按钮: true /false
	    //图标名称是客户端指定的：pageforward_'+appId+'.svg
	    var isCustom = this.settings.customButton;

	    if (this.enableLeft) {
	        isCustom ? this.createLeftIcon() : this.createLeftArrow();
	    }

	    if (this.enableRight) {
	        isCustom ? this.createRightIcon() : this.createRightArrow();
	    }
	};

	//左箭头翻页按钮
	ToolBar.prototype.createLeftArrow = function () {
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
	};

	//右箭头翻页按钮
	ToolBar.prototype.createRightArrow = function () {
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
	};

	//自定义左翻页按钮
	ToolBar.prototype.createLeftIcon = function () {
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
	};

	//自定义右翻页按钮
	ToolBar.prototype.createRightIcon = function () {
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
	};

	/**
	 * [ description]
	 * @param  {[type]} dir [next,prev]
	 * @param  {[type]} status  [true/false]
	 * @return {[type]}       [description]
	 */
	ToolBar.prototype.toggleArrow = function (dir, status) {
	    var arrow = this.arrows[dir];
	    //如果没有创建翻页按钮,则不处理
	    if (!arrow) return;
	    arrow.able = status;
	    //如果人为隐藏了工具栏,则不显示翻页按钮
	    if (this.hasTopBar && !this.barStatus && status) {
	        return;
	    }
	    arrow.el[status ? 'show' : 'hide']();
	};

	//隐藏下一页按钮
	ToolBar.prototype.hideNext = function () {
	    this.toggleArrow('next', false);
	};

	//显示下一页按钮
	ToolBar.prototype.showNext = function () {
	    this.toggleArrow('next', true);
	};

	//隐藏上一页按钮
	ToolBar.prototype.hidePrev = function () {
	    this.toggleArrow('prev', false);
	};

	//显示上一页按钮
	ToolBar.prototype.showPrev = function () {
	    this.toggleArrow('prev', true);
	};

	/**
	 * [ 显示翻页按钮]
	 * @return {[type]}        [description]
	 */
	ToolBar.prototype.showPageBar = function () {
	    var arrows = this.arrows;

	    for (var dir in arrows) {
	        var arrow = arrows[dir];
	        arrow.able && arrow.el.show();
	    }
	};

	/**
	 * [ 隐藏翻页按钮]
	 * @param  {[type]} unlock [description]
	 * @return {[type]}        [description]
	 */
	ToolBar.prototype.hidePageBar = function () {
	    var arrows = this.arrows;
	    for (var dir in arrows) {
	        arrows[dir].el.hide();
	    }
	};

	/**
	 * [description]
	 * @param  {[type]} state   [description]
	 * @param  {[type]} pointer [description]
	 * @return {[type]}         [description]
	 */
	ToolBar.prototype.toggle = function (state, pointer) {
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
	};

	/**
	 * [ 显示工具栏]
	 * @param  {[type]} pointer [description]
	 * @return {[type]}         [description]
	 */
	ToolBar.prototype.showToolbar = function (pointer) {
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
	};

	/**
	 * [ 隐藏工具栏]
	 * @param  {[type]} pointer [description]
	 * @return {[type]}         [description]
	 */
	ToolBar.prototype.hideToolbar = function (pointer) {
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
	};

	/**
	 * 显示IOS系统工具栏
	 *  iOS状态栏0=show,1=hide
	 * @return {[type]} [description]
	 */
	ToolBar.prototype.showSystemBar = function () {
	    isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
	};

	/**
	 * 隐藏IOS系统工具栏
	 * @return {[type]} [description]
	 */
	ToolBar.prototype.hideSystemBar = function () {
	    isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
	};

	//创建SVG按钮
	ToolBar.prototype.createSVGIcon = function (el, callback) {
	    var options = {
	        speed: 6000,
	        size: {
	            w: this.iconHeight,
	            h: this.iconHeight
	        },
	        onToggle: callback
	    };
	    return new _svgicon.svgIcon(el, _iconconfig.iconConfig, options);
	};

	//重置翻页按钮,状态以工具栏为标准
	ToolBar.prototype.reset = function () {
	    this.barStatus ? this.showPageBar() : this.hidePageBar();
	};

	exports.ToolBar = ToolBar;

/***/ }

})
//# sourceMappingURL=0.bb4b57cd9bac4a275fbe.hot-update.js.map
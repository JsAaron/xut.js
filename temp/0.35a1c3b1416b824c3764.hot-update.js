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
	 * 执行动画
	 */
	var toAnimation = function toAnimation(navControl, navhandle, action) {

	    var complete = function complete() {
	        //恢复css
	        navControl.css(Xut.style.transition, '');
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
	        navControl.animate({
	            'z-index': Xut.zIndexlevel(),
	            'opacity': 1
	        }, 'fast', 'linear', function () {
	            navhandle.attr('fly', 'out');
	            complete();
	        });
	    } else {
	        //隐藏
	        navhandle.attr('fly', 'in');
	        navControl.hide();
	        complete();
	    }
	};

	var _controlNav = function _controlNav() {

	    //控制按钮
	    var navhandle = $(".xut-control-backdir");
	    var navControl = $(".xut-nav-bar");

	    //判断点击的动作
	    var action = navhandle.attr('fly') || 'in';

	    //初始化目录栏的样式
	    //能够显示出来
	    sectionInstance.state = false;
	    if (action == 'in') {
	        sectionInstance.state = true;
	        navControl.css({
	            'z-index': 0,
	            'opacity': 0,
	            'display': 'block'
	        });
	    }

	    //触发控制条
	    navhandle.css('opacity', action === "in" ? 0.5 : 1);

	    //执行动画
	    toAnimation(navControl, navhandle, action);
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
	    _controlNav();
	};

	/**
	 * 预先缓存加载
	 * @return {[type]} [description]
	 */
	var _create = function _create(pageIndex) {
	    (0, _html2.default)($(".xut-navbar"), function (data) {
	        //目录对象
	        sectionInstance = new _section2.default(data);
	        //初始化滑动
	        sectionInstance.userIscroll(pageIndex);
	        //初始缩略图
	        sectionInstance.createThumb();
	        //初始化样式
	        _initialize();
	    });
	};

	/**
	 * 目录
	 */
	function createNavbar(pageIndex) {
	    lockAnimation = false;
	    if (sectionInstance) {
	        _initialize();
	    } else {
	        _create(pageIndex);
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

/***/ }

})
//# sourceMappingURL=0.35a1c3b1416b824c3764.hot-update.js.map
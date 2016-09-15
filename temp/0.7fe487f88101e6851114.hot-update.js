webpackHotUpdate(0,{

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.disable = exports.ShowTextBusy = exports.HideBusy = exports.ShowBusy = undefined;
	exports.createCursor = createCursor;

	var _index = __webpack_require__(1);

	/**
	 * 用css3实现的忙碌光标
	 * @return {[type]} [description]
	 */
	var transform = Xut.style.transform;
	var animationDelay = Xut.style.animationDelay;

	/**
	 * 延时加载
	 * @type {Number}
	 */
	var delay = 1000;

	/**
	 * 光标对象
	 * @type {[type]}
	 */
	var node = null;

	/**
	 * 是否禁用忙了光标
	 * @type {Boolean}
	 */
	var isDisable = false;

	/**
	 * 光标状态
	 * 调用隐藏
	 * @type {Boolean}
	 */
	var isCallHide = false;

	/**
	 * setTimouet
	 * @type {[type]}
	 */
	var timer = null;

	/**
	 * create
	 * @return {[type]} [description]
	 */
	function createCursor() {
	    if (isDisable) return;
	    var sWidth = _index.config.screenSize.width;
	    var sHeight = _index.config.screenSize.height;
	    var width = Math.min(sWidth, sHeight) / 4;
	    var space = Math.round((sHeight - width) / 2);
	    var delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833];
	    var deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

	    var count = 12;
	    var html = '';
	    var container = '';

	    while (count--) {
	        html = '<div class="xut-busy-spinner" style="' + '{{transform}}:rotate({{rotate}}deg) translate(0,-142%);' + '{{animation}}:-{{delay}}s">' + '</div>';
	        container += _.template(html, {
	            transform: transform,
	            rotate: deg[count],
	            animation: animationDelay,
	            delay: delay[count]
	        });
	    }

	    html = '<div style="width:{{width}}px;height:{{height}}px;margin:{{margin}}px auto;">' + ' <div style="height:30%;"></div>' + ' <div class="xut-busy-middle">{{container}}</div>' + ' <div class="xut-busy-text"></div>' + '</div>';

	    container = _.template(html, {
	        width: width,
	        height: width,
	        margin: space,
	        container: container
	    });

	    node = $('#xut-busy-icon').html(container);
	}

	var clear = function clear() {
	    clearTimeout(timer);
	    timer = null;
	};

	/**
	 * 显示光标
	 */
	var ShowBusy = exports.ShowBusy = function ShowBusy() {
	    if (isDisable || Xut.IBooks.Enabled || timer) return;
	    timer = setTimeout(function () {
	        node.show();
	        clear();
	        if (isCallHide) {
	            HideBusy();
	            isCallHide = false;
	        }
	    }, delay);
	};

	/**
	 * 隐藏光标
	 */
	var HideBusy = exports.HideBusy = function HideBusy(IsPay) {
	    //显示忙碌加锁，用于不处理hideBusy
	    if (isDisable || Xut.IBooks.Enabled || ShowBusy.lock) return;
	    if (!timer) {
	        node.hide();
	    } else {
	        isCallHide = true;
	    }
	    IsPay && node.css('pointer-events', '').find('.xut-busy-text').html('');
	};

	/**
	 * 显示光标
	 * @param {[type]} txt [description]
	 */
	var ShowTextBusy = exports.ShowTextBusy = function ShowTextBusy(txt) {
	    if (isDisable || Xut.IBooks.Enabled) return;
	    node.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
	    ShowBusy();
	};

	/**
	 * 禁用光标
	 * isDisable 是否禁用
	 * @return {[type]} [description]
	 */
	var disable = exports.disable = function disable(state) {
	    isDisable = state;
	};

/***/ }

})
//# sourceMappingURL=0.7fe487f88101e6851114.hot-update.js.map
webpackHotUpdate(0,{

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = createHTML;

	var _layout = __webpack_require__(44);

	var _nexttick = __webpack_require__(3);

	var _nexttick2 = _interopRequireDefault(_nexttick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 创建dom
	 */
	function createHTML(artControl, callback) {

	    var pageArray = [];

	    Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', function (item) {
	        pageArray.push(item);
	    });

	    //显示下拉菜单
	    (0, _nexttick2.default)({
	        'container': artControl,
	        'content': (0, _layout.nav)(pageArray)
	    }, function () {
	        callback(pageArray);
	    });
	}

/***/ }

})
//# sourceMappingURL=0.368a34d2fb5faf3b1670.hot-update.js.map
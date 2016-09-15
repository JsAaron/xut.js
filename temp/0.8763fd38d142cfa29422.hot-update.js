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
	function createHTML(container, callback) {

	    var data = [];

	    Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', function (item) {
	        data.push(item);
	    });

	    (0, _nexttick2.default)({
	        'container': container,
	        'content': (0, _layout.nav)(data)
	    }, function () {
	        callback(data);
	    });
	}

/***/ }

})
//# sourceMappingURL=0.8763fd38d142cfa29422.hot-update.js.map
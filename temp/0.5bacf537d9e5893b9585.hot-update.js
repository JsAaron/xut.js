webpackHotUpdate(0,{

/***/ 109:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Destroy;

	var _controller = __webpack_require__(13);

	var _index = __webpack_require__(14);

	var _manager = __webpack_require__(6);

	var _manager2 = __webpack_require__(4);

	var _destroy = __webpack_require__(99);

	var _destroy2 = _interopRequireDefault(_destroy);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 销毁接口
	 */
	function Destroy() {
	    if (Xut.plat.isBrowser) {
	        //销毁桌面控制
	        $(document).off();
	    }

	    //DYNAMICCONFIGT模式销毁节点
	    if (window.DYNAMICCONFIGT) {
	        window.DYNAMICCONFIGT.removeNode();
	    }

	    //销毁所有场景
	    _controller.sceneController.destroyAllScene();

	    //删除数据库
	    (0, _destroy2.default)();

	    //导航
	    (0, _index.closeNavbar)();

	    //音视频
	    (0, _manager.clearAudio)();
	    (0, _manager2.clearVideo)();
	}

/***/ }

})
//# sourceMappingURL=0.5bacf537d9e5893b9585.hot-update.js.map
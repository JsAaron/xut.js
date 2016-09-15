webpackHotUpdate(0,{

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.promptMessage = promptMessage;
	exports.suspendHandles = suspendHandles;

	var _index = __webpack_require__(7);

	var _notice = __webpack_require__(48);

	var _index2 = __webpack_require__(14);

	var _manager = __webpack_require__(6);

	var _manager2 = __webpack_require__(4);

	/**
	 * [checkWidgets description]
	 * @param  {[type]} context   [description]
	 * @param  {[type]} pageIndex [description]
	 * @return {[type]}           [description]
	 */
	var checkWidgets = function checkWidgets(context, pageIndex) {
	    return (0, _index.recovery)();
	};

	/**
	 * 检测媒体的播放状态
	 *   1 视频
	 *   2 音频
	 * @param  {[type]} pageId [description]
	 * @return {[type]}        [description]
	 */
	/**
	 * 热点动作控制器模块
	 * 1 所有content热点停止
	 * 2 所有content热点销毁
	 * 3 app应用销毁
	 */
	var checkMedia = function checkMedia(pageId) {
	    //音频 视频 是否有处理
	    var flag = false;

	    if ((0, _manager.clearAudio)(pageId)) {
	        flag = true;
	    }

	    if ((0, _manager2.clearVideo)()) {
	        flag = true;
	    }

	    return flag;
	};

	/**
	 * 消息提示框
	 * @param  {[type]} info [description]
	 * @return {[type]}      [description]
	 */
	function promptMessage(info) {
	    (0, _notice.show)({
	        hindex: Xut.Presentation.GetPageIndex(),
	        content: info || "再按一次将退回到主页",
	        time: 3000
	    });
	}

	/**
	 * 停止所有热点动作,并返回状态
	 * 1 content
	 * 2 widget
	 * 动画,视频,音频...........................
	 * 增加场景模式判断
	 */
	function suspendHandles(context, pageIndex, skipMedia) {

	    //是否存在运行中
	    var stateRun = false;

	    //处理音频
	    if (checkMedia(skipMedia)) {
	        stateRun = true;
	    }

	    //正在运行的热点
	    ///content,Action', 'Widget', 'ShowNote'
	    if (checkWidgets(context, pageIndex)) {
	        stateRun = true;
	    }

	    //处理导航
	    (0, _index2.closeNavbar)(function () {
	        stateRun = true;
	    });

	    return stateRun;
	}

/***/ }

})
//# sourceMappingURL=0.465bfc74bd0c5963cc67.hot-update.js.map
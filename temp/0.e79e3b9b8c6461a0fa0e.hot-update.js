webpackHotUpdate(0,{

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var _globalApi = __webpack_require__(108);

	var _manager = __webpack_require__(6);

	var _manager2 = __webpack_require__(4);

	var _fix = __webpack_require__(18);

	var _cursor = __webpack_require__(25);

	var _nexttick = __webpack_require__(3);

	var _nexttick2 = _interopRequireDefault(_nexttick);

	var _index2 = __webpack_require__(114);

	var _index3 = _interopRequireDefault(_index2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//nextTick
	//Pre initialized
	Xut.Version = 836;
	//A predictable state container for apps.
	// import store from './redex/store'


	if (Xut.plat.isBrowser) {
	    //Mobile browser automatically broadcast platform media processing
	    if (Xut.plat.noAutoPlayMedia) {
	        (0, _fix.fixAudio)();
	    }
	    //Desktop binding mouse control
	    $(document).keyup(function (event) {
	        switch (event.keyCode) {
	            case 37:
	                Xut.View.GotoPrevSlide();
	                break;
	            case 39:
	                Xut.View.GotoNextSlide();
	                break;
	        }
	    });
	}

	Xut.Application.Launch = function () {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var el = _ref.el;
	    var paths = _ref.paths;
	    var cursor = _ref.cursor;


	    var $el = $(el);
	    if (!$el.length) {
	        console.log('Must pass a root node');
	        return;
	    }

	    Xut.Application.supportLaunch = true;

	    /**
	     * add dynamic config
	     * @type {Object}
	     */
	    window.DYNAMICCONFIGT = {
	        resource: paths.resource,
	        database: paths.database
	    };

	    var busyIcon = '<div id="xut-busyIcon" class="xut-busy-wrap xut-fullscreen"></div>';

	    //disable cursor
	    if (!cursor) {
	        (0, _cursor.disable)(true);
	        busyIcon = '';
	    }

	    var $html = $('\n    ' + busyIcon + '\n    <div class="xut-removelayer"></div>\n    <div class="xut-startupPage xut-fullscreen"></div>\n    <div id="xut-scene-container" class="xut-chapter xut-fullscreen xut-overflow"></div>');

	    $el.css('z-index', 99999);

	    window.DYNAMICCONFIGT.removeNode = function () {
	        $html.remove();
	        $html = null;
	        $el = null;
	    };

	    (0, _nexttick2.default)({
	        container: $el,
	        content: $html
	    }, _index3.default);
	};

	var createMain = function createMain() {
	    var rootNode = $("#xxtppt-app-container");
	    var nodeHhtml = '<div id="xxtppt-app-container" class="xut-chapter xut-fullscreen xut-overflow"></div>';
	    var tempHtml = '<div id="xut-busyIcon" class="xut-busy-wrap xut-fullscreen"></div>\n                    <div class="xut-removelayer"></div>\n                    <div class="xut-startupPage xut-fullscreen"></div>\n                    <div id="xut-scene-container" class="xut-chapter xut-fullscreen xut-overflow"></div>';

	    var $html = void 0;
	    if (rootNode.length) {
	        $html = $(tempHtml);
	    } else {
	        rootNode = $('body');
	        $html = $('<div id="xxtppt-app-container" class="xut-chapter xut-fullscreen xut-overflow">' + tempHtml + '</div>');
	    }
	    (0, _nexttick2.default)({
	        container: rootNode,
	        content: $html
	    }, function () {
	        (0, _index3.default)();
	    });
	};

	setTimeout(function () {
	    //External interface call
	    if (!Xut.Application.supportLaunch) {
	        Xut.Application.Launch = null;
	        $("#xxtppt-app-container").remove();
	        (0, _index3.default)();
	    }
	}, 0);

/***/ }

})
//# sourceMappingURL=0.e79e3b9b8c6461a0fa0e.hot-update.js.map
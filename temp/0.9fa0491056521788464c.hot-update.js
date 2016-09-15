webpackHotUpdate(0,{

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.home = home;
	exports.scene = scene;

	var _index = __webpack_require__(1);

	var round = Math.round; /**
	                         * 布局文件
	                         * 1 控制条
	                         * 2 导航栏
	                         * @param  {[type]} config [description]
	                         * @return {[type]}        [description]
	                         */

	var ratio = 6;
	var isIOS = Xut.plat.isIOS;
	var TOP = isIOS ? 20 : 0;

	var getOptions = function getOptions() {
	    var iconHeight = _index.config.iconHeight;
	    var proportion = _index.config.proportion;
	    var calculate = proportion.calculateContainer();

	    //横版模式
	    var isHorizontal = _index.config.layoutMode == 'horizontal';

	    proportion = isHorizontal ? proportion.width : proportion.height;
	    iconHeight = isIOS ? iconHeight : round(proportion * iconHeight);

	    return {
	        isHorizontal: isHorizontal,
	        iconHeight: iconHeight,
	        sWidth: calculate.width,
	        sHeight: calculate.height,
	        sTop: calculate.top,
	        sLeft: calculate.left,
	        calculate: calculate,
	        proportion: proportion
	    };
	};

	/**
	 * 首页布局
	 * @return {[type]} [description]
	 */
	function home() {

	    var options = getOptions();
	    var sWidth = options.sWidth;
	    var sHeight = options.sHeight;
	    var iconHeight = options.iconHeight;
	    var calculate = options.calculate;
	    var isHorizontal = options.isHorizontal;

	    var html = '';
	    var template = void 0;
	    var navBar = void 0;
	    var container = void 0;

	    //导航
	    html = '<div id="navBar" class="xut-navBar" style="' + 'width:{{width}};' + 'height:{{height}}px;' + 'top:{{top}};' + 'left:{{left}};' + 'bottom:{{bottom}};' + 'background-color:white;' + 'border-top:1px solid rgba(0,0,0,0.1);' + 'overflow:{{overflow}};' + '"></div>';

	    navBar = _.template(html, {
	        width: isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px',
	        height: isHorizontal ? round(sHeight / ratio) : round((sHeight - iconHeight - TOP) * 0.96),
	        top: isHorizontal ? '' : iconHeight + TOP + 2 + 'px',
	        left: isHorizontal ? '' : iconHeight + 'px',
	        overflow: isHorizontal ? 'hidden' : 'visible',
	        bottom: isHorizontal ? '4px' : ''
	    });

	    //主体
	    html = '<div id="sceneHome" class="xut-chapter" style="' + 'width:{{width}}px;' + 'height:{{height}}px;' + 'top:{{top}}px;' + 'left:{{left}}px;' + 'overflow:hidden;' + 'z-index:{{index}};' + 'overflow:{{overflow}};" >' + ' <div id="controlBar" class="xut-controlBar hide"></div>' +
	    //页面节点
	    ' <ul id="pageContainer" class="xut-flip"></ul>' +
	    //视觉差包装容器
	    ' <ul id="masterContainer" class="xut-master xut-flip"></ul>' +
	    //滑动菜单
	    ' {{navBar}}' +
	    //消息提示框
	    ' <div id="toolTip"></div>' + '</div>';

	    return _.template(html, {
	        width: _index.config.viewSize.width,
	        height: _index.config.viewSize.height,
	        top: calculate.top,
	        left: calculate.left,
	        index: Xut.sceneController.createIndex(),
	        overflow: _index.config.scrollPaintingMode ? 'visible' : 'hidden',
	        navBar: navBar
	    });
	}

	/**
	 * [scene 创建场景]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	function scene(id) {

	    var options = getOptions();

	    var sWidth = options.sWidth;
	    var sHeight = options.sHeight;
	    var calculate = options.calculate;

	    var html = '<div id="{{id}}" style="' + 'width:{{width}}px;' + 'height:{{height}}px;' + 'top:{{top}}px;' + 'left:{{left}}px;' + 'position:absolute;' + 'z-index:{{zIndex}};' + 'overflow:{{overflow}};' + '">' + ' <ul id="{{pageId}}" class="xut-flip" style="z-index:{{zIndexPage}}"></ul>' + ' <ul id="{{masterId}}" class="xut-flip" style="z-index:{{zIndexMaster}}"></ul>' + '</div>';

	    return _.template(html, {
	        id: 'scenario-' + id,
	        width: _index.config.viewSize.width,
	        height: _index.config.viewSize.height,
	        top: calculate.top,
	        left: calculate.left,
	        zIndex: Xut.sceneController.createIndex(),
	        overflow: _index.config.scrollPaintingMode ? 'visible' : 'hidden',
	        pageId: 'scenarioPage-' + id,
	        zIndexPage: 2,
	        masterId: 'scenarioMaster-' + id,
	        zIndexMaster: 1
	    });
	}

/***/ }

})
//# sourceMappingURL=0.9fa0491056521788464c.hot-update.js.map
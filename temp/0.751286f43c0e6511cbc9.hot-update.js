webpackHotUpdate(0,{

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.home = home;
	exports.scene = scene;
	exports.nav = nav;

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

	    var navBarWidth = isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px';
	    var navBarHeight = isHorizontal ? round(sHeight / ratio) : round((sHeight - iconHeight - TOP) * 0.96);
	    var navBarTop = isHorizontal ? '' : iconHeight + TOP + 2 + 'px';
	    var navBarLeft = isHorizontal ? '' : iconHeight + 'px';
	    var navBarBottom = isHorizontal ? '4px' : '';
	    var navBaroOverflow = isHorizontal ? 'hidden' : 'visible';

	    //导航
	    var navBarHTML = '<div class="xut-navBar" \n              style="width:' + navBarWidth + ';\n                     height:' + navBarHeight + 'px;\n                     top:' + navBarTop + ';\n                     left:' + navBarLeft + ';\n                     bottom:' + navBarBottom + ';\n                     background-color:white;\n                     border-top:1px solid rgba(0,0,0,0.1);\n                     overflow:' + navBaroOverflow + ';">\n        </div>';
	    console.log(navBarHTML);

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

	var getNavOptions = function getNavOptions() {

	    //导航菜单宽高
	    var navHeight = void 0,
	        navWidth = void 0;
	    var options = getOptions();
	    var sWidth = options.sWidth;
	    var sHeight = options.sHeight;
	    var proportion = options.proportion;
	    var isHorizontal = options.isHorizontal;

	    //横版模版
	    if (isHorizontal) {
	        navHeight = round(sHeight / ratio);
	    } else {
	        navWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3);
	        navHeight = round((sHeight - options.iconHeight - TOP) * 0.96);
	    }

	    return {
	        sWidth: sWidth,
	        sHeight: sHeight,
	        navHeight: navHeight,
	        navWidth: navWidth,
	        proportion: proportion
	    };
	};

	//获得css配置数据
	var getWrapper = function getWrapper(seasonlist) {

	    var width = void 0,
	        height = void 0,
	        blank = void 0,
	        scroller = void 0,
	        contentstyle = void 0,
	        containerstyle = void 0,
	        overwidth = void 0,
	        overHeigth = void 0;

	    //获得css配置数据
	    var options = getNavOptions();
	    var font = round(options.proportion * 2);

	    var navWidth = options.navWidth;
	    var navHeight = options.navHeight;
	    var sWidth = options.sWidth;
	    var sHeight = options.sHeight;

	    if (_index.config.layoutMode == 'horizontal') {
	        height = round(navHeight * 0.9);
	        width = round(height * sWidth / sHeight); //保持缩略图的宽高比
	        blank = round(navHeight * 0.05); //缩略图之间的间距
	        scroller = 'width:' + seasonlist * (width + blank) + 'px>';
	        contentstyle = 'float:left;width:' + width + 'px;height:' + height + 'px;margin-left:' + blank + 'px';
	        containerstyle = 'width:96%;height:' + height + 'px;margin:' + blank + 'px auto;font-size:' + font + 'em';
	        //横版左右滑动
	        //溢出长度+上偏移量
	        overwidth = width * seasonlist + seasonlist * blank;
	    } else {
	        width = round(navWidth * 0.9);
	        height = round(navWidth * 1.1);
	        blank = round(navWidth * 0.05);
	        contentstyle = 'width:' + width + 'px;height:' + height + 'px;margin:' + blank + 'px auto;border-bottom:1px solid rgba(0,0,0,0.3)';
	        containerstyle = 'height:' + (navHeight - 4) + 'px;overflow:hidden;margin:2px auto;font-size:' + font + 'em';
	        //竖版上下滑动
	        overHeigth = height * seasonlist + seasonlist * blank;
	    }

	    return {
	        contentstyle: contentstyle,
	        containerstyle: containerstyle,
	        overwidth: overwidth,
	        overHeigth: overHeigth,
	        scroller: scroller
	    };
	};

	/**
	 * [nav 导航菜单]
	 * @param  {[type]} seasonSqlRet [description]
	 * @return {[type]}              [description]
	 */
	function nav(seasonSqlRet) {

	    var seasonId = void 0,
	        chapterId = void 0,
	        data = void 0,
	        xxtlink = void 0;
	    var seasonlist = seasonSqlRet.length;
	    var options = getWrapper(seasonlist);

	    var list = '';
	    var i = 0;

	    for (i; i < seasonlist; i++) {
	        data = seasonSqlRet[i];
	        seasonId = data.seasonId;
	        chapterId = data._id;
	        xxtlink = seasonId + '-' + chapterId;
	        list += '<li style="' + options.contentstyle + '">';
	        list += '  <div class="xut-navBar-box" data-xxtlink = "' + xxtlink + '">' + (i + 1) + '</div>';
	        list += '</li>';
	    }

	    //导航
	    var html = '<div id="SectionWrapper" style="{{style}}">' + '  <div id="Sectionscroller" style="width:{{width}}px;height:{{height}}px;{{scroller}}">' + '    <ul id="SectionThelist">' + '       {{list}}' + '    </ul>' + '  </div>' + '</div>';

	    return _.template(html, {
	        style: options.containerstyle,
	        width: options.overwidth,
	        height: options.overHeigth,
	        scroller: options.scroller,
	        list: list
	    });
	}

/***/ }

})
//# sourceMappingURL=0.751286f43c0e6511cbc9.hot-update.js.map
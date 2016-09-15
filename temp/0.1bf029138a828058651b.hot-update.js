webpackHotUpdate(0,{

/***/ 118:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Mediator = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(22);

	var _index2 = __webpack_require__(45);

	var _index3 = _interopRequireDefault(_index2);

	var _index4 = __webpack_require__(115);

	var _hooks = __webpack_require__(38);

	var _filter = __webpack_require__(117);

	var _dynamicApi = __webpack_require__(107);

	var _dynamicApi2 = _interopRequireDefault(_dynamicApi);

	var _index5 = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*********************************************************************
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *              场景容器构造器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *          1 构件页面级容器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *          2 翻页全局事件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                **********************************************************************/

	//定义访问器


	/**
	 * 部分配置文件
	 */
	var pageConf = {
	    //数据库定义的翻页模式
	    //用来兼容客户端的制作模式
	    //妙妙学模式处理，多页面下翻页切换
	    //0 翻页滑动
	    //1 没有滑动过程,直接切换页面
	    'pageFlip': 0,

	    //翻页模式
	    //根据页码数决定,主要是优化一些代码
	    //true  是多页面模式,支持翻页滑动
	    //false 单页面模式,不能翻页，只能跳转
	    'pageMode': false,

	    //是否多场景加载
	    //单页场景 false
	    //多场景   true
	    'multiScenario': false,

	    //是否为连续页面
	    //通过pageMode的参数定义
	    'multiplePages': false
	};

	/**
	 * 配置多页面参数
	 * @return {[type]} [description]
	 */
	var configMultiple = function configMultiple(options) {
	    //如果是epub,强制转换为单页面
	    if (Xut.IBooks.Enabled) {
	        options.multiplePages = false;
	    } else {
	        //判断多页面情况
	        //1 数据库定义
	        //2 系统优化
	        options.multiplePages = options.pageFlip ? options.pageFlip : options.pageMode ? true : false;
	    }
	};

	/**
	 * 判断处理那个页面层次
	 * 找到pageType类型
	 * 项目分4个层
	 * page mater page浮动 mater浮动
	 * 通过
	 * 因为冒泡的元素，可能是页面层，也可能是母板上的
	 * @return {Boolean} [description]
	 */
	var isBelong = function isBelong(target) {
	    var pageType = 'page';
	    if (target.dataset && target.dataset.belong) {
	        pageType = target.dataset.belong;
	    }
	    return pageType;
	};

	/**
	 * 阻止元素的默认行为
	 * 在火狐下面image带有href的行为
	 * 会自动触发另存为
	 * @return {[type]} [description]
	 *
	 * 2016.3.18
	 * 妙妙学 滚动插件默认行为被阻止
	 *
	 * 2016.7.26
	 * 读库强制PC模式了
	 */
	var preventDefault = function preventDefault(evtObj, target) {
	    //var tagName = target.nodeName.toLowerCase();
	    if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !window.MMXCONFIG && !window.DUKUCONFIG) {
	        evtObj.preventDefault && evtObj.preventDefault();
	    }
	};

	var Mediator = function (_Observer) {
	    _inherits(Mediator, _Observer);

	    function Mediator(parameter) {
	        _classCallCheck(this, Mediator);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mediator).call(this));

	        var vm = _this;

	        //配置文件
	        var options = vm.options = _.extend(pageConf, parameter, {
	            pageFlip: Xut.config.pageFlip
	        });

	        //配置多页面参数
	        configMultiple(options);

	        var $globalEvent = vm.$globalEvent = new _index3.default(options);
	        var $dispatch = vm.$dispatch = new _index4.Dispatch(vm);

	        //如果是主场景,才能切换系统工具栏
	        if (options.multiplePages) {
	            _this.addTools(vm);
	        }

	        //事件句柄对象
	        var handlerObj = null;

	        /**
	         * 过滤器.全局控制函数
	         * return true 阻止页面滑动
	         */
	        $globalEvent.$watch('onFilter', function (hookCallback, point, evtObj) {
	            var target = point.target;
	            //阻止默认行为
	            preventDefault(evtObj, target);
	            //页面类型
	            var pageType = isBelong(target);
	            //根节点
	            var parentNode = $globalEvent.findRootElement(point, pageType);
	            //执行过滤处理
	            handlerObj = _filter.filterProcessor.call(parentNode, point, pageType);
	            //停止翻页,针对content对象可以拖动,滑动的情况处理
	            if (!handlerObj || handlerObj.attribute === 'disable') {
	                hookCallback();
	            }
	        });

	        /**
	         * 触屏滑动,通知pageMgr处理页面移动
	         * @return {[type]} [description]
	         */
	        $globalEvent.$watch('onMove', function (data) {
	            $dispatch.move(data);
	        });

	        /**
	         * 触屏松手点击
	         * 无滑动
	         */
	        $globalEvent.$watch('onTap', function (pageIndex, hookCallback) {
	            if (handlerObj) {
	                if (handlerObj.handlers) {
	                    handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex);
	                } else {
	                    if (!Xut.Contents.Canvas.getIsTap()) {
	                        vm.$emit('change:toggleToolbar');
	                    }
	                }
	                handlerObj = null;
	                hookCallback();
	            }
	        });

	        /**
	         * 触屏滑动,通知ProcessMgr关闭所有激活的热点
	         * @return {[type]}          [description]
	         */
	        $globalEvent.$watch('onUpSlider', function (pointers) {
	            $dispatch.suspend(pointers);
	        });

	        /**
	         * 翻页动画完成回调
	         * @return {[type]}              [description]
	         */
	        $globalEvent.$watch('onComplete', function (direction, pagePointer, unfliplock, isQuickTurn) {
	            $dispatch.complete(direction, pagePointer, unfliplock, isQuickTurn);
	        });

	        /**
	         * 切换页面
	         * @return {[type]}      [description]
	         */
	        $globalEvent.$watch('onJumpPage', function (data) {
	            $dispatch.jumpPage(data);
	        });

	        /**
	         * 退出应用
	         * @return {[type]}      [description]
	         */
	        $globalEvent.$watch('onDropApp', function (data) {
	            window.GLOBALIFRAME && Xut.publish('magazine:dropApp');
	        });

	        /**
	         * 母板移动反馈
	         * 只有存在data-parallaxProcessed
	         * 才需要重新激活对象
	         * 删除parallaxProcessed
	         */
	        $globalEvent.$watch('onMasterMove', function (hindex, target) {
	            if (/Content/i.test(target.id) && target.getAttribute('data-parallaxProcessed')) {
	                $dispatch.masterMgr && $dispatch.masterMgr.reactivation(target);
	            }
	        });

	        vm.$overrideApi();
	        return _this;
	    }

	    /**
	     * 系统工具栏
	     */


	    _createClass(Mediator, [{
	        key: 'addTools',
	        value: function addTools(vm) {

	            _.extend(_hooks.delegateHooks, {

	                /**
	                 * li节点,多线程创建的时候处理滑动
	                 */
	                'data-container': function dataContainer() {
	                    vm.$emit('change:toggleToolbar');
	                },


	                /**
	                 * 是背景层
	                 */
	                'data-multilayer': function dataMultilayer() {
	                    //改变工具条状态
	                    vm.$emit('change:toggleToolbar');
	                },


	                /**
	                 * 默认content元素可以翻页
	                 */
	                'data-behavior': function dataBehavior(target, attribute, rootNode, pageIndex) {
	                    //没有事件的元素,即可翻页又可点击切换工具栏
	                    if (attribute == 'click-swipe') {
	                        vm.$emit('change:toggleToolbar');
	                    }
	                }
	            });
	        }
	    }]);

	    return Mediator;
	}(_index.Observer);

	var medProto = Mediator.prototype;

	/**
	 * 是否多场景模式
	 */
	(0, _index5.defAccess)(medProto, '$multiScenario', {
	    get: function get() {
	        return this.options.multiScenario;
	    }
	});

	/**
	 * 动态注入对象接口
	 * 注入对象管理,注册所有widget组件对象
	 *  content类型  创建时注册
	 *  widget类型   执行时注册
	 *  widget 包括 视频 音频 Action 子文档 弹出口 类型
	 *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
	 */
	(0, _index5.defAccess)(medProto, '$injectionComponent', {
	    set: function set(regData) {
	        var injection;
	        if (injection = this.$dispatch[regData.pageType + 'Mgr']) {
	            injection.abstractAssistPocess(regData.pageIndex, function (pageObj) {
	                pageObj.baseRegisterComponent.call(pageObj, regData.widget);
	            });
	        } else {
	            console.log('注册injection失败,regData=' + regData);
	        }
	    }
	});

	/**
	 * 得到当前的视图页面
	 * @return {[type]}   [description]
	 */
	(0, _index5.defAccess)(medProto, '$curVmPage', {
	    get: function get() {
	        return this.$dispatch.pageMgr.abstractGetPageObj(this.$globalEvent.getHindex());
	    }
	});

	/**
	 *  监听viewmodel内部的状态的改变,触发后传入值
	 *
	 *  与状态有关的change:
	 *      翻页
	 *          'flipOver' : function(pageIndex) {},
	 *
	 *      切换工具栏
	 *          'toggleToolbar' : function(state, pointer) {},
	 *
	 *      复位工具栏
	 *          'resetToolbar'  : function() {},
	 *
	 *      隐藏下一页按钮
	 *          'hideNext'   : function(state) {},
	 *
	 *      显示下一页按钮
	 *          'showNext'   : function() {}
	 *
	 *  与创建相关
	 *      创建完毕回调
	 *          'createComplete': null,
	 *      创建后中断自动运行回调
	 *          'suspendAutoCallback': null
	 *
	 */
	(0, _index5.defProtected)(medProto, '$bind', function (key, callback) {
	    var vm = this;
	    vm.$watch('change:' + key, function () {
	        callback.apply(vm, arguments);
	    });
	});

	/**
	 * 创建页面
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$init', function () {
	    this.$dispatch.initCreate();
	});

	/**
	 * 运动动画
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$run', function () {
	    var vm = this;
	    vm.$dispatch.pageMgr.activateAutoRuns(vm.$globalEvent.getHindex(), Xut.Presentation.GetPageObj());
	});

	/**
	 * 复位对象
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$reset', function () {
	    return this.$dispatch.pageMgr.resetOriginal(this.$globalEvent.getHindex());
	});

	/**
	 * 停止所有任务
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$suspend', function () {
	    Xut.Application.Suspend({
	        skipMedia: true //跨页面不处理
	    });
	});

	/**
	 * 销毁场景内部对象
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$destroy', function () {
	    this.$off();
	    this.$globalEvent.destroy();
	    this.$dispatch.destroy();
	    this.$dispatch = null;
	    this.$globalEvent = null;
	});

	/**
	 * 设置所有API接口
	 * @return {[type]} [description]
	 */
	(0, _index5.defProtected)(medProto, '$overrideApi', function () {
	    (0, _dynamicApi2.default)(this);
	});

	exports.Mediator = Mediator;

/***/ }

})
//# sourceMappingURL=0.1bf029138a828058651b.hot-update.js.map
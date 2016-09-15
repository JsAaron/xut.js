webpackHotUpdate(0,{

/***/ 115:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Dispatch = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*********************************************************************
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                 调度器 生成页面模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *            处理：事件动作分派
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *            调度：
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                1. PageMgr     模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                2. MasterMgr 模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                                                                    *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      **********************************************************************/


	var _stroage = __webpack_require__(17);

	var _page = __webpack_require__(120);

	var _page2 = _interopRequireDefault(_page);

	var _master = __webpack_require__(119);

	var _master2 = _interopRequireDefault(_master);

	var _switch = __webpack_require__(116);

	var _switch2 = _interopRequireDefault(_switch);

	var _controller = __webpack_require__(13);

	var _index = __webpack_require__(14);

	var _depend = __webpack_require__(38);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Dispatch = exports.Dispatch = function () {
	    function Dispatch(vm) {
	        _classCallCheck(this, Dispatch);

	        this.vm = vm;

	        this.options = vm.options;

	        /**
	         * 创建前景页面管理模块
	         * @type {PageMgr}
	         */
	        this.pageMgr = new _page2.default(vm);

	        /**
	         * 检测是否需要创母版模块
	         * @return {[type]} [description]
	         */
	        if ((0, _depend.checkMasterCreate)()) {
	            this.masterMgr = new _master2.default(vm);
	        }
	    }

	    /**
	     * 初始化页面创建
	     * 因为多个页面的问题，所以不是创建调用
	     * 统一回调
	     * @return {[type]} [description]
	     */


	    _createClass(Dispatch, [{
	        key: 'initCreate',
	        value: function initCreate() {
	            var options = this.options;

	            //createPointer,
	            //initPointer
	            var pointer = (0, _depend.initPointer)(options.initIndex, options.pagetotal, options.multiplePages);

	            this.pagePointer = pointer.initPointer;

	            //始化构建页面
	            this.create(pointer.createPointer, options.initIndex, 'init');
	        }

	        /**
	         *  创建普通页面
	         *  创建母版页面
	         *  createPointer  需要创建的页面索引
	         *  visiblePage       当前可视区页面索引
	         *  action         toPage/init/flipOver
	         *  toPageCallback 跳转页面支持回调通知
	         *  userStyle      规定创建的style属性
	         **/

	    }, {
	        key: 'create',
	        value: function create(createPage, visiblePage, action, toPageCallback, userStyle) {

	            //2016.1.20
	            //修正苗苗学问题 确保createPage不是undefined
	            if (undefined === createPage[0]) {
	                return;
	            }

	            var virtualMode = Xut.config.virtualMode,
	                self = this,
	                multiplePages = this.options.multiplePages,
	                //是否线性
	            total = createPage.length,
	                toPageAction = action === 'toPage',
	                //如果是跳转
	            filpOverAction = action === 'flipOver',
	                //如果是翻页

	            //使用第一个是分解可见页面
	            //将页码pageIndex转化成对应的chapter
	            createPids = _depend.conversionCid.call(this, createPage, visiblePage),


	            //收集创建的页面对象
	            //用于处理2个页面在切换的时候闪屏问题
	            //主要是传递createStyle自定义样式的处理
	            collectCreatePageBase = [],


	            //是否触发母版的自动时间
	            //因为页面每次翻页都会驱动auto事件
	            //但是母版可能是共享的
	            createMaster = false,


	            //收集完成回调
	            collectCallback = function () {
	                //收集创建页码的数量
	                var createContent = 0;
	                return function (callback) {
	                    ++createContent;
	                    if (createContent === total) {
	                        callback();
	                    }
	                };
	            }(),


	            //构建执行代码
	            callbackAction = {
	                //初始化
	                init: function init() {
	                    collectCallback(function () {
	                        self._loadPage('init');
	                    });
	                },

	                //翻页
	                flipOver: function flipOver() {
	                    collectCallback(function () {
	                        self.autoRun({ //翻页
	                            'createPointer': createPids,
	                            'createMaster': createMaster
	                        });
	                    });
	                },

	                //跳转
	                toPage: function toPage() {
	                    collectCallback(function () {
	                        toPageCallback(collectCreatePageBase);
	                    });
	                }
	            };

	            //pid=>chpterData
	            var results = (0, _depend.conversionPids)(createPids);

	            //如果是最后一页
	            //没有对应的虚拟数据，取前一页的
	            if (virtualMode && !results.length) {
	                (function () {
	                    var virtualPid = _.extend([], createPids);
	                    createPids.forEach(function (pid, index) {
	                        virtualPid.splice(index, 1, --pid);
	                    });
	                    results = (0, _depend.conversionPids)(virtualPid);
	                })();
	            }

	            //页码转成数据
	            _.each(results, function (chapterData, index) {

	                //转化值
	                //chapterId => createPid
	                var createPid = createPids[index];

	                //createPid
	                //pageIndex
	                var conversion = _depend.conversionPageOpts.call(self, createPid, visiblePage);
	                var visiblePid = conversion.visiblePid;
	                var pageIndex = conversion.pageIndex;

	                ////////////////
	                // 如果启动了虚拟页面模式 //
	                ////////////////
	                var virtualPid = false; //虚拟页面的pid编号
	                var virtualOffset = false; //页面坐标left,right
	                if (virtualMode) {
	                    //页面位置
	                    virtualOffset = (0, _depend.offsetPage)(pageIndex);

	                    //获取新的chpater数据
	                    var fixCids = function fixCids(originalIndex) {
	                        var originalPid = _depend.conversionCid.call(self, [originalIndex]);
	                        return (0, _depend.conversionPids)([originalPid])[0];
	                    };

	                    ////////////
	                    //如果是翻页创建 //
	                    //由于是拼接的所以chapter移位了
	                    ////////////
	                    if (virtualOffset === 'left') {
	                        chapterData = fixCids(pageIndex / 2);
	                    }
	                    //修正右边chapter
	                    if (virtualOffset === 'right') {
	                        chapterData = fixCids((pageIndex - 1) / 2);
	                    }
	                }

	                if (total === 1) {
	                    self.options.chapterId = chapterData._id;
	                }

	                /**
	                 * 构件新的页面
	                 * masterFilter 母板过滤器回调函数
	                 * @param  {[type]} masterFilter [description]
	                 * @return {[type]}              [description]
	                 */
	                var createMgr = function createMgr(masterFilter) {

	                    //跳转的时候，创建新页面可以自动样式信息
	                    //优化设置，只是改变当前页面即可
	                    if (toPageAction && visiblePid !== createPid) {
	                        userStyle = undefined;
	                    }

	                    var dataOpts = {
	                        'pageIndex': pageIndex,
	                        'multiplePages': multiplePages,
	                        'pid': createPid, //页码chapterId
	                        'chapterDas': chapterData, //当前页面的chpater数据
	                        'visiblePid': visiblePid, //实际中页面显示的索引
	                        'userStyle': userStyle,
	                        'virtualPid': virtualPid, //pid
	                        'virtualOffset': virtualOffset //虚拟页面位置
	                    };

	                    //初始化构建页面对象
	                    //page
	                    //master
	                    var pageBase = this.create(dataOpts, pageIndex, masterFilter);

	                    //构建页面对象后
	                    //开始执行
	                    if (pageBase) {
	                        //开始线程任务
	                        //当为滑动模式,支持快速创建
	                        pageBase.startThreadTask(filpOverAction, function () {
	                            return callbackAction[action]();
	                        });

	                        //收集自定义样式的页面对象
	                        if (userStyle) {
	                            collectCreatePageBase.push(pageBase);
	                        }
	                    }
	                };

	                //母版层
	                if (chapterData.pptMaster && self.masterMgr) {
	                    createMgr.call(self.masterMgr, function () {
	                        //母版是否创建等待通知
	                        //母版是共享的所以不一定每次翻页都会创建
	                        //如果需要创建,则叠加总数
	                        ++total;
	                        createMaster = true;
	                    });
	                }

	                //页面层
	                createMgr.call(self.pageMgr);
	            });
	        }

	        /**
	         * 自动运行处理
	         *  流程四:执行自动触发动作
	         *   1.初始化创建页面完毕
	         *   2.翻页完毕
	         */

	    }, {
	        key: 'autoRun',
	        value: function autoRun(para) {
	            var options = this.options,
	                pagePointer = this.pagePointer,
	                prevIndex = pagePointer.leftIndex,
	                currIndex = pagePointer.currIndex,
	                nextIndex = pagePointer.rightIndex,
	                action = para ? para.action : '',
	                createPointer = para ? para.createPointer : '',
	                direction = this.direction,

	            //暂停的页面索引autorun
	            suspendIndex = action === 'init' ? '' : direction === 'next' ? prevIndex : nextIndex;

	            /**
	             * 存在2中模式的情况下
	             * 转化页码标记
	             */
	            if (createPointer) {
	                createPointer = _depend.conversionPageOpts.call(this, createPointer);
	            }

	            var data = {
	                'prevIndex': prevIndex,
	                'currIndex': currIndex,
	                'nextIndex': nextIndex,
	                'suspendIndex': suspendIndex,
	                'createPointer': createPointer,
	                'direction': direction,
	                'isQuickTurn': this.isQuickTurn,
	                //中断通知
	                'suspendCallback': options.suspendAutoCallback,
	                //构建完毕通知
	                'buildComplete': function buildComplete(scenarioId) {
	                    //==========================================
	                    //
	                    //      构建完成通知,用于处理历史缓存记录
	                    //      如果是调试模式
	                    //      && 不是收费提示页面
	                    //      && 多场景应用
	                    //
	                    //==========================================
	                    if (Xut.config.recordHistory && !options.isInApp && options.multiScenario) {
	                        var history;
	                        if (history = _controller.sceneController.sequence(scenarioId, currIndex)) {
	                            (0, _stroage._set)("history", history);
	                        }
	                    }
	                },


	                //流程结束通知
	                //包括动画都已经结束了
	                'processComplete': function processComplete() {}
	            };

	            //页面自动运行
	            this.pageMgr.autoRun(data);

	            //模板自动运行
	            this.masterContext(function () {
	                //如果动作是初始化，或者触发了母版自动运行
	                //如果是越界处理
	                //console.log(action,this.isBoundary,para.createMaster)
	                if (action || this.isBoundary) {
	                    this.autoRun(data);
	                }
	            });

	            /**
	             * 触发自动通知
	             * @type {[type]}
	             */
	            var vm = this.vm;

	            switch (action) {
	                case 'init':
	                    //更新页码标示
	                    vm.$emit('change:pageUpdate', currIndex);
	                    resetToolbar.call(this);
	                    setTimeout(function () {
	                        $(".xut-startupPage").hide().remove();
	                        $(".xut-removelayer").hide().remove();
	                    }, 0);
	                    break;
	                case 'toPage':
	                    //更新页码标示
	                    vm.$emit('change:pageUpdate', currIndex);
	                    resetToolbar.call(this);
	                    break;
	            }

	            /**
	             * 初始化与跳转针对翻页案例的设置逻辑
	             * @return {[type]} [description]
	             */
	            function resetToolbar() {
	                //不显示首尾对应的按钮
	                if (currIndex == 0) {
	                    vm.$emit('change:hidePrev');
	                } else if (currIndex == options.pagetotal - 1) {
	                    vm.$emit('change:hideNext');
	                    vm.$emit('change:showPrev');
	                } else {
	                    vm.$emit('change:showNext');
	                    vm.$emit('change:showPrev');
	                }
	            }

	            /**
	             * 线性结构
	             * 保存目录索引
	             */
	            if (!options.multiScenario) {
	                (0, _stroage._set)("pageIndex", currIndex);
	            }

	            /**
	             * 解锁翻页
	             * 允许继续执行下一个翻页作用
	             */
	            if (this.unfliplock) {
	                this.unfliplock();
	                this.unfliplock = null;
	            }

	            //关闭快速翻页
	            this.isQuickTurn = false;
	        }

	        /**
	         * 滑动处理
	         *  1 滑动
	         *  2 反弹
	         *  3 翻页
	         */

	    }, {
	        key: 'move',
	        value: function move() {
	            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var action = _ref.action;
	            var speed = _ref.speed;
	            var distance = _ref.distance;
	            var leftIndex = _ref.leftIndex;
	            var pageIndex = _ref.pageIndex;
	            var rightIndex = _ref.rightIndex;
	            var direction = _ref.direction;


	            var currIndex = pageIndex;

	            //用户强制直接切换模式
	            //禁止页面跟随滑动
	            if (this.options.pageFlip && action == 'flipMove') {
	                return;
	            }

	            //移动的距离
	            var moveDistance = (0, _depend.calculateDistance)(action, distance, direction);

	            //视觉差页面滑动
	            var currObj = this.pageMgr.abstractGetPageObj(currIndex);

	            // if(!currObj) return
	            var chapterData = currObj.chapterDas;
	            var nodes = void 0;
	            if (chapterData && chapterData.nodes) {
	                nodes = chapterData.nodes;
	            }

	            //通知page模块
	            this.pageMgr.move(leftIndex, currIndex, rightIndex, direction, speed, action, moveDistance);

	            //通知视觉差模块
	            this.masterContext(function () {
	                this.move(leftIndex, currIndex, rightIndex, direction, moveDistance, action, speed, nodes);
	            });

	            //更新页码标示
	            'flipOver' === action && setTimeout(function () {
	                this.vm.$emit('change:pageUpdate', direction === 'next' ? rightIndex : leftIndex);
	            }.bind(this), 0);
	        }

	        /**
	         * 翻页松手后
	         * 暂停页面的各种活动动作
	         * @param  {[type]} pointers [description]
	         * @return {[type]}          [description]
	         */

	    }, {
	        key: 'suspend',
	        value: function suspend(pointers) {
	            //关闭层事件
	            this.pageMgr.suspend(pointers);
	            this.masterContext(function () {
	                this.suspend(pointers);
	            });

	            //目录栏
	            (0, _index.closeNavbar)();
	            //复位工具栏
	            this.vm.$emit('change:resetToolbar');
	        }

	        /**
	         * 翻页动画完毕后
	         * @return {[type]}              [description]
	         */

	    }, {
	        key: 'complete',
	        value: function complete(direction, pagePointer, unfliplock, isQuickTurn) {
	            //方向
	            this.direction = direction;
	            //是否快速翻页
	            this.isQuickTurn = isQuickTurn || false;
	            //解锁
	            this.unfliplock = unfliplock;
	            //清理上一个页面
	            this._clearPage(pagePointer.destroyPointer);
	            this._updatePointer(pagePointer);
	            //预创建下一页
	            this._advanceCreate(direction, pagePointer);
	        }

	        /**
	         * 页面跳转切换处
	         * @param  {[type]} data [description]
	         * @return {[type]}      [description]
	         */

	    }, {
	        key: 'jumpPage',
	        value: function jumpPage(data) {

	            Xut.View.ShowBusy();

	            //如果是非线性,创建页面修改
	            if (!this.options.multiplePages) {
	                data.create = [data.targetIndex];
	                data.destroy = [data.currIndex];
	                data.ruleOut = [data.targetIndex];
	                data.pagePointer = {
	                    currIndex: data.targetIndex
	                };
	            }

	            //执行页面切换
	            (0, _switch2.default)(this, data, function (data) {
	                this._updatePointer(data.pagePointer);
	                this.autoRun({
	                    'action': 'toPage',
	                    'createPointer': data['create']
	                });
	                Xut.View.HideBusy();
	            });
	        }

	        /**
	         * 调用母版管理器
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'masterContext',
	        value: function masterContext(callback) {
	            if (this.masterMgr) {
	                callback.call(this.masterMgr);
	            }
	        }

	        /**
	         * 销毁接口
	         * 对应多场景操作
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.pageMgr.destroy();
	            this.masterContext(function () {
	                this.destroy();
	            });
	        }

	        /**
	         * 清理页面结构
	         * @param  {[type]} clearPageIndex [description]
	         * @return {[type]}                [description]
	         */

	    }, {
	        key: '_clearPage',
	        value: function _clearPage(clearPageIndex) {
	            this.pageMgr.clearPage(clearPageIndex);
	        }

	        /**
	         * 更新页码索引标示
	         * @param  {[type]} pagePointer [description]
	         * @return {[type]}             [description]
	         */

	    }, {
	        key: '_updatePointer',
	        value: function _updatePointer(pagePointer) {
	            this.pagePointer = pagePointer;
	        }

	        /**
	         * 预创建新页面
	         * @param  {[type]} direction   [description]
	         * @param  {[type]} pagePointer [description]
	         * @return {[type]}             [description]
	         */

	    }, {
	        key: '_advanceCreate',
	        value: function _advanceCreate(direction, pagePointer) {
	            var pagetotal = this.options.pagetotal,
	                vm = this.vm,
	                createPointer = pagePointer.createPointer,
	                destroyPointer = pagePointer.destroyPointer,

	            //清理页码
	            clear = function clear() {
	                delete pagePointer.createPointer;
	                delete pagePointer.destroyPointer;
	            },

	            //创建新的页面对象
	            createNextContainer = function createNextContainer(createPointer, currIndex) {
	                this.create([createPointer], currIndex, 'flipOver');
	            };

	            //如果是右边翻页
	            if (direction === 'next') {
	                //首尾无须创建页面
	                if (pagePointer.currIndex === pagetotal - 1) {
	                    this.autoRun();
	                    //如果总数只有2页，那么首页的按钮是关闭的，需要显示
	                    if (pagetotal == 2) {
	                        vm.$emit('change:showPrev');
	                    }
	                    //多页处理
	                    vm.$emit('change:hideNext');
	                    return;
	                }
	                if (createPointer < pagetotal) {
	                    //创建的页面
	                    createNextContainer.call(this, createPointer, pagePointer.currIndex);
	                    clear();
	                    vm.$emit('change:showPrev');
	                    return;
	                }
	            }

	            //如果是左边翻页
	            if (direction === 'prev') {
	                //首尾无须创建页面
	                if (pagePointer.currIndex === 0) {
	                    this.autoRun();
	                    //如果总数只有2页，那么首页的按钮是关闭的，需要显示
	                    if (pagetotal == 2) {
	                        vm.$emit('change:showNext');
	                    }
	                    vm.$emit('change:hidePrev');
	                    return;
	                }
	                if (pagePointer.currIndex > -1) {
	                    //创建的页面
	                    createNextContainer.call(this, createPointer, pagePointer.currIndex);
	                    clear();
	                    vm.$emit('change:showNext');
	                    return;
	                }
	            }

	            clear();

	            return;
	        }

	        /**
	         * 加载页面事件与动作
	         * @param  {[type]} action [description]
	         * @return {[type]}        [description]
	         */

	    }, {
	        key: '_loadPage',
	        value: function _loadPage(action) {
	            var self = this;

	            //触发自动任务
	            function trigger() {
	                self.autoRun({
	                    'action': 'init'
	                });
	            }

	            //加载主场景页面
	            function firstLoading() {

	                $("#scene-main").css({
	                    'visibility': 'visible'
	                });

	                if (window.GLOBALIFRAME) {
	                    trigger();
	                    return;
	                }
	                //获取应用的状态
	                if (Xut.Application.getAppState()) {
	                    //保留启动方法
	                    var pre = Xut.Application.LaunchApp;
	                    Xut.Application.LaunchApp = function () {
	                        pre();
	                        trigger();
	                    };
	                } else {
	                    trigger();
	                }
	            }

	            //创建完成回调
	            self.vm.$emit('change:createComplete', function () {
	                if (self.options.multiScenario) {
	                    trigger();
	                } else {
	                    //第一次加载
	                    //进入应用
	                    firstLoading();
	                }
	            });
	        }
	    }]);

	    return Dispatch;
	}();

/***/ }

})
//# sourceMappingURL=0.f70f4b0f0d80c838bf63.hot-update.js.map
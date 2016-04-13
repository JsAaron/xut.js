/*!
 * build.js vundefined
 * (c) 2016 Aaron
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, function () { 'use strict';

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};
	babelHelpers;

	/**
	 * 全局字体修复
	 * @return {[type]} [description]
	 */
	function setRootfont() {
	    var rootSize = 16;
	    switch (window.innerWidth + window.innerHeight) {
	        case 3000:
	            //1920+1080
	            //samsumg galaxy s4
	            rootSize = 32;
	            break;
	        case 2000:
	            //1280+720
	            //HD Android phone
	            rootSize = 26;
	            break;
	        case 2048:
	            //1280+768
	            rootSize = Xut.plat.isIpad ? 16 : 26;
	            break;
	        case 1624:
	            //1024+600
	            rootSize = 18;
	            break;
	        case 888:
	            //568+320
	            rootSize = 12;
	            break;
	        case 800:
	            //480+320
	            rootSize = 14;
	            break;
	        case 560:
	            //320+240
	            rootSize = 12;
	            break;
	        default:
	            //其他分辨率 取默认值
	            break;
	    }
	    16 != rootSize && $("html").css("font-size", rootSize + "px");
	}

	function portExtend(object, config) {
	    for (var i in config) {
	        if (i) {
	            if (object[i]) {
	                console.log('接口方法重复', 'Key->' + i, 'Value->' + object[i]);
	            } else {
	                object[i] = config[i];
	            }
	        }
	    }
	};

	/**
	 * 资源加载
	 * @return {[type]} [description]
	 */
	var loader = function () {
	    return {
	        /**入口函数,动态脚本加载
	         * @param fileList:           需要动态加载的资源列表
	         * @param callback:           所有资源都加载完后调用的回调函数,通常是页面上需要onload就执行的函数
	         * @param scope:              作用范围
	         * @param preserveOrder:      是否保持脚本顺序
	         */
	        load: function load(fileList, callback, scope, preserveOrder) {
	            //过来数组元素
	            if (fileList.length && preserveOrder) {
	                var temp = [];
	                fileList.forEach(function (val, index) {
	                    if (val) {
	                        temp.push(val);
	                    }
	                });
	                fileList = temp.reverse();
	                temp = null;
	            }

	            var scope = scope || this,

	            //var scope =this,//默认作用范围是当前页面
	            head = document.getElementsByTagName("head")[0],
	                fragment = document.createDocumentFragment(),
	                numFiles = fileList.length,
	                loadedFiles = 0;

	            //加载一个特定的文件从fileList通过索引
	            var loadFileIndex = function loadFileIndex(index) {
	                head.appendChild(scope.buildScriptTag(fileList[index], onFileLoaded));
	            };

	            /**
	             * 调用回调函数,当所有文件都加载完后调用
	             */
	            var onFileLoaded = function onFileLoaded() {
	                loadedFiles++;
	                //如果当前文件是最后一个要加载的文件，则调用回调函数，否则加载下一个文件
	                if (numFiles == loadedFiles && typeof callback == 'function') {
	                    callback.call(scope);
	                } else {
	                    if (preserveOrder === true) {
	                        loadFileIndex(loadedFiles);
	                    }
	                }
	            };

	            if (preserveOrder === true) {
	                loadFileIndex.call(this, 0);
	            } else {
	                for (var i = 0, len = fileList.length; i < len; i++) {
	                    fragment.appendChild(this.buildScriptTag(fileList[i], onFileLoaded));
	                }
	                head.appendChild(fragment);
	            }
	        },

	        //构造javascript和link 标签
	        buildScriptTag: function buildScriptTag(filename, callback) {
	            var exten = filename.substr(filename.lastIndexOf('.') + 1);
	            if (exten == 'js') {
	                var script = document.createElement('script');
	                script.type = "text/javascript";
	                script.src = filename;
	                script.onload = callback;
	                return script;
	            }
	            if (exten == 'css') {
	                var style = document.createElement('link');
	                style.rel = 'stylesheet';
	                style.type = 'text/css';
	                style.href = filename;
	                callback();
	                return style;
	            }
	        }
	    };
	}();

	/**
	 * 用css3实现的忙碌光标
	 * @return {[type]} [description]
	 */
	function cursor() {
	    var sWidth = window.innerWidth,
	        sHeight = window.innerHeight,
	        width = Math.min(sWidth, sHeight) / 4,
	        space = Math.round((sHeight - width) / 2),
	        delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833],
	        deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
	        i = 12,
	        prefix = Xut.plat.prefixStyle,
	        html;

	    html = '<div style="width:' + width + "px;height:" + width + 'px;margin:' + space + 'px auto;">';
	    html += '<div style="height:30%;"></div><div class="xut-busy-middle">';

	    while (i--) {
	        html += '<div class="xut-busy-spinner" style="' + prefix('transform') + ':rotate(' + deg[i] + 'deg) translate(0,-142%);' + prefix('animation-delay') + ':-' + delay[i] + 's;"></div>';
	    }

	    html += '</div><div class="xut-busy-text"></div></div>';

	    Xut.View.busyIcon = $('#busyIcon').html(html);
	}

	var config$1 = Xut.Config;
	var plat = Xut.plat;
	var LOCK = 1;
	var UNLOCK = 2;
	var IsPay = false;
	var XXTAPI = {};
	//填充默认没有参数的接口

	/**
	 * 桌面绑定鼠标控制
	 */
	if (plat.isBrowser) {
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

	//================================================
	//
	//				电子杂志所有接口
	//
	//=================================================
	Xut.Assist = {};
	var Presentation = Xut.Presentation = {};
	var _View = Xut.View = {};
	var Contents = Xut.Contents = {};
	var Application = Xut.Application = {};

	/**
	 * 忙碌光标
	 * */
	portExtend(_View, {

	    busyBarState: false,

	    //忙碌光标的引用
	    busyIcon: null,

	    ShowBusy: function ShowBusy() {
	        if (Xut.IBooks.Enabled) return;
	        _View.busyBarState = true;
	        _View.busyIcon.show();
	    },

	    HideBusy: function HideBusy() {
	        if (Xut.IBooks.Enabled) return;
	        var busyIcon = _View.busyIcon;
	        if (_View.ShowBusy.lock) return; //显示忙碌加锁，用于不处理hideBusy
	        _View.busyBarState = false;
	        busyIcon.hide();
	        IsPay && busyIcon.css('pointer-events', '').find('.xut-busy-text').html('');
	    },

	    ShowTextBusy: function ShowTextBusy(txt) {
	        if (Xut.IBooks.Enabled) return;
	        _View.busyIcon.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
	        _View.ShowBusy();
	    }
	});

	/**
	 * [检查是否购买]
	 **/
	function CheckBuyGood(seasonId, chapterId, createMode, pageIndex) {
	    //已付费
	    if (IsPay) {
	        return false;
	    }

	    try {
	        var data = Xut.data.query('sectionRelated', seasonId).toolbar,
	            item = [];
	        data = JSON.parse(data);
	        //判断是否免费章节
	        if (!data.Inapp) {
	            return false;
	        }
	        //判断是否交费
	        if (UNLOCK == data.Inapp || UNLOCK == LocalStorage.get(inAppId)) {
	            setUnlock();
	            return false;
	        }
	        //判断是否收费章节
	        if (LOCK == data.Inapp && data.inappInfo) {
	            item = _.map(data.inappInfo.split('-'), function (num) {
	                return Number(num);
	            });
	            //收费提示页
	            if (item[0] == chapterId && item[1] == seasonId) {
	                return false;
	            } else {
	                _View.LoadScenario({
	                    'scenarioId': item[1],
	                    'chapterId': item[0],
	                    'createMode': createMode,
	                    'pageIndex': pageIndex,
	                    'isInApp': 'isInApp'
	                });
	            }
	        }
	    } catch (e) {
	        console.log('Data error:', e);
	    }
	    return true;
	}

	function toNumber(o) {
	    return Number(o) || null;
	};

	//重复点击
	var repeatClick = false;

	/**
	 * 场景
	 * */
	portExtend(_View, {

	    /**
	     * 关闭场景
	     */
	    CloseScenario: function CloseScenario() {
	        if (repeatClick) return;
	        repeatClick = true;
	        var serial = Xut.sceneController.takeOutPrevChainId();
	        _View.LoadScenario({
	            'scenarioId': serial.scenarioId,
	            'chapterId': serial.chapterId,
	            'createMode': 'sysClose'
	        }, function () {
	            repeatClick = false;
	        });
	    },

	    /**
	     * 加载一个新的场景
	     * 1 节与节跳
	     *    单场景情况
	     *    多场景情况
	     * 2 章与章跳
	     * useUnlockCallBack 用来解锁回调,重复判断
	     * isInApp 是否跳转到提示页面
	     */
	    LoadScenario: function LoadScenario(options, useUnlockCallBack) {
	        var seasonId = toNumber(options.scenarioId),
	            chapterId = toNumber(options.chapterId),
	            pageIndex = toNumber(options.pageIndex),
	            createMode = options.createMode,
	            isInApp = options.isInApp;

	        //ibooks模式下的跳转
	        //全部转化成超链接
	        if (!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
	            location.href = chapterId + ".xhtml";
	            return;
	        }

	        //检查应用内是否收费
	        if (current && CheckBuyGood(seasonId, chapterId, createMode, pageIndex)) {
	            //未交费
	            return false;
	        }

	        //处理场景跳转
	        var sceneController = Xut.sceneController,

	        //用户指定的跳转入口，而不是通过内部关闭按钮处理的
	        userAssign = createMode === 'sysClose' ? false : true,

	        //当前活动场景容器对象
	        current = sceneController.containerObj('current');

	        //获取到当前的页面对象
	        //用于跳转去重复
	        if (current && current.vm) {
	            var curVmPage;
	            if (curVmPage = current.vm.$curVmPage) {
	                if (curVmPage.scenarioId == seasonId && curVmPage.chapterId == chapterId) {
	                    console.log('无效的重复触发');
	                    return;
	                }
	            }
	        }

	        //==================场景内部跳转===============================
	        //
	        //	节相同，章与章的跳转
	        //	用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
	        //
	        //=============================================================
	        if (userAssign && current && current.scenarioId === seasonId) {
	            _View.GotoSlide(seasonId, chapterId);
	            return;
	        }

	        //==================场景外部跳转===============================
	        //
	        //	节与节的跳转,需要对场景的处理
	        //
	        //=============================================================

	        //清理热点动作
	        current && current.vm.$suspend();

	        //通过内部关闭按钮加载新场景处理
	        if (current && userAssign) {
	            //检测是不是往回跳转,重复处理
	            sceneController.checkToRepeat(seasonId);
	        }

	        //================加载新的场景=================

	        //读酷启动时不需要忙碌光标
	        if (DUKUCONFIG && options.main) {
	            Xut.View.HideBusy();
	        } else {
	            Xut.View.ShowBusy();
	        }

	        /**
	         * 跳出去
	         * $multiScenario
	         * 场景模式
	         * $multiScenario
	         * 		true  多场景
	         * 		false 单场景模式
	         * 如果当前是从主场景加载副场景
	         * 关闭系统工具栏
	         */
	        if (current && !current.vm.$multiScenario) {
	            _View.HideToolbar();
	        }

	        /**
	         * 重写场景的顺序编号
	         * 用于记录场景最后记录
	         */
	        var pageId;
	        if (current && (pageId = Xut.Presentation.GetPageId())) {
	            sceneController.rewrite(current.scenarioId, pageId);
	        }

	        /**
	         * 场景信息
	         * @type {[type]}
	         */
	        var sectionRang = Xut.data.query('sectionRelated', seasonId);
	        var barInfo = sectionRang.toolbar,
	            //场景工具栏配置信息
	        pageTotal = sectionRang.length,

	        //通过chapterId转化为实际页码指标
	        //season 2
	        //       {
	        //			chapterId : 1  => 0
	        //			chpaterId : 2  => 1
	        //		 }
	        //
	        parseInitIndex = function parseInitIndex() {
	            return chapterId ? function () {
	                //如果节点内部跳转方式加载,无需转化页码
	                if (createMode === 'GotoSlide') {
	                    return chapterId;
	                }
	                //初始页从0开始，减去下标1
	                return chapterId - sectionRang.start - 1;
	            }() : 0;
	        };

	        //如果启动了虚拟模式
	        if (config$1.virtualMode) {
	            pageTotal = pageTotal * 2;
	        }

	        /**
	         * 传递的参数
	         * seasonId    节ID
	         * chapterId   页面ID
	         * pageIndex   指定页码
	         * isInApp	   是否跳到收费提示页
	         * pageTotal   页面总数
	         * barInfo     工具栏配置文件
	         * history     历史记录
	         * sectionRang 节信息
	         * complete    构件完毕回调
	         * @type {Object}
	         */
	        var data = {
	            seasonId: seasonId,
	            chapterId: chapterId,
	            pageIndex: pageIndex || parseInitIndex(),
	            isInApp: isInApp,
	            pageTotal: pageTotal,
	            barInfo: barInfo,
	            history: options.history,
	            sectionRang: sectionRang,
	            //制作场景切换后处理
	            complete: function complete(nextBack) {
	                //销毁多余场景
	                current && current.destroy();
	                //下一个任务存在,执行切换回调后,在执行页面任务
	                nextBack && nextBack();
	                //去掉忙碌
	                _View.HideBusy();
	                //解锁回调
	                useUnlockCallBack && useUnlockCallBack();
	            }
	        };

	        //加载新场景
	        require("SceneFactory", function (Factory) {
	            //主场景判断（第一个节,因为工具栏的配置不同）
	            if (options.main || sceneController.mianId === seasonId) {
	                //清理缓存
	                LocalStorage.remove("history");
	                //确定主场景
	                sceneController.mianId = seasonId;
	                //是否主场景
	                data.isMain = true;
	            }
	            new Factory(data);
	        });
	    }
	});

	/**
	 * 行为
	 * */
	portExtend(_View, {
	    /**
	     * 通过插件打开一个新view窗口
	     */
	    Open: function Open(pageUrl, width, height, left, top) {
	        Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
	    },

	    //关闭view窗口
	    Close: function Close() {
	        Xut.Plugin.WebView.close();
	    }
	});

	/**
	 * content
	 * */
	portExtend(Contents, {

	    //存在文档碎片
	    //针对音频字幕增加的快捷查找
	    contentsFragment: {},

	    /**
	     * 是否为canvas元素
	     * 用来判断事件冒泡
	     * 判断当前元素是否支持滑动
	     * 默认任何元素都支持滑动
	     * @type {Boolean}
	     */
	    Canvas: {

	        /**
	         * 是否允许滑动
	         * @type {Boolean}
	         */
	        SupportSwipe: true,

	        /**
	         * 对象是否滑动
	         * @type {Boolean}
	         */
	        isSwipe: false,

	        /**
	         * 对象是否点击
	         */
	        isTap: false,

	        /**
	         * 复位标记
	         */
	        Reset: function Reset() {
	            Contents.Canvas.SupportSwipe = true;
	            Contents.Canvas.isSwipe = false;
	        },

	        /**
	         * 判断是否可以滑动
	         * @return {[type]} [description]
	         */
	        getSupportState: function getSupportState() {
	            var state;
	            if (Contents.Canvas.SupportSwipe) {
	                state = true;
	            } else {
	                state = false;
	            }
	            //清空状态
	            Contents.Canvas.Reset();
	            return state;
	        },

	        /**
	         * 判断是否绑定了滑动事件
	         * @return {Boolean} [description]
	         */
	        getIsSwipe: function getIsSwipe() {
	            var state;
	            if (Contents.Canvas.isSwipe) {
	                state = true;
	            } else {
	                state = false;
	            }
	            //清空状态
	            Contents.Canvas.Reset();
	            return state;
	        },

	        /**
	         * 是否绑定了点击事件
	         */
	        getIsTap: function getIsTap() {
	            var state = Contents.Canvas.isTap;
	            Contents.Canvas.isTap = false;
	            return state;
	        }
	    },

	    /**
	     * 恢复节点的默认控制
	     * 默认是系统接管
	     * 如果'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'等事件会重写
	     * 还需要考虑第三方调用，所以需要给一个重写的接口
	     * @return {[type]} [description]
	     * Content_1_3
	     * [Content_1_3,Content_1_4,Content_1_5]
	     */
	    ResetDefaultControl: function ResetDefaultControl(pageType, id, value) {
	        if (!id) return;
	        var elements,
	            handle = function handle(ele) {
	            if (value) {
	                ele.attr('data-behavior', value);
	            } else {
	                ele.attr('data-behavior', 'disable');
	            }
	        };
	        if ((elements = Contents.Get(pageType, id)) && elements.$contentProcess) {
	            handle(elements.$contentProcess);
	        } else {
	            elements = $("#" + id);
	            elements.length && handle(elements);
	        }
	    },

	    /**
	     * 针对SVG无节点操作
	     * 关闭控制
	     */
	    DisableControl: function DisableControl(callback) {
	        return {
	            behavior: 'data-behavior',
	            value: 'disable'
	        };
	    },

	    /**
	     * 针对SVG无节点操作
	     * 启动控制
	     */
	    EnableControl: function EnableControl(Value) {
	        return {
	            behavior: 'data-behavior',
	            value: Value || 'click-swipe'
	        };
	    }
	});

	function getStorage(name) {
	    return parseInt(LocalStorage.get(name));
	}

	/**
	 * [ 执行解锁]
	 * @return {[type]} [description]
	 */
	function setUnlock() {
	    IsPay = true;
	}

	//购买成功
	function pass() {
	    //如果提前关闭了忙碌光标说明被用户中止
	    if (!_View.busyBarState) return;
	    //将购买记录存入数据库
	    var db = config$1.db,
	        sql = 'UPDATE Setting SET value=? WHERE name=?';

	    db.transaction(function (tx) {
	        tx.executeSql(sql, [null, 'Inapp']);
	    }, function (e) {
	        LocalStorage.set(inAppId, UNLOCK);
	    });

	    setUnlock();
	    _View.CloseScenario();
	    _View.HideBusy();
	}

	//购买失败
	function failed() {
	    if (!_View.busyBarState) return;
	    Utils.messageBox('购买失败');
	    _View.HideBusy();
	}

	portExtend(Application, {

	    /**
	     * 应用平台
	     * @type {[type]}
	     */
	    Platform: function () {
	        //平台缩写
	        var platformName = ['duku', 'pc', 'ios', 'android'];
	        if (GLOBALIFRAME) {
	            //嵌套iframe平台
	            return platformName[0];
	        } else {
	            if (config$1.isBrowser) {
	                return platformName[1];
	            } else if (Xut.plat.isIOS) {
	                return platformName[2];
	            } else if (Xut.plat.isAndroid) {
	                return platformName[3];
	            }
	        }
	    }(),

	    /**
	     * [ 锁状态]
	     * @return {[type]} [description]
	     */
	    Unlock: function Unlock() {
	        return IsPay;
	    },

	    /**
	     * [ 检查是否解锁]
	     * @return {[type]}       [description]
	     */
	    CheckOut: function CheckOut() {
	        var Inapp = config$1.Inapp;
	        if (!Inapp || LocalStorage.get(Inapp) === UNLOCK || Xut.plat.isAndroid) {
	            setUnlock();
	        }
	    },

	    /**
	     * [ 付费接口]
	     * @param  {[type]} seasonId   [description]
	     * @param  {[type]} chapterId  [description]
	     * @param  {[type]} createMode [description]
	     * @param  {[type]} pageIndex  [description]
	     * @return {[type]}            [description]
	     */
	    BuyGood: function BuyGood() {
	        var inAppId = config$1.Inapp;
	        if (_View.busyBarState) return;
	        _View.ShowTextBusy('请稍候...');
	        //调式模式
	        if (plat.isBrowser) {
	            setTimeout(function () {
	                pass();
	            }, 3000);
	            return;
	        }
	        //从AppStore查询是否交费
	        Xut.Plugin.iapPlugin.selectInfo(function () {
	            pass(); //查询成功则表明已购买
	        }, function () {
	            //否则提示购买
	            Xut.Plugin.iapPlugin.buyGood(function () {
	                pass();
	            }, function (e) {
	                failed();
	            }, inAppId);
	        }, inAppId);
	    },

	    /**
	     * 已付费接口
	     * @return {[type]} [description]
	     */
	    HasBuyGood: function HasBuyGood() {
	        var inAppId = config$1.Inapp;
	        if (_View.busyBarState) return;
	        _View.ShowTextBusy('请稍候...');
	        //调式模式
	        if (plat.isBrowser) {
	            setTimeout(function () {
	                pass();
	            }, 3000);
	            return;
	        }

	        Xut.Plugin.iapPlugin.restore(function () {
	            pass(); //查询成功则表明已购买
	        }, function () {
	            failed();
	        }, inAppId);
	    },

	    /**
	     * 刷新页面
	     */
	    Resize: function Resize() {

	        //清理对象
	        Xut.sceneController.destroyAllScene();

	        //清理节点
	        $("#sceneContainer").empty();

	        //加载新的页面
	        var novelId,
	            pageIndex = getStorage('pageIndex');

	        //缓存加载
	        if (pageIndex !== void 0) {
	            novelId = getStorage("novelId");
	            //加强判断
	            if (novelId) {
	                require("LoadScene").init({
	                    "novelId": novelId,
	                    "pageIndex": pageIndex,
	                    'history': Utils.LocalStorage.get('history')
	                });
	            };
	        }
	    },

	    /**
	     * home隐藏
	     * 后台运行的时候,恢复到初始化状态
	     * 用于进来的时候激活Activate
	     */
	    Original: function Original() {
	        require("ProcessControl", function (c) {
	            c.suspend();
	            c.original();
	        });
	    },

	    /**
	     * home显示
	     * 后台弹回来
	     * 激活应用行为
	     */
	    Activate: function Activate() {
	        require("ProcessControl", function (c) {
	            c.autoRun();
	        });
	    },

	    /**
	     * 销毁应用
	     */
	    Destroy: function Destroy() {
	        if (plat.isBrowser) {
	            //销毁桌面控制
	            $(document).off();
	        }
	        //销毁所有场景
	        Xut.sceneController.destroyAllScene();
	    },

	    /**
	     * 退出app
	     */
	    DropApp: function DropApp() {
	        //如果读酷
	        if (DUKUCONFIG) {
	            //外部回调通知
	            if (DUKUCONFIG.iframeDrop) {
	                var appId = LocalStorage.get('appId');
	                DUKUCONFIG.iframeDrop(['appId-' + appId, 'novelId-' + appId, 'pageIndex-' + appId]);
	            }
	            DUKUCONFIG = null;
	            unEvent();
	            destroy();
	            return;
	        }

	        //客户端模式
	        if (CLIENTCONFIGT) {
	            //外部回调通知
	            if (CLIENTCONFIGT.iframeDrop) {
	                CLIENTCONFIGT.iframeDrop();
	            }
	            CLIENTCONFIGT = null;
	            unEvent();
	            destroy();
	            return;
	        }

	        //妙妙学客户端
	        if (MMXCONFIG) {
	            //外部回调通知
	            if (MMXCONFIG.iframeDrop) {
	                MMXCONFIG.iframeDrop();
	            }
	            MMXCONFIG = null;
	            destroy();
	            return;
	        }

	        function unEvent() {
	            //并且是安卓情况下
	            //安卓销毁按键事件
	            if (Xut.plat.isAndroid) {
	                GLOBALCONTEXT.document.removeEventListener("backbutton", config$1._event.back, false);
	                GLOBALCONTEXT.document.removeEventListener("pause", config$1._event.pause, false);
	            }
	        }

	        //iframe模式,退出处理
	        function destroy() {
	            //销毁内存对象
	            Application.Destroy();
	            GLOBALCONTEXT = null;
	        }

	        //单应用dialogs
	        if (!plat.isBrowser) {
	            GLOBALCONTEXT.navigator.notification.confirm('您确认要退出吗？', function (button) {
	                if (1 == button) {
	                    GLOBALCONTEXT.navigator.app.exitApp();
	                }
	            }, '退出', ['确定', '取消']);
	        }
	    },

	    /**
	     * 暂停应用
	     * skipMedia 跳过音频你处理(跨页面)
	     * dispose   成功处理回调
	     * processed 处理完毕回调
	     */
	    Suspend: function Suspend(opts) {
	        require("Dispatcher", function (c) {
	            if (c.suspendHandles(opts.skipMedia)) {
	                //停止热点动作
	                if (opts.dispose) {
	                    opts.dispose(c.promptMessage);
	                }
	            } else {
	                opts.processed && opts.processed();
	            }
	        });
	    },

	    //============================================================
	    //
	    //	注册所有组件对象
	    //
	    //  2 widget 包括 视频 音频 Action 子文档 弹出口 类型
	    //    这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
	    //
	    injectionComponent: function injectionComponent(regData) {
	        var sceneObj = Xut.sceneController.containerObj('current');
	        sceneObj.vm.$injectionComponent = regData;
	    }
	});

	portExtend(Application, {

	    /**
	     * 应用加载状态
	     * false未加载
	     * true 已加载
	     * @type {Boolean}
	     */
	    appState: false,

	    setAppState: function setAppState() {
	        Application.appState = true;
	    },

	    delAppState: function delAppState() {
	        Application.appState = false;
	    },

	    /**
	     * 获取应用加载状态
	     * @return {[type]} [description]
	     */
	    getAppState: function getAppState() {
	        return Application.appState;
	    },

	    /**
	     * 延时APP运用
	     * 一般是在等待视频先加载完毕
	     * @return {[type]} [description]
	     */
	    delayAppRun: function delayAppRun() {
	        Application.setAppState();
	    },

	    /**
	     * 启动app
	     * 重载启动方法
	     * 如果调用在重载之前，就删除，
	     * 否则被启动方法重载
	     * @type {[type]}
	     */
	    LaunchApp: function LaunchApp() {
	        Application.delAppState();
	    },

	    /**
	     * 应用加载完毕
	     */
	    AddEventListener: function AddEventListener() {}
	});

	//========================================================
	//
	//			脚本注入接口
	//
	//========================================================

	XXTAPI = {

	    /**
	    	读取系统中保存的变量的值。
	    	如果变量不存在，则新建这个全局变量
	    	如果系统中没有保存的值，用默认值进行赋值
	    	这个函数，将是创建全局变量的默认函数。
	    */
	    ReadVar: function ReadVar(variable, defaultValue) {
	        var temp;
	        if (temp = LocalStorage.get(variable)) {
	            return temp;
	        } else {
	            LocalStorage.set(variable, defaultValue);
	            return defaultValue;
	        }
	    },

	    /**
	     * 将变量的值保存起来
	     */
	    SaveVar: function SaveVar(variable, value) {
	        LocalStorage.set(variable, value);
	    },

	    /*
	    	对变量赋值，然后保存变量的值
	    	对于全局变量，这个函数将是主要使用的，替代简单的“=”赋值
	    */
	    SetVar: function SetVar(variable, value) {
	        LocalStorage.set(variable, value);
	    }

	};

	/**
	 * u3d接口
	 */
	Xut.U3d = {
	    /**
	     * 跳转接口
	     * @param {[type]} seasonId  [description]
	     * @param {[type]} chapterId [description]
	     */
	    View: function View(seasonId, chapterId) {
	        _View.LoadScenario({
	            'scenarioId': serial.scenarioId,
	            'chapterId': serial.chapterId
	        });
	    }
	};

	//导出注入接口
	window.XXTAPI = XXTAPI;

	/**
	 * 创建执行方法
	 * @return {[type]} [description]
	 */
	function createfactory(sql, fn) {
	    var key;
	    if (typeof sql === 'string') {
	        fn(key, sql);
	    } else {
	        for (key in sql) {
	            fn(key, sql[key]);
	        }
	    }
	}

	//模拟database获取数据
	function executeDB(sql, callback, errorCB, tName) {
	    //如果存在生成好的数据文件则直接取
	    if (window.SQLResult) {
	        if (window.SQLResult[tName]) {
	            var data = window.SQLResult[tName],
	                SQLResultSetRowList = {};

	            SQLResultSetRowList = {
	                length: Object.keys(data).length,
	                item: function item(num) {
	                    return data[num];
	                }
	            };
	            callback(SQLResultSetRowList);
	        } else {
	            errorCB({
	                tName: ':table not exist!!'
	            });
	        }
	    } else {
	        //否则分次查询数据
	        $.ajax({
	            url: Xut.Config.onlineModeUrl,
	            dataType: 'json',
	            data: {
	                xxtsql: sql
	            },
	            success: function success(rs) {
	                var data = rs,
	                    SQLResultSetRowList = {};
	                SQLResultSetRowList = {
	                    length: rs.length,
	                    item: function item(num) {
	                        return data[num];
	                    }
	                };
	                callback(SQLResultSetRowList);
	            },
	            error: errorCB
	        });
	    }
	}

	//建立sql查询,
	function execute(selectSql, callback) {

	    var database = Xut.Config.db,
	        tableName,
	        //表名
	    successResults = {},
	        //成功的数据
	    tempClosure = [],
	        //临时收集器
	    collectError = [],
	        //收集错误查询
	    buildTotal = function () {
	        //如果只有一条
	        if (typeof selectSql === 'string') {
	            return 1;
	        } else {
	            return Object.keys(selectSql).length;
	        }
	    }();

	    createfactory(selectSql, function (key, value) {
	        //开始执行查询
	        createSelect(key || 'results', value);
	    });

	    /**
	     * 创建查询
	     */
	    function createSelect(key, value) {
	        buildTotal--;
	        tempClosure.push(executeTemplate(key, value));
	        0 === buildTotal && executeBuild();
	    }

	    /**
	     * 执行查询
	     * @return {[type]} [description]
	     */
	    function executeBuild() {
	        if (tempClosure.length) {
	            var temp = tempClosure.shift();
	            tableName = temp.tableName;
	            temp.execute();
	        } else {
	            //successResults['results'] 成功表数据
	            //collectError 失败表
	            callback(successResults['results'] ? successResults['results'] : successResults, collectError);
	        }
	    }

	    //成功后方法
	    function success() {
	        executeBuild();
	    }

	    //失败
	    function errorCB(error) {
	        collectError.push(tableName);
	        console.log("数据查询错误 " + error.message, '类型', tableName);
	        executeBuild();
	    }

	    /**
	     * 构建执行作用域
	     */
	    function executeTemplate(tName, sql) {
	        return {
	            tableName: tName,
	            execute: function execute() {
	                //查询
	                if (database) {
	                    database.transaction(function (tx) {
	                        tx.executeSql(sql, [], function (tx, result) {
	                            successResults[tName] = result.rows;
	                        });
	                    }, errorCB, success);
	                } else {
	                    executeDB(sql, function (result) {
	                        successResults[tName] = result;
	                        success();
	                    }, errorCB, tName);
	                }
	            }
	        };
	    }
	};

	/**
	 * 数据查询
	 * @type {Object}
	 */
	var Store = {

		statement: {},

		/**
	  * novel表ID
	  * @type {[type]}
	  */
		novelId: null,

		/**
	  * ppt总数
	  * @type {Number}
	  */
		count: 0,

		/**
	  * 不存在的数据库表
	  * @type {Array}
	  */
		collectError: []
	};

	//热点合集
	var dataRet = {};

	'Setting,Parallax,Master,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter'.replace(/[^, ]+/g, function (name) {
		Store.statement[name] = 'select * FROM ' + name + ' order by _id ASC';
	});

	/**
	 * 查询单一的数据
	 * @return {[type]} [description]
	 */
	Store.oneQuery = function (tableName, callback) {
		execute('select * FROM ' + tableName + ' order by _id ASC', function (sqlRet, collectError) {
			callback(sqlRet);
		});
	};

	/**
	 * 所有页面总数据
	 */
	function query() {
		var i,
		    self = this;
		return $.Deferred(function (dfd) {
			//数据库表重复数据只查询一次
			if (Object.keys(dataRet).length) {
				dfd.resolve(dataRet);
				return;
			}
			//ibook模式，数据库外部注入的
			if (Xut.IBooks.CONFIG) {
				// self.collectError = collectError;
				dfd.resolve(Xut.IBooks.CONFIG.data);
			} else {
				//查询所有数据
				execute(Store.statement, function (sqlRet, collectError) {
					self.collectError = collectError;
					for (i in sqlRet) {
						dataRet[i] = sqlRet[i];
					}
					dfd.resolve(dataRet);
				});
			}
		}).promise();
	}

	function createStore(complete) {
		return $.Deferred(function (dfd) {
			query().done(function (data) {
				var novel = data.Novel;
				//novel的id
				var novelId = store.novelId = novel.item(0)['_id'];
				//数据转换
				mixToData(data);
				//转化数据结构
				conversion();
				//数据缓存已存在
				storeMgr.dataCache = true;
				dfd.resolve(data.Setting, novel.item(0));
			});
		}).promise();
	}

	var config = void 0;

	//数据库检测
	function testDB() {
	    var database = config.db,
	        sql = 'SELECT * FROM Novel';

	    if (database) {
	        database.transaction(function (tx) {
	            tx.executeSql(sql, [], function (tx, rs) {
	                initValue();
	            }, function () {
	                //if not support magazine.db, we need to set the db as null
	                Xut.Config.db = null;
	                initValue();
	            });
	        });
	    } else {
	        //The current environment doesn't support database API
	        //It's done using Ajax and PHP
	        initValue();
	    }
	}

	/**
	 * 根据set表初始化数据
	 * @return {[type]} [description]
	 */
	function initValue() {
	    createStore().done(function (setData, novelData) {
	        initDefaults(setData);
	        fixedSize(novelData);
	        initMain(novelData);
	    });
	};

	/**
	 * 初始化
	 * 数据结构
	 */
	function initData() {

	    config = Xut.Config;

	    //加载忙碌光标
	    if (!Xut.IBooks.Enabled) {
	        cursor();
	    }

	    if (window.openDatabase) {
	        try {
	            //数据库链接对象
	            config.db = window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
	        } catch (err) {
	            console.log('window.openDatabase出错');
	        }
	    }

	    //检查数据库
	    testDB();
	}

	function init(argument) {
	    var config = Xut.Config;
	    var isBrowser = config.isBrowser;

	    var preloadVideo = {
	        //播放状态
	        state: false,
	        //地址
	        path: DUKUCONFIG ? DUKUCONFIG.path + "duku.mp4" : 'android.resource://#packagename#/raw/duku',

	        //加载视频
	        load: function load() {
	            // if (window.localStorage.getItem("videoPlayer") == 'error') {
	            //       alert("error")
	            //     return preloadVideo.launchApp();
	            // }
	            this.play();
	            this.state = true;
	        },

	        //播放视频
	        play: function play() {
	            //延时应用加载
	            Xut.Application.delayAppRun();
	            Xut.Plugin.VideoPlayer.play(function () {
	                preloadVideo.launchApp();
	            }, function () {
	                //捕获出错,下次不进入了,,暂无ID号
	                // window.localStorage.setItem("videoPlayer", "error")
	                preloadVideo.launchApp();
	            }, preloadVideo.path, 1, 0, 0, window.innerHeight, window.innerWidth);
	        },

	        //清理视频
	        closeVideo: function closeVideo() {
	            Xut.Plugin.VideoPlayer.close(function () {
	                preloadVideo.launchApp();
	            });
	        },

	        //加载应用
	        launchApp: function launchApp() {
	            this.state = false;
	            Xut.Application.LaunchApp();
	        }
	    };

	    //存放绑定事件
	    config._event = {
	        //回退键
	        back: function back() {
	            //如果是预加载视频
	            if (preloadVideo.state) {
	                preloadVideo.closeVideo();
	            } else {
	                controller('back');
	            }
	        },
	        //暂停键
	        pause: function pause() {
	            controller('pause');
	        }

	    };

	    //如果不是读库模式
	    //播放HTML5视频
	    //在IOS
	    if (!DUKUCONFIG && !GLOBALIFRAME && Xut.plat.isIOS) {
	        createHtml5Video();
	    }

	    //Ifarme嵌套处理
	    //1 新阅读
	    //2 子文档
	    if (GLOBALIFRAME) {
	        initDB(config);
	    } else {
	        //PC还是移动
	        if (isBrowser) {
	            loadApp(config);
	        } else {
	            //如果不是iframe加载,则创建空数据库
	            window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
	            //等待硬件加载完毕
	            document.addEventListener("deviceready", initDB, false);
	        }
	    }

	    /**************
	     * 物理按键处理
	     **************/

	    //退出加锁,防止过快点击
	    var outLock = false;

	    //回退按钮状态控制器
	    function controller(state) {
	        //如果是子文档处理
	        if (Xut.isRunSubDoc) {
	            //通过Action动作激活的,需要到Action类中处理
	            Xut.publish('subdoc:dropApp');
	            return;
	        }
	        //正常逻辑
	        outLock = true;

	        Xut.Application.Suspend({
	            dispose: function dispose() {
	                //停止热点动作
	                setTimeout(function () {
	                    outLock = false;
	                }, 100);
	            },
	            processed: function processed() {
	                //退出应用
	                state === 'back' && Xut.Application.DropApp();
	            }
	        });
	    }

	    /**
	     *  创建播放器
	     *  IOS，PC端执行
	     */
	    function createHtml5Video() {
	        //延时应用开始
	        Xut.Application.delayAppRun();
	        var videoPlay = Xut.Video5({
	            url: 'duku.mp4',
	            startBoot: function startBoot() {
	                Xut.Application.LaunchApp();
	            }
	        });
	        videoPlay.play();
	    }
	}

	/**
	 * 如果是安卓桌面端
	 * @return {[type]} [description]
	 */
	function initDB(config) {

	    //安卓上
	    if (Xut.plat.isAndroid) {

	        //预加载处理视频
	        //妙妙学不加载视频
	        //读库不加载视频
	        if (!MMXCONFIG && !DUKUCONFIG) {
	            preloadVideo.load();
	        }

	        //不是子文档指定绑定按键
	        if (!SUbCONFIGT) {
	            Xut.Application.AddEventListener = function () {
	                GLOBALCONTEXT.document.addEventListener("backbutton", config._event.back, false);
	                GLOBALCONTEXT.document.addEventListener("pause", config._event.pause, false);
	            };
	        }
	    }

	    if (DUKUCONFIG) {
	        var PMS = PMS || require("PMS");
	        PMS.bind("MagazineExit", function () {
	            PMS.unbind();
	            Xut.Application.DropApp();
	        }, "*");
	    }

	    //拷贝数据库
	    Xut.Plugin.XXTEbookInit.startup(config.dbName, loadApp, function () {});
	};

	/**
	 * 加载app应用
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	function loadApp(config) {

	    //修正API接口
	    config.reviseAPI();

	    //加载横版或者竖版css
	    var baseCss = './css/' + config.layoutMode + '.css';
	    var svgsheet = './content/gallery/svgsheet.css';

	    var cssArr = [baseCss, svgsheet];
	    //是否需要加载svg
	    //如果是ibooks模式
	    //并且没有svg
	    //兼容安卓2.x
	    if (Xut.IBooks.Enabled && !Xut.IBooks.existSvg) {
	        cssArr = [baseCss];
	    }

	    //动态加载脚本
	    loader.load(cssArr, function () {
	        //修正全局字体
	        setRootfont();
	        initData();
	    }, null, true);
	}

	/**
	 * 应用入口
	 * @return {[type]} [description]
	 */
	Xut.app = function () {

	    //更新版本号记录
	    Xut.Version = 779;

	    /**
	     * 动态html文件挂载点
	     * 用于content动态加载js文件
	     * @type {Object}
	     */
	    window.HTMLCONFIG = {};

	    /**
	     * 2015.10.19新增
	     * ibooks处理
	     */
	    var IBOOKSCONFIG = window.IBOOKSCONFIG;

	    //如果是IBOOS模式处理
	    //注入保持与数据库H5查询一致
	    if (IBOOKSCONFIG && IBOOKSCONFIG.data) {
	        _.each(IBOOKSCONFIG.data, function (data, tabName) {
	            data.item = function (index) {
	                return this[index];
	            };
	        });
	        //ios上的ibooks模式
	        //直接修改改isBrowser模式
	        Xut.plat.isBrowser = true;
	        Xut.plat.isIOS = false;
	    }

	    //配置ibooks参数
	    Xut.IBooks = {

	        /**
	         * 当前页面编号
	         * @return {[type]} [description]
	         */
	        pageIndex: function () {
	            if (IBOOKSCONFIG) {
	                //当期页面索引1开始
	                return IBOOKSCONFIG.pageIndex + 1;
	            }
	        }(),

	        /**
	         * 是否存在svg
	         * @type {[type]}
	         */
	        existSvg: IBOOKSCONFIG ? IBOOKSCONFIG.existSvg : false,

	        /**
	         * 是否启动了ibooks模式
	         * @return {[type]} [description]
	         */
	        Enabled: function () {
	            return IBOOKSCONFIG ? true : false;
	        }(),

	        /**
	         * 全部对象
	         * @type {[type]}
	         */
	        CONFIG: IBOOKSCONFIG,

	        /**
	         * 运行期间
	         * @return {[type]} [description]
	         */
	        runMode: function runMode() {
	            //确定为ibooks的运行状态
	            //而非预编译状态
	            if (IBOOKSCONFIG && !IBOOKSCONFIG.compiled) {
	                return true;
	            }
	            return false;
	        },
	        /**
	         * 编译期间
	         * @return {[type]} [description]
	         */
	        compileMode: function compileMode() {
	            //确定为ibooks的编译状态
	            //而非预编译状态
	            if (IBOOKSCONFIG && IBOOKSCONFIG.compiled) {
	                return true;
	            }
	            return false;
	        }
	    };

	    //修复ios 安卓浏览器不能自动播放音频的问题
	    //在加载时创建新的audio.video 用的时候更换
	    Xut.fix = Xut.fix || {};

	    //移动端浏览器平台
	    if (Xut.plat.isBrowser && (Xut.plat.isIOS || Xut.plat.isAndroid)) {
	        var fixaudio = function fixaudio() {
	            if (!Xut.fix.audio) {
	                Xut.fix.audio = new Audio();
	                Xut.fix.video = document.createElement("Video");
	                document.removeEventListener('touchstart', fixaudio, false);
	            }
	        };
	        document.addEventListener('touchstart', fixaudio, false);
	    }

	    init();
	};

}));
/*********************************************************************
 *                 调度器 生成页面模块
 *
 *            处理：事件动作分派
 *            调度：
 *                1. PageMgr     模块
 *                2. MasterMgr 模块
 *                                                                    *
 **********************************************************************/
import {_set} from '../util/stroage'
//页面管理
import {PageMgr} from './page'
import {MasterMgr} from './master'

//错误的数据库表
import {errorTable} from '../data/index'
//数据解析
import {query} from './parser'
//页面切换
import {SwitchPage} from './switch'
//Navbar
import {close as _close} from '../toolbar/navbar'



//判断是否能整除2
function offsetPage(num) {
    return ((num % 2 == 0) ? 'left' : 'right');
}

//如果是场景加载，转化页码数
//转化按0开始
//pageIndex 页码
//visiblePid 可见页面chpaterId
function conversionPageOpts(pageIndex, visiblePid) {
    var sectionRang;
    //转化可视区域值viewPageIndex
    if (this.options.multiScenario) {
        sectionRang = this.options.sectionRang;
        //如果传入的是数据
        if (!visiblePid && _.isArray(pageIndex)) {
            pageIndex.forEach(function(ele, index) {
                pageIndex.splice(index, 1, ele - sectionRang.start)
            })
            return pageIndex;
        }
        pageIndex -= sectionRang.start;
        visiblePid += sectionRang.start;
    } else {
        //pageIndex是数组，并且realPage为空
        if (_.isArray(pageIndex)) {
            return pageIndex;
        }
    }

    return {
        'pageIndex': pageIndex,
        'visiblePid': visiblePid
    }
}

///////////
//计算翻页距离 //
///////////
function calculateDistance(action, distance, direction) {
    var leftOffset,
        currOffset,
        rightOffset;

	//保持缩放比,计算缩放比情况下的转化
	var calculateContainer = Xut.config.proportion.calculateContainer();
	var  containerWidth    = calculateContainer.width;


    switch (direction) {
        //前翻
        case 'prev':
            switch (action) {
                case 'flipMove':
                    leftOffset = distance - containerWidth;
                    currOffset = distance;
                    rightOffset = distance + containerWidth;
                    break;
                case 'flipRebound':
                    leftOffset = -containerWidth;
                    currOffset = distance;
                    rightOffset = containerWidth;
                    break;
                case 'flipOver':
                    leftOffset = 0;
                    currOffset = containerWidth;
                    rightOffset = 2 * containerWidth
                    break;
            }
            break;
            //后翻
        case 'next':
            switch (action) {
                case 'flipMove':
                    leftOffset = distance - containerWidth;
                    rightOffset = distance + containerWidth;
                    currOffset = distance;
                    break;
                case 'flipRebound':
                    leftOffset = -containerWidth;
                    rightOffset = containerWidth;
                    currOffset = distance;
                    break;
                case 'flipOver':
                    leftOffset = -2 * containerWidth;
                    rightOffset = distance;
                    currOffset = -containerWidth;
                    break;
            }
            break;
    }

    return [leftOffset, currOffset, rightOffset];
}

////////////
//计算初始化页码 //
////////////
function calculatePointer(targetIndex, pageTotal, multiplePages) {

    var leftscope = 0,
        pagePointer = {},
        createPointer = [];

    function setValue(index) {
        if (index.leftIndex !== undefined) {
            pagePointer.leftIndex = index.leftIndex;
            createPointer.push(index.leftIndex)
        }
        if (index.currIndex !== undefined) {
            pagePointer.currIndex = index.currIndex;
            createPointer.push(index.currIndex)
        }
        if (index.rightIndex !== undefined) {
            pagePointer.rightIndex = index.rightIndex;
            createPointer.push(index.rightIndex)
        }
    }

    //如果只有一页 or  非线性,只创建一个页面
    if (pageTotal === 1 || !multiplePages) {
        setValue({
            'currIndex': targetIndex
        })
    } else {
        //多页情况
        if (targetIndex === leftscope) { //首页
            setValue({
                'currIndex': targetIndex,
                'rightIndex': targetIndex + 1
            })
        } else if (targetIndex === pageTotal - 1) { //尾页
            setValue({
                'currIndex': targetIndex,
                'leftIndex': targetIndex - 1
            })
        } else { //中间页
            setValue({
                'currIndex': targetIndex,
                'leftIndex': targetIndex - 1,
                'rightIndex': targetIndex + 1
            })
        }
    }

    this.pagePointer = pagePointer;

    return createPointer;
}

//保证可视页面第一个分解
//createPage 需要创建的页面 [0,1,2]
//visualPage 可视区页面       [1]
function conversionCid(createPage, visualPage) {

    var indexOf, start, less;

    //如果第一个不是可视区域
    //切换位置
    //加快创建速度
    if (createPage[0] !== visualPage) {
        indexOf = createPage.indexOf(visualPage),
            less = createPage.splice(indexOf, 1),
            createPage = less.concat(createPage);
    }

    //场景加载模式,计算正确的chapter顺序
    //多场景的模式chpater分段后
    //叠加起始段落
    if (this.options.multiScenario) {
        //需要提前解析数据库的排列方式
        //chpater的开始位置
        start = this.options.sectionRang.start;
        //拼接位置
        createPage.forEach(function(page, index) {
            createPage.splice(index, 1, page + start)
        })
    }

    // [0,1,2] => [73,74,75]
    return createPage;
}


//页码转化成相对应的chpater表数据
function conversionPids(createPage) {
    return query('chapter', createPage);
}


//检测是否构建母板模块处理
function checkMasterCreate() {
    var table = errorTable();
    //如果没有Master数据,直接过滤
    if (-1 !== table.indexOf('Master') || !Xut.data['Master'] || !Xut.data['Master'].length) {
        return false;
    }
    return true;
}


////////
//调度器 //
////////
export function Scheduler(vm) {

    this.vm = vm;
    this.options = vm.options;

    /**
     * 创建前景页面管理模块
     * @type {PageMgr}
     */
    this.pageMgr = new PageMgr(vm);

    /**
     * 检测是否需要创母版模块
     * @return {[type]} [description]
     */
    if (checkMasterCreate()) {
        this.masterMgr = new MasterMgr(vm);
    }
};


var SchedulerProto = Scheduler.prototype


/**
 * 初始化页面创建
 * 因为多个页面的问题，所以不是创建调用
 * 统一回调
 * @return {[type]} [description]
 */
SchedulerProto.initCreate = function() {
    var options = this.options;
    /**
     * 初始化构建页面
     */
    this.create(
        calculatePointer.call(this, options.initIndex, options.pagetotal, options.multiplePages), options.initIndex, 'init'
    );
};


/**
 *  创建普通页面
 *  创建母版页面
 *  createPointer  需要创建的页面索引
 *  visiblePage       当前可视区页面索引
 *  action         toPage/init/flipOver
 *  toPageCallback 跳转页面支持回调通知
 *  userStyle      规定创建的style属性
 **/
SchedulerProto.create = function(createPage, visiblePage, action, toPageCallback, userStyle) {

    //2016.1.20
    //修正苗苗学问题 确保createPage不是undefined
    if (void 0 === createPage[0]) {
        return;
    }


    // console.debug('当前页面:' + this.pagePointer.currIndex + ',创建新页面:"'+ createPointer + '",动作:' +action)
    var createPid,
        pageBase,
        visiblePid,
        pageIndex,
        conversion,
        newCreate,
        callbackAction,
        virtualMode = Xut.config.virtualMode,
        self = this,
        multiplePages = this.options.multiplePages, //是否线性
        total = createPage.length,
        toPageAction = action === 'toPage', //如果是跳转
        filpOverAction = action === 'flipOver', //如果是翻页

        //使用第一个是分解可见页面
        //将页码pageIndex转化成对应的chapter
        createPids = conversionCid.call(this, createPage, visiblePage),

        //收集创建的页面对象
        //用于处理2个页面在切换的时候闪屏问题
        //主要是传递createStyle自定义样式的处理
        collectCreatePageBase = [],

        //是否触发母版的自动时间
        //因为页面每次翻页都会驱动auto事件
        //但是母版可能是共享的
        createMaster = false,

        //收集完成回调
        collectCallback = function() {
            //收集创建页码的数量
            var createContent = 0;
            return function(callback) {
                ++createContent
                if (createContent === total) {
                    callback();
                }
            }
        }(),

        //构建执行代码
        callbackAction = {
            //初始化
            init: function() {
                collectCallback(function() {
                    self.loadPage('init');
                })
            },
            //翻页
            flipOver: function() {
                collectCallback(function() {
                    self.autoRun({ //翻页
                        'createPointer': createPids,
                        'createMaster': createMaster
                    });
                })
            },
            //跳转
            toPage: function() {
                collectCallback(function() {
                    toPageCallback(collectCreatePageBase);
                })
            }
        };

    ////////////////////
    //pid=>chpterData //
    ////////////////////
    var results = conversionPids(createPids);

    ////////////
    //如果是最后一页 //
    //没有对应的虚拟数据，取前一页的
    ////////////
    if (virtualMode && !results.length) {
        var virtualPid = _.extend([], createPids);
        createPids.forEach(function(pid, index) {
            virtualPid.splice(index, 1, --pid)
        })
        results = conversionPids(virtualPid);
    }

    //页码转成数据
    _.each(results, function(chapterData, index) {

        //转化值
        //chapterId => createPid
        createPid = createPids[index];

        //createPid 
        //pageIndex 
        conversion = conversionPageOpts.call(self, createPid, visiblePage);
        visiblePid = conversion.visiblePid;
        pageIndex = conversion.pageIndex;

        ////////////////
        // 如果启动了虚拟页面模式 //
        ////////////////
        var virtualPid = false; //虚拟页面的pid编号
        var virtualOffset = false; //页面坐标left,right
        if (virtualMode) {
            //页面位置
            virtualOffset = offsetPage(pageIndex);

            //获取新的chpater数据
            function fixCids(originalIndex) {
                var originalPid = conversionCid.call(self, [originalIndex]);
                return conversionPids([originalPid])[0];
            }

            ////////////
            //如果是翻页创建 //
            //由于是拼接的所以chapter移位了
            ////////////
            if (virtualOffset === 'left') {
                chapterData = fixCids(pageIndex / 2)
            }
            //修正右边chapter
            if (virtualOffset === 'right') {
                chapterData = fixCids((pageIndex - 1) / 2)
            }
        }

        if (total === 1) {
            self.options.chapterId = chapterData._id
        }

        //构件新的页面
        //masterFilter 母板过滤器回调函数
        newCreate = function(masterFilter) {

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
            }

            //初始化构建页面对象
            //page
            //master
            pageBase = this.create(dataOpts, pageIndex, masterFilter);

            //构建页面对象后
            //开始执行
            if (pageBase) {
                //开始线程任务
                //当为滑动模式,支持快速创建
                pageBase.startThreadTask(filpOverAction, function() {
                    // console.log('创建完毕************** ' + (createPid+1) +' '+ action)
                    callbackAction[action]();
                });
                //收集自定义样式的页面对象
                if (userStyle) {
                    collectCreatePageBase.push(pageBase);
                }
            }

        }

        //母版层
        if (chapterData.pptMaster && self.masterMgr) {
            newCreate.call(self.masterMgr, function() {
                //母版是否创建等待通知
                //母版是共享的所以不一定每次翻页都会创建
                //如果需要创建,则叠加总数
                ++total;
                createMaster = true;
            });
        }

        //页面层
        newCreate.call(self.pageMgr);
    })
}


/**
 * 滑动处理
 *  1 滑动
 *  2 反弹
 *  3 翻页
 */
SchedulerProto.move = function(data) {

    //动作
    var action = data.action;

    //用户强制直接切换模式
    //禁止页面跟随滑动
    if (this.options.pageFlip && action == 'flipMove') {
        return
    }

    var speed = data.speed;
    var distance = data.distance;
    var leftIndex = data.leftIndex;
    var currIndex = data.pageIndex;
    var rightIndex = data.rightIndex;
    var direction = data.direction;
    //移动的距离
    var moveDistance = calculateDistance(action, distance, direction);
    //视觉差页面滑动
    var nodes = this.pageMgr.abstractGetPageObj(currIndex)['chapterDas']['nodes'];

    ///////
    //页面改变 //
    ///////
    //通知page模块
    this.pageMgr.move(leftIndex, currIndex, rightIndex, direction, speed, action, moveDistance);

    //通知视觉差模块
    this.callMasterMgr(function() {
        this.move(leftIndex, currIndex, rightIndex, direction, moveDistance, action, speed, nodes);
    })

    //更新页码标示
    'flipOver' === action && setTimeout(function() {
        this.vm.$emit('change:pageUpdate', direction === 'next' ? rightIndex : leftIndex)
    }.bind(this), 0);
}


/**
 * 翻页松手后
 * 暂停页面的各种活动动作
 * @param  {[type]} pointers [description]
 * @return {[type]}          [description]
 */
SchedulerProto.suspend = function(pointers) {
    //关闭层事件
    this.pageMgr.suspend(pointers);
    this.callMasterMgr(function() {
            this.suspend(pointers)
        })
        //目录栏
    _close();
    //复位工具栏
    this.vm.$emit('change:resetToolbar')
}


/**
 * 翻页动画完毕后
 * @return {[type]}              [description]
 */
SchedulerProto.complete = function(direction, pagePointer, unfliplock, isQuickTurn) {
    //方向
    this.direction = direction;
    //是否快速翻页
    this.isQuickTurn = isQuickTurn || false;
    //解锁
    this.unfliplock = unfliplock;
    //清理上一个页面
    this._clearPage(pagePointer.destroyPointer)
    this._updatePointer(pagePointer);
    //预创建下一页
    this._advanceCreate(direction, pagePointer);
}


//清理页面结构
SchedulerProto._clearPage = function(clearPageIndex) {
    this.pageMgr.clearPage(clearPageIndex);
}


//更新页码索引标示
SchedulerProto._updatePointer = function(pagePointer) {
    this.pagePointer = pagePointer;
}


//预创建新页面
SchedulerProto._advanceCreate = function(direction, pagePointer) {
    var pagetotal = this.options.pagetotal,
        vm = this.vm,
        createPointer = pagePointer.createPointer,
        destroyPointer = pagePointer.destroyPointer,
        //清理页码
        clear = function() {
            delete pagePointer.createPointer;
            delete pagePointer.destroyPointer;
        },
        //创建新的页面对象
        createNextContainer = function(createPointer, currIndex) {
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
            return
        }
        if (createPointer < pagetotal) { //创建的页面
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
            return
        }
        if (pagePointer.currIndex > -1) { //创建的页面
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
 * 自动运行处理
 *  流程四:执行自动触发动作
 *   1.初始化创建页面完毕
 *   2.翻页完毕
 */
SchedulerProto.autoRun = function(para) {
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
        createPointer = conversionPageOpts.call(this, createPointer);
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
        'buildComplete': function(scenarioId) {
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
                if (history = Xut.sceneController.sequence(scenarioId, currIndex)) {
                    _set("history", history);
                }
            }
        },

        //流程结束通知
        //包括动画都已经结束了
        'processComplete': function() {}
    };

    //页面自动运行
    this.pageMgr.autoRun(data);

    //模板自动运行
    this.callMasterMgr(function() {
        //如果动作是初始化，或者触发了母版自动运行
        //如果是越界处理
        //console.log(action,this.isBoundary,para.createMaster)
        if (action || this.isBoundary) {
            this.autoRun(data);
        }
    })


    /**
     * 触发自动通知
     * @type {[type]}
     */
    var vm = this.vm;

    switch (action) {
        case 'init':
            //更新页码标示
            vm.$emit('change:pageUpdate', currIndex)
            resetToolbar.call(this)
            setTimeout(function() {
                $("#startupPage").remove();
                $("#removelayer").remove();
            }, 2000)
            break;
        case 'toPage':
            //更新页码标示
            vm.$emit('change:pageUpdate', currIndex)
            resetToolbar.call(this)
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
        _set("pageIndex", currIndex);
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
 * 页面跳转切换处
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
SchedulerProto.jumpPage = function(data) {

    Xut.View.ShowBusy();

    //如果是非线性,创建页面修改
    if (!this.options.multiplePages) {
        data.create = [data.targetIndex];
        data.destroy = [data.currIndex];
        data.ruleOut = [data.targetIndex];
        data.pagePointer = {
            currIndex: data.targetIndex
        }
    }

    //执行页面切换
    SwitchPage(this, data, function(data) {
        this._updatePointer(data.pagePointer);
        this.autoRun({
            'action': 'toPage',
            'createPointer': data['create']
        });
        Xut.View.HideBusy();
    })
}


/**
 * 加载页面事件与动作
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
SchedulerProto.loadPage = function(action) {
    var self = this;


    //触发自动任务
    function trigger() {
        self.autoRun({
            'action': 'init'
        });
    }

    //加载主场景页面
    function firstLoading() {

        $("#sceneHome").css({
            'visibility': 'visible'
        });

        if (GLOBALIFRAME) {
            trigger();
            return;
        }
        //获取应用的状态
        if (Xut.Application.getAppState()) {
            //保留启动方法
            var pre = Xut.Application.LaunchApp;
            Xut.Application.LaunchApp = function() {
                pre();
                trigger();
            };
        } else {
            trigger();
        }
    }


    //创建完成回调
    self.vm.$emit('change:createComplete', function() {
        if (self.options.multiScenario) {
            trigger();
        } else {
            //第一次加载
            //进入应用
            firstLoading();
        }
    })
}


/**
 * 调用母版管理器
 * @return {[type]} [description]
 */
SchedulerProto.callMasterMgr = function(callback) {
    if (this.masterMgr) {
        callback.call(this.masterMgr)
    }
}


/**
 * 销毁接口
 * 对应多场景操作
 * @return {[type]} [description]
 */
SchedulerProto.destroy = function() {
    this.pageMgr.destroy();
    this.callMasterMgr(function() {
        this.destroy();
    })
}

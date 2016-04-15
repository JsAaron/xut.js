/*********************************************************************
 *                 构建页面对象
 *             实现目标：
 *                快速翻页
 *                最快中断任务
 *                提高优先级
 *
 *             1 构建四个大任务，每个大人物附属一堆小任务
 *             2 每次触发一个新的任务，都会去检测是否允许创建的条件
 *
 *  2014.11.18
 *  新增canvan模式
 *    contentMode 分为  0 或者 1
 *    0 是dom模式
 *    1 是canvas模式
 *    以后如果其余的在增加
 *    针对页面chapter中的parameter写入 contentMode   值为 1
 *    如果是canvas模式的时候，同时也是能够存在dom模式是
 *
 *                                                         *
 **********************************************************************/


import { Collection } from './collection'
import { createTransform } from './translation'
import { create as _create, destroy as _destroy } from './multievent'
//分配任务
import {   assignedTasks } from './tasks'
//canvas相关
import { Factory as CanvasRelated } from './canvasrelated'

function PageBase() {};

var baseProto = PageBase.prototype


/********************************************************************
 *
 *                    多线程创建管理
 *
 ********************************************************************/

/**
 * 初始化多线程任务
 * @return {[type]} [description]
 */
baseProto.initTasks = function(options) {

    var self = this;

    _.extend(self, options);

    /**
     * 数据缓存容器
     * @type {Object}
     */
    this.dataCache = {};
    this.scenarioId = this.chapterDas.seasonId;
    this.chapterId = this.chapterDas._id

    /**
     * 是否开启多线程,默认开启
     * 如果是非线性，则关闭多线程创建
     * 启动 true
     * 关闭 false
     * @type {[type]}
     */
    this.isMultithread = this.multiplePages ? true : false;

    //母版处理
    if (self.pageType === 'master') {
        this.isMaster = true;
    }

    /**
     * canvas模式
     * @type {Boolean}
     */
    this.canvasRelated = new CanvasRelated();

    /**
     * 创建相关的信息
     * @type {Object}
     */
    var createRelated = this.createRelated = {

        /**
         * 主线任务等待
         */
        tasksHang: null,

        /**
         * 创建相关的信息
         * @type {Object}
         */
        tasksTimer: 0,

        /**
         * 当前任务是否中断
         * return
         *     true  中断
         *     false 没有中断
         */
        isTaskSuspend: false,

        /**
         * 是否预创建背景中
         */
        preCreateTasks: false,


        /**
         * 下一个将要运行的任务标示
         * 1 主容器任务
         * 2 背景任务
         * 3 widget热点任务
         * 4 content对象任务
         */
        nextRunTask: 'container',

        /**
         * 缓存构建中断回调
         * 构建分2步骤
         * 1 构建数据与结构（执行中断处理）
         * 2 构建绘制页面
         * @type {Object}
         */
        cacheTasks: function() {
            var cacheTasks = {};
            _.each(["background", "components", "contents"], function(taskName) {
                cacheTasks[taskName] = false;
            })
            return cacheTasks;
        }(),

        /**
         * 与创建相关的信息
         * 创建坐标
         * 1 创建li位置
         * 2 创建浮动对象
         * "translate3d(0px, 0, 0)", "original"
         */
        initTransformParameter: createTransform(this.visiblePid, this.pid),

        /**
         * 预创建
         * 构建页面主容器完毕后,此时可以翻页
         * @return {[type]} [description]
         */
        preforkComplete: function() {},

        /**
         * 整个页面都构建完毕通知
         * @return {[type]} [description]
         */
        createTasksComplete: function() {}
    }


    //==================内部钩子相关===========================
    //
    // * 监听状态的钩子
    // * 注册所有content对象管理
    // * 收集所有content对象
    // * 构建li主结构后,即可翻页
    // * 构建所有对象完毕后处理
    //

    //抽象activtiys合集,用于关联各自的content
    //划分各自的子作用域
    //1对多的关系
    this.abActivitys = new Collection();

    //widget热点处理类
    //1 iframe零件
    //2 页面零件
    //只存在当前页面
    this.components = new Collection();

    /**
     * 缓存所有的content对象引用
     * 1对1的关系
     * @type {Object}
     */
    this.contentsCollector = {};


    /**
     * 浮动对象
     * 1 母版中
     * 2 页面中
     * 页面中是最高的
     * [floatContents description]
     * @type {Object}
     */
    var floatContents = this.floatContents = {

        /**
         * 页面浮动对象容器
         * @type {[type]}
         */
        PageContainer: null,

        /**
         * 浮动页面对象
         * @type {Object}
         */
        Page: {},

        /**
         * 浮动母版容器
         */
        MasterContainer: null,

        /**
         * 浮动母版的content对象
         * 用于边界切换,自动加上移动
         * @type {Object}
         *     1：Object {}      //空对象,零件
         *     2: PPTeffect  {}  //行为对象
         */
        Master: {}
    }


    /**
     * 对象的处理情况的内部钩子方法
     * @type {Object}
     */
    this.listenerHooks = {

        //注册抽象Activity类content(大类,总content对象)
        registerAbstractActivity: function(contentsObjs) {
            self.abActivitys.register(contentsObjs);
        },

        //收集器
        collector: {
            //搜集所有的content(每一个content对象)
            //因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
            contents: function(pid, id, contentScope) {
                var scope = self.baseGetContentObject[id];
                //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
                if (scope && scope.isBindEventHooks) {
                    self.contentsCollector[id] = contentScope;
                }
                if (!scope) {
                    self.contentsCollector[id] = contentScope;
                }
            },

            //2014.11.7
            //新概念，浮动页面对象
            //用于是最顶层的，比母版浮动对象还要高
            //所以这个浮动对象需要跟随页面动
            floatPages: function(data) {
                //浮动页面对象容器
                floatContents.PageContainer = data.container;
                _.each(data.ids, function(id) {
                    if (contentObj = self.baseGetContentObject(id)) {
                        //初始视察坐标
                        if (contentObj.parallax) {
                            contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                        }
                        floatContents.Page[id] = contentObj
                    } else {
                        console.log('页面浮动对象找不到')
                    }
                })
            },

            //浮动母版对象
            //1 浮动的对象是有动画数据或者视觉差数据
            //2 浮动的对象是用于零件类型,这边只提供创建
            //  所以需要制造一个空的容器，用于母版交界动
            floatMaters: function(data) {
                var prefix,
                    contentObj,
                    contentProcess,
                    contentsFragment;
                //浮动容器
                floatContents.MasterContainer = data.container;
                //浮动对象
                _.each(data.ids, function(id) {
                    //转化成实际操作的浮动对象,保存
                    if (contentObj = self.baseGetContentObject(id)) {
                        //初始视察坐标
                        if (contentObj.parallax) {
                            contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                        }
                        floatContents.Master[id] = contentObj
                    } else {
                        Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id)
                            //获取DOM节点
                        if (contentsFragment = self.createRelated.cacheTasks.contents.contentsFragment) {
                            prefix = 'Content_' + self.pid + "_";
                            _.each(contentsFragment, function(dom) {
                                makePrefix = prefix + id;
                                if (dom.id == makePrefix) {
                                    contentProcess = dom;
                                }
                            })
                        }
                        //制作一个伪数据
                        //作为零件类型的空content处理
                        floatContents.Master[id] = {
                            id: id,
                            pid: self.pid,
                            $contentProcess: $(contentProcess),
                            'empty': true //空类型
                        }
                    }
                })
            }
        },

        //多事件钩子
        //执行多事件绑定
        eventBinding: function(eventRelated) {
            _create(self, eventRelated);
        }
    };


    /**
     * 设置下一个标记
     */
    function setNextRunTask(taskName) {
        createRelated.nextRunTask = taskName;
    }

    function callContext(taskName, fn) {
        return assignedTasks[taskName](fn, self)
    }

    /**
     * 任务钩子
     * @type {Object}
     */
    self.tasks = {
        container: function() {
            callContext('Container', function(element, pseudoElement) {
                //////////////
                //li,li-div //
                //////////////
                self.element = element;
                self.pseudoElement = pseudoElement;
                //获取根节点
                self.getElement = function() {
                    return pseudoElement ? pseudoElement : element
                }

                setNextRunTask('background')
                    //构建主容器li完毕,可以提前执行翻页动作
                createRelated.preforkComplete();
                //视觉差不管
                if (self.isMaster) {
                    self.nextTasks({
                        'taskName': '外部background',
                        'outNextTasks': function() {
                            self.dispatchTasks();
                        }
                    });
                }
            })
        },
        background: function() {
            var nextRun = function() {
                createRelated.preCreateTasks = false;
                setNextRunTask('components')
                    //针对当前页面的检测
                if (!createRelated.tasksHang || self.isMaster) {
                    self.nextTasks({
                        'taskName': '外部widgets',
                        outNextTasks: function() {
                            self.dispatchTasks();
                        }
                    });
                }

                //如果有挂起任务，则继续执行
                if (createRelated.tasksHang) {
                    createRelated.tasksHang();
                }
            }

            callContext('Background', nextRun)
        },
        components: function() {
            //构件零件类型任务
            callContext('Components', function() {
                setNextRunTask('contents')
                self.nextTasks({
                    'taskName': '外部contents',
                    outNextTasks: function() {
                        self.dispatchTasks();
                    }
                });
            })
        },
        contents: function() {
            callContext('Contetns', function() {
                setNextRunTask('complete')
                createRelated.createTasksComplete();
            })
        }
    }
}


/****************************************************************
 *
 *                     对外接口
 *
 *               1 开始调用任务
 *               2 调用自动运行任务
 *               3 设置中断
 *               4 取消中断设置
 *
 * **************************************************************/

/**
 * 开始调用任务
 * @return {[type]} [description]
 */
baseProto.startThreadTask = function(flipOver, callback) {

    //制作回调
    //如果是快速翻页,立刻调用
    this.createRelated.preforkComplete = function(context) {
        return function() {
            //滑动允许打断创建
            flipOver ? callback() :
                //所有继续分解任务
                context.checkTasksCreate(function() {
                    callback();
                })
        }
    }(this);

    //继续构建任务
    this.dispatchTasks();
}

/**
 * 检测任务是否完成
 * actTasksCallback 活动任务完成
 * @return {[type]} [description]
 */
baseProto.checkThreadTask = function(actTasksCallback) {
    var self = this;
    this.isAutoRun = true;
    this.checkTasksCreate(function() {
        self.isAutoRun = false;
        actTasksCallback();
    })
}

/**
 * 后台预创建任务
 * @param  {[type]} tasksTimer [时间间隔]
 * @return {[type]}            [description]
 */
baseProto.createPreforkTasks = function(callback, isPreCreate) {
    var self = this;
    //2个预创建间隔太短
    //背景预创建还在进行中，先挂起来等待
    if (this.createRelated.preCreateTasks) {
        this.createRelated.tasksHang = function(callback) {
            return function() {
                self.checkTasksCreate(callback);
            }
        }(callback);
        return;
    }

    /**
     * 翻页完毕后
     * 预创建背景
     */
    if (isPreCreate) {
        this.createRelated.preCreateTasks = true;
    }

    this.checkTasksCreate(callback);
}

/**
 * 自动运行：检测是否需要开始创建任务
 * 1 如果任务全部完成了毕
 * 2 如果有中断任务,就需要继续创建未完成的任务
 * 3 如果任务未中断,还在继续创建
 * currtask 是否为当前任务，加速创建
 */
baseProto.checkTasksCreate = function(callback, context) {

    //如果任务全部完成
    if (this.createRelated.nextRunTask === 'complete') {
        return callback.call(context);
    }

    var self = this;

    //开始构未完成的任务
    this.cancelTaskSuspend();

    //完毕回调
    this.createRelated.createTasksComplete = function() {
        callback.call(context)
    };

    //派发任务
    this.nextTasks({
        outNextTasks: function() {
            self.dispatchTasks();
        }
    });
}

/**
 * 设置任务中断
 */
baseProto.setTaskSuspend = function() {
    this.isAutoRun = false;
    this.canvasRelated.isTaskSuspend = true;
    this.createRelated.preCreateTasks = false;
    this.createRelated.tasksHang = null;
}

/**
 * 取消任务中断
 * @return {[type]} [description]
 */
baseProto.cancelTaskSuspend = function() {
    this.canvasRelated.isTaskSuspend = false
}

/**
 * 检测任务是否需要中断
 * @return {[type]} [description]
 */
baseProto.checkTaskSuspend = function() {
    return this.canvasRelated.isTaskSuspend;
}


/**
 * 多线程检测
 * @return {[type]} [description]
 */
baseProto.multithreadCheck = function(callbacks, interrupt) {
    //多线程检测
    var self = this;

    function check() {
        if (self.checkTaskSuspend()) {
            self.tasksTimeOutId && clearTimeout(self.tasksTimeOutId)
            callbacks.suspendCallback.call(self);
        } else {
            callbacks.nextTaskCallback.call(self);
        }
    }

    function next() {
        self.tasksTimeOutId = setTimeout(function() {
            check();
        }, self.canvasRelated.tasksTimer);
    }

    //自动运行页面构建
    if (self.isAutoRun) {
        //自动运行content中断检测 打断一次
        if (interrupt) {
            next();
        } else {
            check();
        }
    } else {
        //后台构建
        next();
    }
}

/**
 * 任务队列挂起
 * nextTaskCallback 成功回调
 * suspendCallback  中断回调
 * @return {[type]} [description]
 */
baseProto.asyTasks = function(callbacks, interrupt) {

    //如果关闭多线程,不检测任务调度
    if (!this.isMultithread) {
        return callbacks.nextTaskCallback.call(this);
    }

    //多线程检测
    this.multithreadCheck(callbacks, interrupt)
}

/**
 * 开始执行下一个线程任务,检测是否中断
 * outSuspendTasks,
 * outNextTasks
 * taskName
 * @return {[type]} [description]
 */
baseProto.nextTasks = function(callback) {
    var outSuspendTasks,
        outNextTasks,
        taskName;

    this.asyTasks({
        suspendCallback: function() {
            // console.log('@@@@@@@@@@中断创建任务 ' + callback.taskName + ' @@@@@@@@@@@', this.pid + 1, this.element)
            if (outSuspendTasks = callback.outSuspendTasks) {
                outSuspendTasks();
            }
        },
        nextTaskCallback: function() {
            if (outNextTasks = callback.outNextTasks) {
                outNextTasks();
            }
        }
    }, callback.interrupt)
}


/**
 * 任务调度
 * @return {[type]} [description]
 */
baseProto.dispatchTasks = function() {
    var tasks;
    if (tasks = this.tasks[this.createRelated.nextRunTask]) {
        tasks();
    }
}

//========================构建模块任务对象=========================
//
//  taskCallback 每个模块任务完毕后的回调
//  用于继续往下个任务构建
//
//==================================================================

/**
 * 对象实例内部构建
 * @return {[type]} [description]
 */
baseProto.checkInstanceTasks = function(taskName) {
    var tasksObj;
    if (tasksObj = this.createRelated.cacheTasks[taskName]) {
        tasksObj.runSuspendTasks();
        return true;
    }
}


//获取页面数据
baseProto.baseData = function() {
    return this.dataCache[this.pageType];
}

//获取热点数据信息
baseProto.baseActivits = function() {
    return this.dataCache['activitys'];
}

//获取自动运行数据
baseProto.baseAutoRun = function() {
    var autoRunDas = this.dataCache['autoRunDas'];
    return autoRunDas && autoRunDas;
}

//获取chapterid
baseProto.baseGetPageId = function(pid) {
    return this.baseData(pid)['_id'];
}


/**
 * 找到对象的content对象
 * @param  {[type]}   contentId [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
baseProto.baseGetContentObject = function(contentId) {
    var contentsObj;
    if (contentsObj = this.contentsCollector[contentId]) {
        return contentsObj;
    } else {
        //查找浮动母版
        return this.floatContents.Master[contentId];
    }
}


/**
 * Xut.Content.show/hide 针对互斥效果增加接口
 * 扩充，显示，隐藏，动画控制接口
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
baseProto.baseContentMutex = function(contentId, type) {
    var contentObj,
        base = this;
    if (contentObj = base.baseGetContentObject(contentId)) {
        var context = contentObj.$contentProcess;
        var handle = {
            'Show': function() {
                if (contentObj.type === 'dom') {
                    context.css({
                        'display': 'blcok',
                        'visibility': 'visible'
                    }).prop("mutex", false);
                } else {
                    context.visible = true;
                    console.log('show')
                    base.canvasRelated.oneRender()
                }
            },
            'Hide': function() {
                if (contentObj.type === 'dom') {
                    context.css({
                        'display': 'none',
                        'visibility': 'hidden'
                    }).prop("mutex", true);
                } else {
                    console.log('hide')
                    context.visible = false;
                    base.canvasRelated.oneRender()
                }
            },
            'StopAnim': function() {
                contentObj.stopAnims && contentObj.stopAnims();
            }
        }
        handle[type]()
    }
}


//content接口
_.each([
    "Get",
    "Specified"
], function(type) {
    baseProto['base' + type + 'Content'] = function(data) {
        switch (type) {
            case 'Get':
                return this.abActivitys.get();
            case 'Specified':
                return this.abActivitys.specified(data);
        }
    }
})

//components零件类型处理
//baseGetComponent
//baseRemoveComponent
//baseRegisterComponent
//baseSpecifiedComponent
_.each([
    "Get",
    "Remove",
    "Register",
    "Specified"
], function(type) {
    baseProto['base' + type + 'Component'] = function(data) {
        switch (type) {
            case 'Register':
                return this.components.register(data);
            case 'Get':
                return this.components.get();
            case 'Specified':
                return this.components.specified(data);
            case 'Remove':
                return this.components.remove();
        }
    }
})

//***************************************************************
//
//               运行辅助对象事件
//
//***************************************************************
baseProto.baseAssistRun = function(activityId, outCallBack, actionName) {
    var activity;
    if (activity = this.abActivitys) {
        _.each(activity.get(), function(contentObj, index) {
            if (activityId == contentObj.activityId) {
                if (actionName == 'Run') {
                    contentObj.runEffects(outCallBack, true);
                }
                if (actionName == 'Stop') {
                    contentObj.stopEffects(outCallBack);
                }
            }
        }, this);
    }
}

//销毁页面对象
baseProto.baseDestroy = function() {

    //清理图片缓存
    //读库快速退出模式下报错修正
    try {
        this.element.hide().find('img').each(function(aaa, img) {
            img.src = 'images/icons/clearmem.png'
        })
    } catch (e) {

    }

    //清理线程任务块
    var cacheTasks, key, tasks;
    if (cacheTasks = this.createRelated.cacheTasks) {
        for (key in cacheTasks) {
            if (tasks = cacheTasks[key]) {
                tasks.clearReference();
            }
        }
    }

    //浮动对象
    var floatMaterContents = this.floatContents.Master
        //是否有浮动对象
    var hasFloatMater = !_.isEmpty(floatMaterContents);

    //清理content类型对象
    var contents;
    if (contents = this.abActivitys.get()) {
        contents.forEach(function(contentObj) {
            contentObj.destroy(function(destroyObj) {
                //如果不是浮动对象,清理元素引用
                if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
                    destroyObj.$contentProcess = null;
                }
            });
        })
    }

    //清除母版浮动容器
    if (hasFloatMater && this.floatContents.MasterContainer) {
        this.floatContents.MasterContainer.remove();
    }

    //清除浮动页面对象
    if (this.floatContents.Page && this.floatContents.PageContainer) {
        this.floatContents.PageContainer.remove();
    }

    //清理零件类型对象
    var components;
    if ((components = this.baseGetComponent())) {
        components.length && components.forEach(function(componentObj) {
            componentObj.destroy && componentObj.destroy();
        })
    }

    //多事件销毁
    _destroy(this);

    //销毁canvas相关
    if (this.canvasRelated && this.canvasRelated.destroy) {
        this.canvasRelated.destroy();
    }

    //伪li节点
    if (this.pseudoElement) {
        this.pseudoElement = null;
    }

    //移除li容器节点节点
    this.element.remove();
    this.root = null;
    this.element = null;
}


export { PageBase }

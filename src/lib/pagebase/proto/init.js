import { Collection } from '../depend/collection'
import { create as _create } from '../depend/multievent'
//canvas相关
import { Factory as CanvasRelated } from '../depend/canvas'
import { createTransform } from '../translation'
//分配任务
import { assignedTasks } from '../threadtask'


/**
 * 初始化构建
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
export function init(baseProto) {

    /**
     * 初始化多线程任务
     * @return {[type]} [description]
     */
    baseProto.initTasks = function (options) {

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
            cacheTasks: function () {
                var cacheTasks = {};
                _.each(["background", "components", "contents"], function (taskName) {
                    cacheTasks[taskName] = false;
                })
                return cacheTasks;
            } (),

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
            preforkComplete: function () { },

            /**
             * 整个页面都构建完毕通知
             * @return {[type]} [description]
             */
            createTasksComplete: function () { }
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
            registerAbstractActivity: function (contentsObjs) {
                self.abActivitys.register(contentsObjs);
            },

            //收集器
            collector: {
                //搜集所有的content(每一个content对象)
                //因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
                contents: function (pid, id, contentScope) {
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
                floatPages: function (data) {
                    var contentObj
                    //浮动页面对象容器
                    floatContents.PageContainer = data.container;
                    _.each(data.ids, function (id) {
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
                floatMaters: function (data) {
                    var prefix,
                        contentObj,
                        contentProcess,
                        contentsFragment;
                    //浮动容器
                    floatContents.MasterContainer = data.container;
                    //浮动对象
                    _.each(data.ids, function (id) {
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
                                _.each(contentsFragment, function (dom) {
                                    var makePrefix = prefix + id;
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
            eventBinding: function (eventRelated) {
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
            container: function () {
                callContext('Container', function (element, pseudoElement) {
                    //////////////
                    //li,li-div //
                    //////////////
                    self.element = element;
                    self.pseudoElement = pseudoElement;

                    //获取根节点
                    self.getElement = function () {
                        return pseudoElement ? pseudoElement : element
                    }

                    setNextRunTask('background')

                    //构建主容器li完毕,可以提前执行翻页动作
                    createRelated.preforkComplete();
                    //视觉差不管
                    if (self.isMaster) {
                        self.nextTasks({
                            'taskName': '外部background',
                            'outNextTasks': function () {
                                self.dispatchTasks();
                            }
                        });
                    }
                })
            },
            background: function () {
                var nextRun = function () {
                    createRelated.preCreateTasks = false;
                    setNextRunTask('components')
                    //针对当前页面的检测
                    if (!createRelated.tasksHang || self.isMaster) {
                        self.nextTasks({
                            'taskName': '外部widgets',
                            outNextTasks: function () {
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
            components: function () {
                //构件零件类型任务
                callContext('Components', function () {
                    setNextRunTask('contents')
                    self.nextTasks({
                        'taskName': '外部contents',
                        outNextTasks: function () {
                            self.dispatchTasks();
                        }
                    });
                })
            },
            contents: function () {
                callContext('Contetns', function () {
                    setNextRunTask('complete')
                    createRelated.createTasksComplete();
                })
            }
        }
    }


}

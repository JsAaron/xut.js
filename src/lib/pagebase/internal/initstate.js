import { create as _create } from '../depend/multievent'
import { createTransform } from '../translation'
import Collection from '../depend/collection'
import Factory from '../depend/factory'
import assignedTasks from '../threadtask/threadtask'

const noop = function() {}


export default function(baseProto) {

    /**
     * 初始化多线程任务
     * @return {[type]} [description]
     */
    baseProto.initTasks = function(options) {

        var instance = this

        _.extend(instance, options)

        /**
         * 数据缓存容器
         * @type {Object}
         */
        this.dataCache = {}
        this.scenarioId = this.chapterDas.seasonId
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
        if (instance.pageType === 'master') {
            this.isMaster = true;
        }

        //canvas模式
        this.canvasRelated = new Factory();

        /**
         * 创建相关的信息
         * @type {Object}
         */
        const createRelated = this.createRelated = {

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
                const cacheTasks = {};
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
            preforkComplete: noop,

            /**
             * 整个页面都构建完毕通知
             * @return {[type]} [description]
             */
            createTasksComplete: noop
        }


        /**
         * 内部钩子相关
         * 监听状态的钩子
         * 注册所有content对象管理
         * 收集所有content对象
         * 构建li主结构后,即可翻页
         * 构建所有对象完毕后处理
         */

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
        const floatContents = this.floatContents = {

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

            /**
             * 注册抽象Activity类content(大类,总content对象)
             * @param  {[type]} contentsObjs [description]
             * @return {[type]}              [description]
             */
            registerAbstractActivity(contentsObjs) {
                instance.abActivitys.register(contentsObjs);
            },

            /**
             * 收集器
             * @type {Object}
             */
            collector: {
                //搜集所有的content(每一个content对象)
                //因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
                contents: function(pid, id, contentScope) {
                    var scope = instance.baseGetContentObject[id];
                    //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
                    if (scope && scope.isBindEventHooks) {
                        instance.contentsCollector[id] = contentScope;
                    }
                    if (!scope) {
                        instance.contentsCollector[id] = contentScope;
                    }
                },

                //2014.11.7
                //新概念，浮动页面对象
                //用于是最顶层的，比母版浮动对象还要高
                //所以这个浮动对象需要跟随页面动
                floatPages: function(data) {
                    //浮动页面对象容器
                    var contentObj
                    floatContents.PageContainer = data.container;
                    _.each(data.ids, function(id) {
                        if (contentObj = instance.baseGetContentObject(id)) {
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
                        if (contentObj = instance.baseGetContentObject(id)) {
                            //初始视察坐标
                            if (contentObj.parallax) {
                                contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                            }
                            floatContents.Master[id] = contentObj
                        } else {
                            Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id)
                                //获取DOM节点
                            if (contentsFragment = instance.createRelated.cacheTasks.contents.contentsFragment) {
                                prefix = 'Content_' + instance.pid + "_";
                                _.each(contentsFragment, function(dom) {
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
                                pid: instance.pid,
                                $contentProcess: $(contentProcess),
                                'empty': true //空类型
                            }
                        }
                    })
                }
            },

            /**
             * 多事件钩子
             * 执行多事件绑定
             * @param  {[type]} eventRelated [description]
             * @return {[type]}              [description]
             */
            eventBinding(eventRelated) {
                _create(instance, eventRelated);
            }
        };


        /**
         * 设置下一个标记
         */
        function setNextRunTask(taskName) {
            createRelated.nextRunTask = taskName;
        }

        function callContext(taskName, fn) {
            return assignedTasks[taskName](fn, instance)
        }

        /**
         * 任务钩子
         * @type {Object}
         */
        instance.tasks = {
            container() {
                callContext('Container', function(element, pseudoElement) {
                    //////////////
                    //li,li-div //
                    //////////////
                    instance.element = element;
                    instance.pseudoElement = pseudoElement;

                    //获取根节点
                    instance.getElement = function() {
                        return pseudoElement ? pseudoElement : element
                    }

                    setNextRunTask('background')

                    //构建主容器li完毕,可以提前执行翻页动作
                    createRelated.preforkComplete();
                    //视觉差不管
                    if (instance.isMaster) {
                        instance.nextTasks({
                            'taskName': '外部background',
                            'outNextTasks': function() {
                                instance.dispatchTasks();
                            }
                        });
                    }
                })
            },
            background() {
                var nextRun = function() {
                    createRelated.preCreateTasks = false;
                    setNextRunTask('components')
                        //针对当前页面的检测
                    if (!createRelated.tasksHang || instance.isMaster) {
                        instance.nextTasks({
                            'taskName': '外部widgets',
                            outNextTasks: function() {
                                instance.dispatchTasks();
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
            components() {
                //构件零件类型任务
                callContext('Components', function() {
                    setNextRunTask('contents')
                    instance.nextTasks({
                        'taskName': '外部contents',
                        outNextTasks: function() {
                            instance.dispatchTasks();
                        }
                    });
                })
            },
            contents() {
                callContext('Contetns', function() {
                    setNextRunTask('complete')
                    createRelated.createTasksComplete();
                })
            }
        }
    }


}

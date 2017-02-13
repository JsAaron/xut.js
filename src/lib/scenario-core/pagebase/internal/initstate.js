import { config } from '../../../config/index'
import { create as _create } from '../depend/multievent'
import Collection from '../depend/collection'
import initTasks from '../threadtask/init-task'
import Factory from '../depend/factory'

export default function(baseProto) {

    /**
     * 初始化多线程任务
     * @return {[type]} [description]
     */
    baseProto.initState = function(options) {

        const instance = this

        _.extend(instance, options)

        /**
         * 数据缓存容器
         * @type {Object}
         */
        this._dataCache = {}
        this.scenarioId = this.chapterData.seasonId
        this.chapterId = this.chapterData._id

        /**
         * 是否开启多线程,默认开启
         * 如果是非线性，则关闭多线程创建
         * 启动 true
         * 关闭 false
         * @type {[type]}
         */
        this.isMultithread = this.multiplePages ? true : false;

        //母版处理
        if(instance.pageType === 'master') {
            this.isMaster = true;
        }

        //canvas模式
        this.canvasRelated = new Factory();

        /**
         * 内部钩子相关
         * 监听状态的钩子
         * 注册所有content对象管理
         * 收集所有content对象
         * 构建li主结构后,即可翻页
         * 构建所有对象完毕后处理
         */

        /**
         * 抽象activtiys合集,用于关联各自的content
         * 划分各自的子作用域
         * 1对多的关系
         * @type {Collection}
         */
        this._abActivitys = new Collection();

        /**
         * widget热点处理类
         * 只存在当前页面
         * 1 iframe零件
         * 2 页面零件
         * @type {Collection}
         */
        this._components = new Collection();

        /**
         * 缓存所有的content对象引用
         * 1对1的关系
         * @type {Object}
         */
        this._contentsCollector = {}

        /**
         * 2016.9.7
         * column热点对象
         * @type {Collection}
         */
        this._columns = new Collection()

        /**
         * 流式布局页面
         * 排除母版
         * @param  {[type]} instance.pageType [description]
         * @return {[type]}                   [description]
         */
        if(this.pageType === 'master' && this.isFlows) {
            this.isFlows = false
        }

        /**
         * 为mini杂志新功能
         * 动画的调用序列
         * 收集滑动委托对象，针对事件合集触发处理
         * 2016.11.8
         * @type {Array}
         */
        if(config.swipeDelegate) {
            this._swipeSequence = {
                swipeleft: [],
                swiperight: [],
                swipeleftTotal: 0,
                swiperightTotal: 0,
                swipeleftIndex: 0,
                swiperightIndex: 0
            }
        }

        /**
         * 初始化任务完成钩子
         * @return {[type]} [description]
         */
        this.initTasksCompleteHook = () => {
            //注册_columns对象改变
            if(config.columnCheck) {
                const columnObj = this._columns.get()
                if(columnObj && columnObj.length) {
                    if(!this.unWatchDep) {
                        this.unWatchDep = []
                    }
                    columnObj.forEach(obj => {
                        let dep = Xut.Application.Watch('change:column', function() {
                            obj.resetColumnDep(instance.chapterId < Xut.Presentation.GetPageId() ? 'next' : 'prev')
                        })
                        this.unWatchDep.push(() => Xut.Application.unWatch('change:column', dep))
                    })
                }
            }
        }


        /**
         * 浮动对象
         * 1 母版中
         * 2 页面中
         * 页面中是最高的
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
            registerActivitys(contentsObjs) {
                instance._abActivitys.register(contentsObjs);
            },

            /**
             * 搜集所有的content(每一个content对象)
             * 因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
             */
            contents(pid, id, contentScope) {
                const scope = instance.baseGetContentObject[id]
                    //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
                if(scope && scope.isBindEventHooks) {
                    instance._contentsCollector[id] = contentScope;
                }
                if(!scope) {
                    instance._contentsCollector[id] = contentScope;
                }
            },

            /**
             * 2014.11.7
             * 新概念，浮动页面对象
             * 用于是最顶层的，比母版浮动对象还要高
             * 所以这个浮动对象需要跟随页面动
             */
            floatPages(data) {
                //浮动页面对象容器
                let contentObj
                floatContents.PageContainer = data.container;
                _.each(data.ids, function(id) {
                    if(contentObj = instance.baseGetContentObject(id)) {
                        //初始视察坐标
                        if(contentObj.parallax) {
                            contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                        }
                        floatContents.Page[id] = contentObj
                    } else {
                        console.log('页面浮动对象找不到')
                    }
                })
            },

            /**
             * 浮动母版对象
             * 1 浮动的对象是有动画数据或者视觉差数据
             * 2 浮动的对象是用于零件类型,这边只提供创建
             *  所以需要制造一个空的容器，用于母版交界动
             */
            floatMaters(data) {
                let prefix
                let contentObj
                let contentNode
                let contentsFragment

                //浮动容器
                floatContents.MasterContainer = data.container;
                //浮动对象
                _.each(data.ids, function(id) {
                    //转化成实际操作的浮动对象,保存
                    if(contentObj = instance.baseGetContentObject(id)) {
                        //初始视察坐标
                        if(contentObj.parallax) {
                            contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                        }
                        floatContents.Master[id] = contentObj
                    } else {
                        Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id)
                            //获取DOM节点
                        if(contentsFragment = instance.createRelated.cacheTasks.contents.contentsFragment) {
                            prefix = 'Content_' + instance.pid + "_"
                            _.each(contentsFragment, function(dom) {
                                var makePrefix = prefix + id;
                                if(dom.id == makePrefix) {
                                    contentNode = dom;
                                }
                            })
                        }
                        //制作一个伪数据
                        //作为零件类型的空content处理
                        floatContents.Master[id] = {
                            id: id,
                            pid: instance.pid,
                            $contentNode: $(contentNode),
                            'empty': true //空类型
                        }
                    }
                })
            },

            /**
             * 多事件钩子
             * 执行多事件绑定
             * @param  {[type]} eventRelated [description]
             * @return {[type]}              [description]
             */
            eventBinding(eventRelated) {
                _create(instance, eventRelated);
            },

            /**
             * 2016.11.8
             * 收集滑动委托对象，针对事件合集触发处理
             * @return {[type]} [description]
             */
            swipeDelegateContents(eventName, fn) {
                ++instance._swipeSequence[eventName + 'Total']
                instance._swipeSequence[eventName].push(fn)
            }
        }

        /**
         * 初始化任务
         * 等待状态初始化，比如_isFlows
         */
        initTasks(instance)

    }

}

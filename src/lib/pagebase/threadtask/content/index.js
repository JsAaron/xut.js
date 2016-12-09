/****************************************************
 *
 *           构建TaskContents对象
 *
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 *
 * ***************************************************/

import { config } from '../../../config/index'

import contentStructure from './structure/index'
import ActivityClass from '../../../component/activity/index'

import {
    contentParser,
    activityParser
} from './data'

import { parseJSON } from '../../../util/index'

import {
    createFloatMater,
    createFloatPage
} from './float'

import nextTick from '../../../util/nexttick'

/**
 * 点击缩放功能，独立的
 */
import {
    $$on,
    $$off
} from '../../../util/dom'
import Zoom from '../../../plugin/extend/zoom/index'


function createFn(obj, id, callback) {
    var cObj = obj[id];
    if (!cObj) {
        cObj = obj[id] = {};
    }
    callback.call(cObj);
}

/**
 * 转成数组格式
 * @param  {[type]} contentsFragment [description]
 * @return {[type]}                  [description]
 */
function toArray(o) {
    var contentsFragment = [];
    _.each(o, function($node) {
        contentsFragment.push($node)
    })
    return contentsFragment;
}

/**
 * 构建快速查询节点对象
 * 转成哈希方式
 * @return {[type]} [description]
 */
function toObject(cachedContentStr) {
    var tempFragmentHash = {};
    _.each($(cachedContentStr), function(ele, index) {
        tempFragmentHash[ele.id] = ele;
    })
    return tempFragmentHash;
}

/**
 * 行为反馈
 *  content id = {
 *      弹动
 *      音频URl
 *  }
 *  2016.12.6
 *     增加，点击放大 zoom
 */
function parseBehavior(data) {
    let parameter
    let soundSrc
    let contentId
    let isButton
    let feedbackBehavior = data.feedbackBehavior = {} //点击行为
    let zoomBehavior = data.zoomBehavior = {} //缩放行为
    let hasZoom
    let pid = data.pid
    let prefix
    let id

    _.each(data.activitys, function(activitys) {
        if (activitys.parameter && (parameter = parseJSON(activitys.parameter))) {
            contentId = activitys.imageId;

            //视觉反馈
            if (isButton = parameter['isButton']) {
                if (isButton != 0) { //过滤数据的字符串类型
                    createFn(feedbackBehavior, contentId, function() {
                        this['isButton'] = true;
                    })
                }
            }

            //音频行为
            if (soundSrc = parameter['behaviorSound']) {
                if (soundSrc != 0) {
                    createFn(feedbackBehavior, contentId, function() {
                        this['behaviorSound'] = soundSrc;
                    })
                }
            }

            //点击图片放大
            if (hasZoom = parameter['zoom']) {
                if (hasZoom.length) {
                    _.each(hasZoom, function(zoomData) {
                        id = zoomData.content
                        if (id) {
                            //保存于节点node命名一致，方便快速查找
                            prefix = "Content_" + pid + "_" + id
                            createFn(zoomBehavior, prefix, function() {
                                //缩放提示图片
                                this['prompt'] = zoomData.prompt ? true : false
                            })
                        }
                    })
                }
            }
        }
    })

}


/** 配置ID
 * @return {[type]} [description]
 */
function autoUUID() {
    return 'autoRun-' + Math.random().toString(36).substring(2, 15)
}

/**
 * 给所有content节点绑定对应的事件与动画
 * 1 动画
 * 2 事件
 * 3 视觉差
 * 4 动画音频
 * 5 canvas动画
 * @return {[type]} [description]
 */
function applyActivitys(data, contentDas, callback) {
    var compiler,
        $containsNode = data.$containsNode,
        eventRelated = data.eventRelated, //合集事件
        pid = data.pid,
        createActivitys = data.createActivitys,
        feedbackBehavior = data.feedbackBehavior, //反馈数据,跟事件相关
        pageBaseHooks = data.pageBaseHooks,
        pageId = data.chapterId;

    //如果有浮动对象,才需要计算偏移量
    //母版里面可能存在浮动或者不浮动的对象
    //那么在布局的时候想对点不一样
    //如果在浮动区域就取浮动初始值
    //否则就是默认的想对点0
    var getTransformOffset = function(ids, initTransformOffset) {
        return function(id) {
            //匹配是不是属于浮动对象
            if (ids.length && ids[id]) {
                //初始化容器布局的坐标
                return initTransformOffset
            }
            return 0
        }
    }(data.floatMaters.ids, data.getStyle.offset);

    //相关回调
    var relatedCallback = {

        /**
         * 绑定卷滚条钩子
         */
        'iscrollHooks': [],

        /**
         * contetn钩子回调
         */
        'contentsHooks': pageBaseHooks.contents,

        /**
         * 收集滑动事件
         * 针对mini
         * 2016.11.8
         */
        'swipeDelegateContents': pageBaseHooks.swipeDelegateContents
    }

    //相关数据
    var relatedData = {
        'floatMaters': data.floatMaters,
        'seasonId': data.chpaterData.seasonId,
        'pageId': pageId,
        'contentDas': contentDas, //所有的content数据合集
        'container': data.liRootNode,
        'seasonRelated': data.seasonRelated,
        'containerPrefix': data.containerPrefix,
        'nodes': data.nodes,
        'pageOffset': data.pageOffset,
        'createContentIds': data.createContentIds,
        'partContentRelated': data.partContentRelated,
        'getTransformOffset': getTransformOffset,
        'contentsFragment': data.contentsFragment,
        'contentHtmlBoxIds': data.contentHtmlBoxIds
    }

    /**
     * 继续下一个任务
     * @return {[type]} [description]
     */
    var nextTask = function() {
        //多事件合集处理pagebase
        if (eventRelated) {
            pageBaseHooks.eventBinding && pageBaseHooks.eventBinding(eventRelated)
        }
        //删除钩子
        delete relatedCallback.contentsHooks;
        callback(relatedCallback)
    }


    /**
     * 生成activty控制对象
     * @type {[type]}
     */
    var makeActivitys = function(compiler) {
        return function(callback) {
            var filters;
            var imageId = compiler['imageIds']; //父id
            var activity = compiler['activity'];
            var eventType = activity.eventType;
            var dragdropPara = activity.para1;
            var eventContentId = imageId;

            /**
             * 多事件数据过滤
             * 为了防止数据写入错误数据
             * 如果当前对象上有多事件的行为
             * 则默认的事件去掉
             * @type {[type]}
             */
            if (filters = eventRelated['eventContentId->' + imageId]) {
                _.each(filters, function(edata) {
                    //id不需要
                    //eventContentId = void 0;
                    if (edata.eventType == activity.eventType) {
                        //写入的是伪数据,此行为让多事件抽象接管
                        eventType = dragdropPara = undefined
                    }
                })
            }

            //需要绑定事件的数据
            var eventData = {
                'eventContentId': eventContentId,
                'eventType': eventType,
                'dragdropPara': dragdropPara,
                'feedbackBehavior': feedbackBehavior
            }

            var actdata = {
                'noticeComplete': callback, //监听完成
                'pageIndex': data.pageIndex,
                'canvasRelated': data.canvasRelated, //父类引用
                'id': imageId || autoUUID(),
                "type": 'Content',
                'pageId': pageId,
                'activityId': activity._id,
                '$containsNode': $containsNode,
                'pageType': compiler['pageType'], //构建类型 page/master
                'seed': compiler['seed'], //动画表数据 or 视觉差表数据
                "pid": pid, //页码
                'eventData': eventData, //事件数据
                'relatedData': relatedData, //相关数据,所有子作用域Activity对象共享
                'relatedCallback': relatedCallback //相关回调
            }

            //注册引用
            pageBaseHooks.registerActivitys(new ActivityClass(actdata))
        }
    }

    //制作curry Activity闭包
    var fnsActivity = []
    while (compiler = createActivitys.shift()) {
        fnsActivity.push(makeActivitys(compiler))
    }

    // 递归解析 activitys
    var recursiveParse = function() {
        if (!fnsActivity.length) {
            nextTask()
            return
        }
        var first = fnsActivity.shift()
        first(function() {
            recursiveParse()
        })
    }
    recursiveParse()
}


/**
 * content任务类
 */
export default class TaskContents {

    constructor(activityData) {

        _.extend(this, activityData)

        //只解析content有关的activityData
        let compileActivitys = activityParser(activityData)

        //如果有预执行动作
        //Activity表数据存在
        if (compileActivitys) {
            //解析动画表数据结构
            activityData = contentParser(compileActivitys, activityData)
                //如果有需要构建的content
                //开始多线程处理
            activityData.createContentIds.length ? this._dataAfterCheck(activityData) : this._loadComplete();
        } else {
            this._loadComplete();
        }
    }

    /**
     * 构建完毕
     * @return {[type]} [description]
     */
    _loadComplete() {
        this.pageBaseHooks.success();
    }

    /**
     * 任务断言
     */
    _assert(taskName, tasks) {

        var self = this;

        //中断方法
        var suspendTasks = function() {
            self.suspendQueues = [];
            self.suspendQueues.push(function() {
                tasks.call(self);
            })
        }

        //完成方法
        var nextTasks = function() {
            tasks.call(self);
        }

        self.pageBaseHooks.suspend(taskName, nextTasks, suspendTasks);
    }

    /**
     * 中断一:构建数据之后
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    _dataAfterCheck(data) {

        this._assert('dataAfter', function() {

            //浮动模板
            //用于实现模板上的事件
            data.floatMaters = {
                'ids': [], //浮动id
                'container': {}, //浮动容器
                'zIndex': {}
            }

            //浮动页面
            //母板事件引起的层级遮挡问题
            //用于提升最高
            data.floatPages = {
                'ids': [],
                'zIndex': {}
            }

            //解析activitys.parameter中的数据里
            //点击反馈
            //点击缩放
            parseBehavior(data)

            //构建页面content类型结构
            //contentDas, contentStr, containerPrefix, idFix, contentHtmlBoxIds
            contentStructure(userData => {

                data.contentHtmlBoxIds = userData.contentHtmlBoxIds
                data.contentsFragment = {}

                //iboosk节点预编译
                //在执行的时候节点已经存在
                //不需要在创建
                if (Xut.IBooks.runMode()) {
                    _.each(userData.idFix, function(id) {
                        data.contentsFragment[id] = data.$containsNode.find("#" + id)[0]
                    })
                } else {
                    //构件快速查询节点对象
                    data.contentsFragment = toObject(userData.contentStr)
                    delete userData.contentStr
                }

                //容器的前缀
                data.containerPrefix = userData.containerPrefix

                /* eslint-disable */
                //2015.5.6暴露到全局
                //提供给音频字幕上下文
                if (!Xut.Contents.contentsFragment[data.chapterId]) {
                    Xut.Contents.contentsFragment[data.chapterId];
                }
                Xut.Contents.contentsFragment[data.chapterId] = data.contentsFragment
                    /* elist-enable */

                //开始下一个任务
                this._dataStrCheck(data, userData.contentDas);

            }, data, this)

        })
    }

    /**
     * 中断二:构建结构之后
     * @param  {[type]} data       [description]
     * @param  {[type]} contentDas [description]
     * @return {[type]}            [description]
     */
    _dataStrCheck(data, contentDas) {
        this._assert('strAfter', function() {

            //如果有点击放大的功能
            if (Object.keys(data.zoomBehavior).length) {
                let self = this
                self.zoomObj = {} //保存缩放对象
                _.each(data.contentsFragment, function(node) {
                    //需要单独绑定点击放大功能
                    let zoomBehavior = data.zoomBehavior[node.id]
                    if (zoomBehavior) {
                        //提示图片
                        let prompt = zoomBehavior.prompt
                        if (prompt) {
                            let zoomIcon
                            //横屏
                            if (config.screenSize.width > config.screenSize.height) {
                                zoomIcon = `<div class="ionicons ion-arrow-expand" style="font-size:4vw;position:absolute;right:0;top:-0.5vw;"></div>`
                            } else {
                                //竖屏
                                zoomIcon = `<div class="ionicons ion-arrow-expand" style="font-size:3vh;position:absolute;right:0;top:-0.375vh;"></div>`

                            }
                            $(node).append(String.styleFormat(zoomIcon))

                        }
                        let start = function() {
                            let $node = $(node)
                            let $imgNode = $node.find('img')
                            let src = config.pathAddress + $imgNode[0].src.match(/\w+.(jpg|png)/gi)
                            let zoomObj = self.zoomObj[src]
                            if (zoomObj) {
                                zoomObj.play()
                            } else {
                                let hqSrc
                                if (config.hqUrlSuffix) {
                                    hqSrc = src.replace('.', `.${config.hqUrlSuffix}.`)
                                }
                                self.zoomObj[src] = new Zoom({
                                    element: $imgNode,
                                    originalSrc: src,
                                    hdSrc: hqSrc
                                })
                            }
                        }
                        $$on(node, { start })
                        zoomBehavior.off = function() {
                            $$off(node, { start })
                            node = null
                        }
                    }
                })
                this.zoomBehavior = data.zoomBehavior
            }


            //保留场景的留信息
            //用做软件制作单页预加载
            Xut.sceneController.seasonRelated = data.seasonRelated

            //初始化content对象
            applyActivitys(data, contentDas, delayHooks => this._eventAfterCheck(data, delayHooks))
        })
    }

    /**
     * 中断三:绑定事件事件之后
     * @param  {[type]} iScrollHooks [description]
     * @return {[type]}              [description]
     */
    _eventAfterCheck(data, delayHooks) {

        var self = this;

        this._assert('eventAfter', function() {

            data.count = 1; //计算回调的成功的次数

            /**
             * 完成钩子函数
             * 1 content的卷滚条
             * 2 canvas事件绑定
             * @return {[type]} [description]
             */
            var callHooks = function() {
                let iscrollHooks = delayHooks.iscrollHooks
                let hook
                if (iscrollHooks.length) {
                    while (hook = iscrollHooks.shift()) {
                        hook()
                    }
                }
            }

            var nextTask = function() {
                delayHooks && callHooks()
                self._applyAfterCheck()
            }

            /**
             * 1 页面浮动
             * 2 母版浮动
             * 3 正常对象
             */
            var complete = function(data) {
                return function() {
                    if (data.count === 1) {
                        nextTask()
                        return
                    }
                    data.count--;
                }
            }(data);


            //浮动页面对
            //浮动对象比任何层级都都要高
            //超过母版
            if (data.floatPages.ids && data.floatPages.ids.length) {
                createFloatPage(this, data, complete)
            }

            //如果存在母版浮动节点
            //在创建节点structure中过滤出来，根据参数的tipmost
            if (data.floatMaters.ids && data.floatMaters.ids.length) {
                createFloatMater(this, data, complete)
            }


            //iboosk节点预编译
            //在执行的时候节点已经存在
            //不需要在创建
            if (Xut.IBooks.runMode()) {
                complete();
            } else {
                //正常对象
                nextTick({
                    'container': data.$containsNode,
                    'content': toArray(data.contentsFragment)
                }, complete);
            }
        })
    }

    /**
     * 中断四：渲染content
     * @return {[type]} [description]
     */
    _applyAfterCheck() {
        this._assert('applyAfter', function() {
            this._loadComplete(true)
        })
    }

    /**
     * 运行被阻断的线程任务
     * @return {[type]} [description]
     */
    runSuspendTasks() {
        if (this.suspendQueues) {
            var fn;
            if (fn = this.suspendQueues.pop()) {
                fn();
            }
            this.suspendQueues = null;
        }
    }

    /**
     * 清理引用
     * @return {[type]} [description]
     */
    clearReference() {
        //删除字幕用的碎片文档
        if (Xut.Contents.contentsFragment[this.chapterId]) {
            delete Xut.Contents.contentsFragment[this.chapterId]
        }

        //清理放大图片功能
        if (this.zoomBehavior && Object.keys(this.zoomBehavior).length) {
            //清理缩放绑定事件
            _.each(this.zoomBehavior, function(zoomBehavior) {
                if (zoomBehavior.off) {
                    zoomBehavior.off()
                }
            })
            this.zoomBehavior = null

            //清理缩放对象
            _.each(this.zoomObj, function(zoomObj) {
                zoomObj.destroy()
            })
            this.zoomObj = null
        }

        this.canvasRelated = null
        this.pageBaseHooks = null
        this.$containsNode = null;
        this.rootNode = null;
        this.contentsFragment = null;
    }

}

/****************************************************
 *
 *           构建TaskContents对象
 *
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 *
 * ***************************************************/
import contentParser from './data'
import contentStructure from './structure/index'
import ActivityClass from '../../../component/activity/activity'

import {
    parseJSON,
    arrayUnique
} from '../../../util/index'

import nextTick from '../../../util/nexttick'

const TRANSFORM = Xut.style.transform

/**
 * 解析出需要构建的content对象
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function onlyParseContents(data) {
    var actType,
        preCompileContent = [];

    //需要创建的数据结构
    _.each(data.activitys, function(activityData) {
        actType = activityData.actType || activityData.animation;
        //特殊类型 showNote
        if (!actType && activityData.note) {
            activityData['actType'] = actType = "ShowNote";
        }
        if (activityData.itemArray || activityData.autoPlay !== 2) {
            switch (actType) {
                case 'Container':
                case 'Content':
                case 'Parallax':
                case 'Contents':
                    preCompileContent.push(activityData);
                    break;
            }
        }
        //编译content类型
        // 1 通过Animation表产生
        // 2 通过Parallax 表产生
        function compileContent() {
            preCompileContent.push({
                postprocessor: function(rootEle, pid) {
                    activityData['nodes'] = data['nodes'];
                    activityData['pageOffset'] = data['pageOffset'];
                    return activityData;
                }
            });
        }
    })
    return preCompileContent.length ? preCompileContent : null;
}



export default function TaskContents(activityData) {
    activityData = _.extend(this, activityData);

    //只解析content有关的activityData
    var compileActivitys = onlyParseContents(activityData)

    //如果有预执行动作
    //Activity表数据存在
    if (compileActivitys) {
        //解析动画表数据结构
        activityData = contentParser(compileActivitys, activityData);
        //如果有需要构建的content
        //开始多线程处理
        activityData.createContentIds.length ? this.dataAfterCheck(activityData) : this.loadComplete();
    } else {
        this.loadComplete();
    }
}


var taskProto = TaskContents.prototype;

/**
 * 任务断言
 */
taskProto.assert = function(taskName, tasks) {

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
 * 运行被阻断的线程任务
 * @return {[type]} [description]
 */
taskProto.runSuspendTasks = function() {
    if (this.suspendQueues) {
        var fn;
        if (fn = this.suspendQueues.pop()) {
            fn();
        }
        this.suspendQueues = null;
    }
}

/**
 * 构建完毕
 * @return {[type]} [description]
 */
taskProto.loadComplete = function() {
    this.pageBaseHooks.success();
}


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
};


/**
 * 行为反馈
 *  content id = {
 *      弹动
 *      音频URl
 *  }
 */
function addBehavior(data) {
    var parameter, soundSrc, contentId, isButton,
        feedbackBehavior = data.feedbackBehavior = {};
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
        }
    })
}


/**
 * 中断一:构建数据之后
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
taskProto.dataAfterCheck = function(data) {

    this.assert('dataAfter', function() {

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

        //增加点击行为反馈
        addBehavior(data)


        //构建页面content类型结构
        //contentDas, contentStr, containerPrefix, idFix, contentHtmlBoxIds
        var createStr = function(userData) {

            data.contentHtmlBoxIds = userData.contentHtmlBoxIds;
            data.contentsFragment = {};

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
            data.containerPrefix = userData.containerPrefix;

            /* eslint-disable */
            //2015.5.6暴露到全局
            //提供给音频字幕上下文
            if (!Xut.Contents.contentsFragment[data.chapterId]) {
                Xut.Contents.contentsFragment[data.chapterId];
            }
            Xut.Contents.contentsFragment[data.chapterId] = data.contentsFragment
                /* elist-enable */

            //开始下一个任务
            this.dataStrCheck(data, userData.contentDas);
        }

        //构建页面节点
        contentStructure(createStr, data, this);

    })
}


/**
 * 中断二:构建结构之后
 * @param  {[type]} data       [description]
 * @param  {[type]} contentDas [description]
 * @return {[type]}            [description]
 */
taskProto.dataStrCheck = function(data, contentDas) {
    this.assert('strAfter', function() {

        var self = this

        //保留场景的留信息
        //用做软件制作单页预加载
        Xut.sceneController.seasonRelated = data.seasonRelated

        //初始化content对象
        //绑定content
        //1 动画
        //2 事件
        //3 视觉差
        //4 动画音频
        //5 canvas动画
        var cb = function(delayHooks) {
            //渲染页面
            self.eventAfterCheck(data, delayHooks);
        }

        bindActivitys(cb, data, contentDas);
    })
}


/**
 * 创建浮动相关的信息
 * @param  {Function} callback  [description]
 * @param  {[type]}   floatName [description]
 * @param  {[type]}   dasFloat  [description]
 * @param  {[type]}   data      [description]
 * @param  {[type]}   base      [description]
 * @return {[type]}             [description]
 */
function crateFloat(callback, floatName, dasFloat, data, base) {

    var $containsNodes = [];
    var prefix = 'Content_' + data.pid + "_";

    //去重复
    dasFloat.ids = arrayUnique(dasFloat.ids)

    var makePrefix,
        fragment,
        zIndex,
        zIndexs = dasFloat.zIndex;

    data.count++;

    //分离出浮动节点
    _.each(dasFloat.ids, function(id) {
        makePrefix = prefix + id;
        if (fragment = data.contentsFragment[makePrefix]) {
            zIndex = zIndexs[id];
            //保证层级关系
            // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex)) 
            $containsNodes.push(fragment);
            delete data.contentsFragment[makePrefix]
        }
    })

    //floatPages模式下面
    //如果是当前页面
    //因为会产生三页面并联
    //所以中间去最高层级
    if (floatName === 'floatPages' && data.getStyle.offset === 0) {
        zIndex = 2001
    } else {
        zIndex = 2000
    }

    //浮动根节点
    //floatPages设置的content溢出后处理
    //在非视区增加overflow:hidden
    //可视区域overflow:''
    var overflow = 'overflow:hidden;'
        //如果是母板,排除
    if (floatName === 'floatMaters') {
        overflow = ''
    }

    var floatStr = String.format(
        '<div id="' + floatName + '-li-{0}" class="xut-float" style="' + TRANSFORM + ':{1};z-index:' + zIndex + ';{2}"></div>',
        data.pid, data.getStyle.translate, overflow
    )

    var container = $(floatStr)

    //增加浮动容器
    $(data.rootNode).after(container)

    callback($containsNodes, container)
}


/**
 * 创建浮动母版对象
 * @return {[type]} [description]
 */
function createFloatMater(base, data, complete) {
    //创建浮动对象
    crateFloat(function($containsNodes, container) {
        //浮动容器
        data.floatMaters.container = container;

        nextTick({
            'container': container,
            'content': $containsNodes
        }, function() {
            //收集浮动母版对象标识
            base.pageBaseHooks.collector.floatMaters(data.floatMaters);
            complete(data);
        });
    }, 'floatMaters', data.floatMaters, data, base)
}


/**
 * 创建浮动的页面对象
 */
function createFloatPage(base, data, complete) {
    //创建浮动对象
    crateFloat(function($containsNodes, container) {
        //浮动容器
        data.floatPages.container = container;
        nextTick({
            'container': container,
            'content': $containsNodes
        }, function() {
            //收集浮动母版对象标识
            base.pageBaseHooks.collector.floatPages(data.floatPages);
            complete(data);
        });
    }, 'floatPages', data.floatPages, data, base)
}


/**
 * 中断三:绑定事件事件之后
 * @param  {[type]} iScrollHooks [description]
 * @return {[type]}              [description]
 */
taskProto.eventAfterCheck = function(data, delayHooks) {

    var self = this;

    this.assert('eventAfter', function() {

        data.count = 1; //计算回调的成功的次数

        /**
         * 完成钩子函数
         * 1 content的卷滚条
         * 2 canvas事件绑定
         * @return {[type]} [description]
         */
        var completeHooks = function() {
            var hooks;
            _.each(delayHooks, function(fns) {
                while (hooks = fns.shift()) {
                    hooks();
                }
            })
        }

        var nextTask = function() {
            completeHooks();
            self.applyAfterCheck();
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
taskProto.applyAfterCheck = function() {
    this.assert('applyAfter', function() {
        //构建页面节点
        // Xut.log('debug', '第' + (self.pid + 1) + '页面content相关的节点与事件全部构建完毕................')
        this.loadComplete(true);
    })
}


/**
 * 清理引用
 * @return {[type]} [description]
 */
taskProto.clearReference = function() {
    //删除字幕用的碎片文档
    if (Xut.Contents.contentsFragment[this.chapterId]) {
        delete Xut.Contents.contentsFragment[this.chapterId]
    }
    this.$containsNode = null;
    this.rootNode = null;
    this.contentsFragment = null;
}



/** 配置ID
 * @return {[type]} [description]
 */
function autoUUID() {
    return 'autoRun-' + Math.random().toString(36).substring(2, 15)
}


/**
 * 给所有content节点绑定对应的事件与动画
 * @return {[type]} [description]
 */
function bindActivitys(callback, data, contentDas) {
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
    var transformOffset = function(ids, initTransformOffset) {
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
        //绑定卷滚条钩子
        'iscrollHooks': [],
        //contetn钩子回调
        'contentsHooks': pageBaseHooks.collector.contents
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
        'transformOffset': transformOffset,
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
                        eventType = dragdropPara = void 0;
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
            pageBaseHooks.registerAbstractActivity(
                new ActivityClass(actdata)
            );
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

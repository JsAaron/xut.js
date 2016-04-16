//***********************************************************
//
//             多线程任务构建
//
//**********************************************************

//数据解析
import { query } from '../vm/parser'
//子任务
import { TaskContainer, TaskBackground, TaskContents, TaskComponents } from './thread/index'


//更新数据缓存
function updataCache(pid, callback) {
    var fn,
        base = this,
        pageType = base.pageType;

    //缓存数据
    function addCacheDas(namespace, data) {
        var key;
        if (!base.dataCache[namespace]) {
            base.dataCache[namespace] = data;
        } else {
            for (key in data) {
                base.dataCache[namespace][key] = data[key];
            }
        }
    }

    //增加数据缓存
    function addCache(data, activitys, autoRunDas) {
        addCacheDas(base.pageType, data); //挂载页面容器数据
        addCacheDas('activitys', activitys); //挂载activitys数据
        addCacheDas('autoRunDas', autoRunDas); //挂载自动运行数据
    }

    query(pageType, {
        'pageIndex': pid,
        'pageData': base.chapterDas,
        'pptMaster': base.pptMaster
    }, function(data, activitys, autoRunDas) {
        addCache.apply(addCache, arguments)
        callback(data);
    })
}


/**
 * 分配Container构建任务
 * 1 同步数据
 * 2 构建容器
 * 3 给出构建回调,这里不能中断,翻页必须存在节点
 * 4 等待之后自动创建或者后台空闲创建之后的任务
 * @return {[type]} [description]
 */
var assignedTasks = {

    'Container': function(taskCallback, base) {
        //同步数据
        updataCache.call(base, [base.pid], function() {
            var pageData = base.baseData();
            if (pageData.parameter) {
                // contentMode 分为  0 或者 1
                // 1 是dom模式
                // 0 是canvas模式
                // 以后如果其余的在增加
                // 针对页面chapter中的parameter写入 contentMode   值为 1
                // 针对每一个content中的parameter写入 contentMode 值为 1
                // 如果是canvas模式的时候，同时也是能够存在dom模式是
                try {
                    var parameter = JSON.parse(pageData.parameter);
                    if (parameter && parameter.contentMode && parameter.contentMode == 1) {
                        //启动dom模式
                        base.canvasRelated.enable = true;
                    }
                } catch (e) {
                    console.log('JSON错误,chpterId为', base.chapterId, pageData.parameter)
                }
            }

            //创建主容器
            TaskContainer({
                'rootNode': base.root,
                'prefix': base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId,
                'pageType': base.pageType,
                'pid': base.pid,
                'baseData': pageData,
                'virtualOffset': base.virtualOffset,
                'initTransformParameter': base.createRelated.initTransformParameter,
                'userStyle': base.userStyle //创建自定义style
            }, taskCallback)
        })
    },


    /**
     *  分配背景构建任务
     *    1 构建数据与结构,执行中断检测
     *    2 绘制结构,执行回调
     *
     *  提供2组回调
     *    1 构建数据结构 suspendCallback
     *    2 执行innerhtml构建完毕 successCallback
     */
    'Background': function(taskCallback, base) {

        if (base.checkInstanceTasks('background')) {
            return;
        }

        var data = base.baseData(base.pid),
            //构建中断回调
            suspendCallback = function(innerNextTasks, innerSuspendTasks) {
                base.nextTasks({
                    'taskName': '内部background',
                    'outSuspendTasks': innerSuspendTasks,
                    'outNextTasks': innerNextTasks
                });
            },
            //获取数据成功回调
            successCallback = function() {
                taskCallback();
            };

        base.createRelated.cacheTasks['background'] = new TaskBackground(base.getElement(), data, suspendCallback, successCallback)
    },

    /**
     * 分配Components构建任务
     * @return {[type]} [description]
     */
    'Components': function(taskCallback, base) {

        if (base.checkInstanceTasks('components')) {
            return;
        }

        var chapterDas = base.chapterDas,
            baseData = base.baseData(),
            //构建中断回调
            suspendCallback = function(innerNextTasks, innerSuspendTasks) {
                base.nextTasks({
                    'taskName': '内部widgets',
                    'outSuspendTasks': innerSuspendTasks,
                    'outNextTasks': innerNextTasks
                });
            },
            //获取数据成功回调
            successCallback = function() {
                taskCallback();
            };

        base.createRelated.cacheTasks['components'] = new TaskComponents({
            'rootNode': base.getElement(),
            'nodes': chapterDas['nodes'],
            'pageOffset': chapterDas['pageOffset'],
            'activitys': base.baseActivits(),
            'chpaterData': baseData,
            'chapterId': baseData['_id'],
            'pid': base.pid,
            'pageType': base.pageType,
            'virtualOffset': base.virtualOffset
        }, suspendCallback, successCallback);
    },

    /**
     * 分配contetns构建任务
     * @return {[type]} [description]
     */
    'Contetns': function(taskCallback, base) {

        //通过content数据库为空处理
        if (Xut.data.preventContent) {
            return taskCallback();
        }

        if (base.checkInstanceTasks('contents')) {
            return;
        }

        var chapterDas = base.chapterDas,
            baseData = base.baseData(),
            chapterId = baseData['_id'],
            activitys = base.baseActivits(),

            //生成钩子
            // collector                : function (pageIndex, id, contentScope) {
            // eventBinding             : function () { [native code] }
            // floatMaters              : function (masters){
            // registerAbstractActivity : function (pageIndex, type, contentsObjs) {
            // successCallback          : function () {
            // suspendCallback          : function (taskName, innerNextTasks, innerSuspendTasks) {
            pageBaseHooks = _.extend({}, {
                //构建中断回调
                suspend: function(taskName, innerNextTasks, innerSuspendTasks) {
                    //如果是当前页面构建,允许打断一次
                    var interrupt
                    if (base.isAutoRun && taskName === 'strAfter') {
                        interrupt = true;
                    }
                    base.nextTasks({
                        'interrupt': interrupt,
                        'taskName': '内部contents',
                        'outSuspendTasks': innerSuspendTasks,
                        'outNextTasks': innerNextTasks
                    });
                },
                //获取数据成功回调
                success: function() {
                    taskCallback();
                }
            }, base.listenerHooks);


        base.createRelated.cacheTasks['contents'] = new Contents({
            'canvasRelated': base.canvasRelated,
            'rootNode': base.root,
            'element': base.getElement(),
            'pageType': base.pageType,
            'nodes': chapterDas['nodes'],
            'pageOffset': chapterDas['pageOffset'],
            'activitys': activitys,
            'chpaterData': baseData,
            'chapterId': chapterId,
            'pageIndex': base.pageIndex,
            'pid': base.pid,
            'pageBaseHooks': pageBaseHooks,
            'virtualOffset': base.virtualOffset,
            'initTransformParameter': base.createRelated.initTransformParameter
        });
    }
}

export { assignedTasks }

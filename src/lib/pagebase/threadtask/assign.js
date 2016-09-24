import updataCache from './cache'
import TaskContainer from './container/index'
import TaskBackground from './background/index'
import TaskContents from './content/index'
import TaskComponents from './component/index'
import TaskFlow from './flow/index'

/**
 * 解析canvas配置
 * contentMode 分为  0 或者 1
 * 1 是dom模式
 * 0 是canvas模式
 * 以后如果其余的在增加
 * 针对页面chapter中的parameter写入 contentMode   值为 1
 * 针对每一个content中的parameter写入 contentMode 值为 1
 * 如果是canvas模式的时候，同时也是能够存在dom模式是
 * @return {[type]} [description]
 */
const parseMode = function(pageData, base) {
    let parameter = pageData.parameter
    if (parameter) {
        try {
            parameter = JSON.parse(parameter)
            if (parameter && parameter.contentMode && parameter.contentMode == 1) {
                //非强制dom模式
                if (!Xut.config.onlyDomMode) {
                    //启动dom模式
                    base.canvasRelated.enable = true;
                }
            }
        } catch (e) {
            console.log('JSON错误,chpterId为', base.chapterId, parameter)
        }
    }
}

/**
 * 分配Container构建任务
 * 1 同步数据
 * 2 构建容器
 * 3 给出构建回调,这里不能中断,翻页必须存在节点
 * 4 等待之后自动创建或者后台空闲创建之后的任务
 * @return {[type]} [description]
 */
export default {

    /**
     * 主容器
     */
    'Container' (taskCallback, base) {
        //同步数据
        updataCache.call(base, [base.pid], () => {
            const pageData = base.baseData()
            //页面模式
            parseMode(pageData, base)
            TaskContainer(base, pageData, taskCallback)
        })
    },


    /**
     * 流式排版
     */
    'Flow' (taskCallback, base) {
        TaskFlow(base, taskCallback)
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
    'Background' (taskCallback, base) {

        if (base.checkInstanceTasks('background')) {
            return;
        }

        var data = base.baseData(base.pid),
            //构建中断回调
            suspendCallback = (innerNextTasks, innerSuspendTasks) => {
                base.nextTasks({
                    'taskName': '内部background',
                    'outSuspendTasks': innerSuspendTasks,
                    'outNextTasks': innerNextTasks
                });
            },
            //获取数据成功回调
            successCallback = () => {
                taskCallback();
            };

        base.createRelated.cacheTasks['background'] = new TaskBackground(base.getElement(), data, suspendCallback, successCallback)
    },


    /**
     * 分配Components构建任务
     * @return {[type]} [description]
     */
    'Components' (taskCallback, base) {

        if (base.checkInstanceTasks('components')) {
            return;
        }

        var chapterDas = base.chapterDas,
            baseData = base.baseData(),
            //构建中断回调
            suspendCallback = (innerNextTasks, innerSuspendTasks) => {
                base.nextTasks({
                    'taskName': '内部widgets',
                    'outSuspendTasks': innerSuspendTasks,
                    'outNextTasks': innerNextTasks
                });
            },
            //获取数据成功回调
            successCallback = () => {
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
    'Contents' (taskCallback, base) {

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


        base.createRelated.cacheTasks['contents'] = new TaskContents({
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
            'getStyle':base.getStyle
        });
    }
}

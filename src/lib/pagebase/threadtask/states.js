import { initTransform } from '../../swipe/translation'
import { getCounts } from '../../component/flow/layout'

const noop = function() {}

export default function initstate(instance) {

    let flowType = false
    if (instance.pageType === 'page' && getCounts(instance.scenarioId, instance.chapterId)) {
        flowType = true
    }


    return {
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
            _.each(["Flow", "background", "components", "contents"], function(taskName) {
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
        initTransformParameter: initTransform(instance.visiblePid, instance.pid, flowType),

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
}

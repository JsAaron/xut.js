import assignedTasks from './assign'
import { createTransform } from '../translation'

const noop = function() {}

export default function(instance) {

    /**
     * 创建相关的信息
     * @type {Object}
     */
    const createRelated = instance.createRelated = {

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
        initTransformParameter: createTransform(instance.visiblePid, instance.pid),

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
     * 设置下一个标记
     * 用于标记完成度
     */
    const setNextRunTask = (taskName) => {
        createRelated.nextRunTask = taskName;
    }


    const callContextTasks = (taskName, fn) => {
        return assignedTasks[taskName](fn, instance)
    }


    /**
     * 任务钩子
     * @type {Object}
     */
    instance.threadtasks = {

        /**
         * li容器
         * @return {[type]} [description]
         */
        container() {
            callContextTasks('Container', function(element, pseudoElement) {
                //////////////
                //li,li-div //
                //////////////
                instance.element = element;
                instance.pseudoElement = pseudoElement;

                //获取根节点
                instance.getElement = function() {
                    return pseudoElement ? pseudoElement : element
                }

                setNextRunTask('flow')

                //构建主容器li完毕,可以提前执行翻页动作
                createRelated.preforkComplete()

                //视觉差不管
                if (instance.isMaster) {
                    instance.nextTasks({
                        'taskName': '外部Background',
                        'outNextTasks': function() {
                            instance.dispatchTasks();
                        }
                    });
                }
            })
        },


        /**
         * 2016.9.7
         * 特殊的一个内容
         * 是否为流式排版
         * @return {[type]} [description]
         */
        flow() {
            //chapter=>note == 'flow'
            if (instance.chapterDas.note == 'flow') {
                callContextTasks('Flow', function() {
                    setNextRunTask('complete')
                    createRelated.createTasksComplete()
                })
            } else {
                setNextRunTask('background')
                instance.dispatchTasks()
            }
        },


        /**
         * 背景
         * @return {[type]} [description]
         */
        background() {
            callContextTasks('Background', function() {
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
            })
        },


        /**
         * 组件
         * @return {[type]} [description]
         */
        components() {
            //构件零件类型任务
            callContextTasks('Components', function() {
                setNextRunTask('contents')
                instance.nextTasks({
                    'taskName': '外部contents',
                    outNextTasks: function() {
                        instance.dispatchTasks();
                    }
                });
            })
        },


        /**
         * content
         * @return {[type]} [description]
         */
        contents() {
            callContextTasks('Contents', function() {
                setNextRunTask('complete')
                createRelated.createTasksComplete();
            })
        }
    }



}

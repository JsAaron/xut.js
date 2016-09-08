import assignedTasks from './assign'
import initstate from './states'

const noop = function() {}

export default function(instance) {

    /**
     * 创建相关的信息
     * @type {Object}
     */
    const createRelated = instance.createRelated = initstate(instance)

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

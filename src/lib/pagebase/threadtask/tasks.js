import { config } from '../../config/index'
import assignedTasks from './assign'
import initstate from './states'
import Pinch from './pinch'

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

            callContextTasks('Container', function($pageNode, $pseudoElement) {
                //////////////
                //li,li-div //
                //////////////
                instance.$pageNode = $pageNode
                instance.$pseudoElement = $pseudoElement

                /**
                 * 获取根节点
                 * 获取包含容器
                 * @return {[type]} [description]
                 */
                const $containsElement = $pageNode.children('.page-pinch')
                instance.getContainsNode = function() {
                    return $pseudoElement ? $pseudoElement : $containsElement
                }

                setNextRunTask('background')

                //构建主容器li完毕,可以提前执行翻页动作
                //必须是启动了快速翻页
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
         * 背景
         * @return {[type]} [description]
         */
        background() {
            callContextTasks('Background', function() {
                createRelated.preCreateTasks = false;
                setNextRunTask('flow')

                //针对当前页面的检测
                if (!createRelated.tasksHang || instance.isMaster) {
                    instance.nextTasks({
                        'taskName': '外部widgets',
                        outNextTasks: function() {
                            instance.dispatchTasks();
                        }
                    })
                }

                //如果有挂起任务，则继续执行
                if (createRelated.tasksHang) {
                    createRelated.tasksHang();
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

            //如果是页面类型
            let isPageType = instance.pageType === 'page'

            /**
             * 创建页面缩放缩放
             * flow页面不允许缩放
             * page页面可以配置缩放
             * @param  {[type]} flow [description]
             * @return {[type]}      [description]
             */
            let createPinch = function(flow) {
                //页面类型
                //如果启用了页面缩放
                //获取开启了全部缩放
                if (isPageType && (config.salePageType === 'page' || config.salePageType === 'all')) {
                    let $pagePinch = instance.getContainsNode()
                    instance._pinchObj = new Pinch(
                        $pagePinch,
                        instance.pageIndex
                    )
                }
            }

            //chapter=>note == 'flow'
            //因为设计chapter只有一个flow效果，所以直接跳过别的创建
            //只处理页面类型
            //母版跳过
            if (isPageType && instance.chapterData.note == 'flow') {
                callContextTasks('Flow', function() {
                    // createPinch('flow')
                    setNextRunTask('complete')
                    createRelated.createTasksComplete()
                })
            } else {
                createPinch()
                setNextRunTask('components')
                instance.dispatchTasks()
            }
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

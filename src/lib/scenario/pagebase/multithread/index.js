import { config } from '../../../config/index'
import assignedTasks from './assign-task/index'
import initTask from './init-task'
import PageScale from './page-scale'

const noop = function() {}

export default function schedulerTask(instance) {

  /**
   * 创建相关的信息
   * @type {Object}
   */
  const createRelated = instance.createRelated = initTask(instance)

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
        const $containsElement = $pageNode.find('.page-scale > div:first-child')
        instance.getContainsNode = function() {
            return $pseudoElement ? $pseudoElement : $containsElement
          }
          //页眉页脚
        instance.getHeadFootNode = function() {
            return $pageNode.find('.page-scale > div:last-child')
          }
          //缩放根节点
        instance.getScaleNode = function() {
          return $pseudoElement ? $pseudoElement : $pageNode.find('.page-scale')
        }


        setNextRunTask('background')

        //构建主容器li完毕,可以提前执行翻页动作
        //必须是启动了快速翻页
        createRelated.preforkComplete()

        //视觉差不管
        if(instance.isMaster) {
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
        setNextRunTask('column')

        //针对当前页面的检测
        if(!createRelated.tasksHang || instance.isMaster) {
          instance.nextTasks({
            'taskName': '外部widgets',
            outNextTasks: function() {
              instance.dispatchTasks();
            }
          })
        }

        //如果有挂起任务，则继续执行
        if(createRelated.tasksHang) {
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
    column() {

      //如果是页面类型
      const isPageType = instance.pageType === 'page'

      /*
      创建页面缩放缩放
      1.page页面可以配置缩放
      2.flow页面不允许缩放
       */
      const createScale = () => {
        const salePageType = config.salePageType
        if(isPageType && (salePageType === 'page' || salePageType === 'all')) {
          instance._pinchObj = new PageScale(instance.getScaleNode(), instance.pageIndex)
        }
      }

      /*
      chapter=>note == 'flow'
      设计上chapter只有一个flow效果，所以直接跳过别的创建
      只处理页面类型，母版跳过
       */
      if(isPageType && instance.chapterData.note == 'flow') {
        callContextTasks('Column', function() {
          setNextRunTask('complete')
          createRelated.createTasksComplete()
        })
      } else {
        createScale()
        setNextRunTask('components')
        instance.dispatchTasks()
      }
    },

    /**
     * 组件
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
     */
    contents() {
      callContextTasks('Contents', function() {
        //设置任务完成
        setNextRunTask('complete')
        createRelated.createTasksComplete();
      })
    }
  }


}

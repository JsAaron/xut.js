import { config } from '../../../config/index'
import assignedTasks from './assign-task/index'
import initThreadState from './thread-state'
import { ScalePan } from '../../../expand/scale-pan'


/**
 * 页面缩放
 */
function initPageScale(rootNode, pageIndex) {
  return new ScalePan({
    rootNode,
    hasButton: true,
    tapClose: true,
    updateHook(transform, speed) {
      if (transform) {
        /*如果有母版，缩放母版*/
        let relatedMasterObj = Xut.Presentation.GetPageBase('master', pageIndex)
        if (relatedMasterObj) {
          let pageMasterNode = relatedMasterObj.getContainsNode()[0]
          Xut.style.setTranslate({
            speed,
            translate: transform.translate,
            scale: transform.scale,
            node: pageMasterNode
          })
        }
      }
    }
  })
}


/**
 * 缓存构建中断回调
 * 构建分2步骤
 * 1 构建数据与结构（执行中断处理）
 * 2 构建绘制页面
 * @type {Object}
 */
function registerCacheTask(tasks) {
  /*设置缓存的任务名*/
  const cache = {};
  Object.keys(tasks).forEach(function(taskName) {
    cache[taskName] = false
  })
  return cache
}


export default function initThreadtasks(instance) {

  /**
   * 创建相关的信息
   * threadTaskRelated
   */
  const threadTaskRelated = instance.threadTaskRelated = initThreadState(instance)

  /*注册缓存任务名*/
  threadTaskRelated.assignTaskGroup = registerCacheTask(assignedTasks)
  //初始化第一次的任务名
  threadTaskRelated.nextTaskName = 'container'

  /**
   * 设置下一个任务名
   * 用于标记完成度
   */
  function setNextTaskName(taskName) {
    threadTaskRelated.nextTaskName = taskName;
  }

  /* 创建新任务*/
  function createAssignTask(taskName, fn) {
    return assignedTasks[taskName](fn, instance)
  }


  /**
   * 任务钩子
   */
  instance.threadtasks = {

    /**
     * li容器
     */
    container() {

      createAssignTask('assign-container', function($pageNode, $pseudoElement) {

        //////////////
        //li,li-div //
        //////////////
        instance.$pageNode = $pageNode
        instance.$pseudoElement = $pseudoElement

        /**
         * 获取根节点
         * 获取包含容器
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

        setNextTaskName('background')

        //构建主容器li完毕,可以提前执行翻页动作
        //必须是启动了快速翻页
        threadTaskRelated.preforkComplete()

        //模板上继续创建，不处理创建问题
        if (instance.isMaster) {
          instance.detectorTask({
            'taskName': '外部Background',
            'nextTask': function() {
              instance.dispatchTasks();
            }
          });
        }
      })
    },

    /**
     * 背景
     */
    background() {

      createAssignTask('assign-background', function() {
        threadTaskRelated.isPreCreateBackground = false;
        setNextTaskName('column')
        //针对当前页面的检测
        //没有背景挂起，或者是母版继续往下创建
        if (!threadTaskRelated.taskHangFn || instance.isMaster) {
          instance.detectorTask({
            'taskName': '外部widgets',
            nextTask: function() {
              instance.dispatchTasks();
            }
          })
        }
        //如果有挂起任务，则继续执行
        if (threadTaskRelated.taskHangFn) {
          threadTaskRelated.taskHangFn();
        }
      })
    },

    /**
     * 2016.9.7
     * 特殊的一个内容
     * 是否为流式排版
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
        const salePageType = config.launch.salePageType
        if (isPageType && (salePageType === 'page' || salePageType === 'all')) {
          instance._pageScaleObj = initPageScale(instance.getScaleNode(), instance.pageIndex)
        }
      }

      /*
      chapter=>note == 'flow'
      设计上chapter只有一个flow效果，所以直接跳过别的创建
      只处理页面类型，母版跳过
       */
      if (isPageType && instance.hasColumnData) {
        createAssignTask('assign-column', function() {
          setNextTaskName('complete')
          threadTaskRelated.createTasksComplete()
        })
      } else {
        createScale()
        setNextTaskName('component')
        instance.dispatchTasks()
      }
    },

    /**
     * 组件
     * 构件零件类型任务
     */
    component() {
      createAssignTask('assign-component', function() {
        setNextTaskName('activity')
        instance.detectorTask({
          'taskName': '外部contents',
          nextTask: function() {
            instance.dispatchTasks();
          }
        });
      })
    },

    /**
     * activity类型
     */
    activity() {
      createAssignTask('assgin-activity', function() {
        setNextTaskName('complete')
        threadTaskRelated.createTasksComplete();
      })
    }
  }


}

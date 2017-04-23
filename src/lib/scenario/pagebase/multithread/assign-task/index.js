 import { config } from '../../../../config/index'
 import activeCache from './active-cache'
 import TaskContainer from './container/index'
 import TaskBackground from './background/index'
 import TaskActivitys from './activity/index'
 import TaskComponents from './component/index'
 import TaskColumns from './column/index'

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
       if (parameter) {
         if (parameter.contentMode && parameter.contentMode == 1) {
           //非强制dom模式
           if (!config.debug.onlyDomMode) {
             //启动dom模式
             base.canvasRelated.enable = true;
           }
         }
         //如果是最后一页处理
         if (parameter.lastPage && base.pageType === 'page') {
           //运行应用运行时间
           base.runLastPageAction = function() {
             const runTime = Number(config.data.delayTime)
             let timeout
             if (runTime) {
               timeout = setTimeout(() => {
                   Xut.Application.Notify('complete')
                 }, runTime * 1000) //转成秒
             }
             return function() { //返回停止方法
               if (timeout) {
                 clearTimeout(timeout)
                 timeout = null
               }
             }
           }

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
   'assign-container' (success, base) {
     //同步数据
     activeCache(base, function() {
       const pageData = base.baseData()
         //contentMode模式
       parseMode(pageData, base)
       TaskContainer(base, pageData, success)
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
   'assign-background' (success, base) {
     if (base.rerunInstanceTask('assign-background')) {
       return;
     }
     const data = base.baseData(base.chapterIndex)
     const $containsNode = base.getContainsNode()
     base.threadTaskRelated.assignTaskGroup['assign-background'] = new TaskBackground(
       data,
       $containsNode,
       success,
       function(...arg) {
         base.detectorTask(...arg)
       }
     )
   },


   /**
    * 流式排版
    */
   'assign-column' (success, base) {
     TaskColumns(base, success)
   },


   /**
    * 分配Components构建任务
    * @return {[type]} [description]
    */
   'assign-component' (success, base) {
     if (base.rerunInstanceTask('assign-component')) {
       return;
     }
     const chapterData = base.chapterData
     const baseData = base.baseData()
     base.threadTaskRelated.assignTaskGroup['assign-component'] = new TaskComponents({
       '$containsNode': base.getContainsNode(),
       'nodes': chapterData['nodes'],
       'pageOffset': chapterData['pageOffset'],
       'activitys': base.baseActivits(),
       'chpaterData': baseData,
       'chapterId': baseData['_id'],
       'chapterIndex': base.chapterIndex,
       'pageType': base.pageType,
       'getStyle': base.getStyle
     }, success, function(...arg) {
       base.detectorTask(...arg)
     });
   },


   /**
    * 分配Activity构建任务
    * @return {[type]} [description]
    */
   'assgin-activity' (success, base) {

     //通过content数据库为空处理
     if (Xut.data.preventContent) {
       return success();
     }

     if (base.rerunInstanceTask('assgin-activity')) {
       return;
     }

     const chapterData = base.chapterData
     const baseData = base.baseData()

     base.threadTaskRelated.assignTaskGroup['assgin-activity'] = new TaskActivitys({
       base,
       'canvasRelated': base.canvasRelated,
       'rootNode': base.rootNode,
       '$containsNode': base.getContainsNode(),
       '$headFootNode': base.getHeadFootNode(),
       'pageType': base.pageType,
       'nodes': chapterData['nodes'],
       'pageOffset': chapterData['pageOffset'],
       'activitys': base.baseActivits(),
       'chpaterData': baseData,
       'chapterId': baseData._id,
       'pageIndex': base.pageIndex,
       'chapterIndex': base.chapterIndex,
       'pageBaseHooks': base.collectHooks,
       'getStyle': base.getStyle
     }, success, function(...arg) {
       base.detectorTask(...arg)
     })
   }
 }

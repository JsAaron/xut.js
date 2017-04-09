/**
 * 页面模块
 * @param  {[type]}
 * @return {[type]}
 */
import { ManageSuper } from './super'
import { Pagebase } from '../pagebase/index'
import { removeVideo } from '../../component/video/manager'
import { execScript, $$on, $$off } from '../../util/index'
import { config } from '../../config/index'
import { addEdges } from '../../util/edge'
import {
  $$suspend,
  $$original,
  $$autoRun
} from '../command/index'

import { getRealPage } from '../dispatch/depend'


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
const runScript = (pageObject, type) => {
  const code = pageObject.chapterData[type]
  if (code) {
    execScript(code, type)
  }
}


export default class PageMgr extends ManageSuper {

  constructor(rootNode) {
    super()
    this.rootNode = rootNode
    this.pageType = 'page';

    /*
    双页模式，给父节点绑定一个翻页监听事件
    如果翻页完成，手动触发翻页事件
    */
    if (config.doublePageMode) {
      $$on(rootNode, {
        transitionend: function() {
          Xut.Application.tiggerFilpComplete()
        }
      })
    }
  }

  /*设置页面的初始化的translate值*/
  setInitTranslate(pageIndex) {
    if (config.doublePageMode) {
      this.rootNode.style[Xut.style.transform] = `translate3d(-${config.screenSize.width*pageIndex}px,0px,0px)`
    }
  }

  /**
   * 创建页新的页面
   * @param  {[type]} dataOpts  [description]
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */
  create(dataOpts, pageIndex) {
    //生成指定页面对象
    const pageObjs = new Pagebase(
      _.extend(dataOpts, {
        'pageType': this.pageType, //创建页面的类型
        'rootNode': this.rootNode //根元素
      })
    )

    //增加页面管理
    this.$$addGroup(pageIndex, pageObjs);
    return pageObjs;
  }

  /*
  滑动页面容器
   */
  _moveContainer(distance, speed) {
    this.rootNode.style[Xut.style.transform] = `translate3d(${distance}px,0px,0px)`
    this.rootNode.style[Xut.style.transitionDuration] = speed + 'ms'
  }

  /**
   * 移动页面
   * @return {[type]}
   */
  move({
    speed,
    action,
    moveDistance,
    leftIndex,
    currIndex,
    rightIndex,
    direction
  }) {
    /*双页模式，移动父容器*/
    if (config.doublePageMode) {
      this._moveContainer(moveDistance[1], speed)
    } else {
      /*单页模式，移动每个独立的页面*/
      _.each([
        this.$$getPageObj(leftIndex),
        this.$$getPageObj(currIndex),
        this.$$getPageObj(rightIndex)
      ], function(pageObj, index) {
        if (pageObj) {
          pageObj.movePage(action, moveDistance[index], speed, moveDistance[3], direction)
        }
      })
    }
  }


  /**
   * 触屏翻页开始
   * 1 中断所有任务
   * 2 停止热点对象运行
   *     停止动画,视频音频等等
   */
  suspend(leftIndex, currIndex, rightIndex, stopPointer) {

    const suspendPageObj = this.$$getPageObj(stopPointer)
    const prveChpterId = suspendPageObj.baseGetPageId(stopPointer)

    /*如果有代码跟踪*/
    if (suspendPageObj.startupTime) {
      config.hasTrackCode('page', function(notify) {
        notify({
          pageId: suspendPageObj.chapterId,
          time: (+new Date) - suspendPageObj.startupTime
        })
      })
    }

    //翻页结束脚本
    runScript(suspendPageObj, 'postCode');
    //中断节点创建任务
    this._suspendInnerCreateTasks(leftIndex, currIndex, rightIndex);
    //停止活动对象活动
    suspendPageObj.destroyPageAction()
    suspendPageObj.resetSwipeSequence()
    $$suspend(suspendPageObj, prveChpterId);
  }


  /**
   * 复位初始状态
   * 转化：双页
   * @return {[type]} [description]
   */
  resetOriginal(pageIndex) {
    const originalIds = getRealPage(pageIndex, 'resetOriginal')
    originalIds.forEach(originaIndex => {
      let originalPageObj = this.$$getPageObj(originaIndex)
      if (originalPageObj) {
        let floatNode = originalPageObj.floatContentGroup.pageContainer
        if (floatNode) {
          //floatPages设置的content溢出后处理
          //在非视区增加overflow:hidden
          //可视区域overflow:''
          floatNode.css({ 'zIndex': 2000, 'overflow': 'hidden' })
        }
        $$original(originalPageObj)
      }
    })
  }

  /**
   * 触屏翻页完成
   * 转化：双页
   * 1 停止热点动作
   * 2 触发新的页面动作
   * @param  {[type]} prevPageIndex [上一页面]
   * @param  {[type]} currPageIndex [当前页码]
   * @param  {[type]} nextPageIndex [下一页页码]
   * @param  {[type]} suspendIndex  [停止动作的页码]因为要区分滑动的方向
   * @param  {[type]} createPointer [正在创建的页面]
   * @param  {[type]} direction     [滑动方向]
   */
  autoRun(data) {
    // console.log(data)
    const self = this

    /*转化多页面合集，可能存在多个页面处理*/
    // const createPageset = getRealPage(data.currIndex, 'autoRun')
    // const activateLenght = createPageset.length

    /**
     * 预执行背景创建
     * 支持多线程快速翻页
     * 1 初始化,或者快速翻页补全前后页面
     * 2 正常翻页创建前后
     */
    const preCreateTask = function(taskName) {
      let resumePointer

      /*init*/
      if (data.isQuickTurn || !data.direction) {
        resumePointer = [data.prevIndex, data.nextIndex];
      } else {
        /*flip*/
        resumePointer = data.createPointer || data.nextIndex || data.prevIndex
      }

      self._checkPreforkTasks(resumePointer, taskName);
    }


    /*激活自动运行对象*/
    const activateAutoRun = function(pageObj, data) {

      //结束通知
      const _complete = function() {
        data.processComplete()
        preCreateTask()
      }

      //运行动作
      const _startRun = function() {
        $$autoRun(pageObj, data.currIndex, _complete);
      }

      //如果页面容器存在,才处理自动运行
      const currpageNode = pageObj.getContainsNode()
      if (!currpageNode) {
        return _complete()
      }

      //运行如果被中断,则等待
      if (data.suspendCallback) {
        data.suspendCallback(_startRun)
      } else {
        _startRun();
      }
    }

    /*检测页面是否已经完全创建完毕，并且返回页面对象*/
    this._checkTaskCompleted(data.currIndex, function(activatePageObj) {

      /*跟踪，每个页面的停留时间，开始*/
      if (config.hasTrackCode('page')) {
        activatePageObj.startupTime = +new Date
      }

      /*watch('complete')方法调用*/
      activatePageObj.createPageAction()

      /*提升当前页面浮动对象的层级,因为浮动对象可以是并联的*/
      const floatNode = activatePageObj.floatContentGroup.pageContainer
      if (floatNode) { floatNode.css({ 'zIndex': 2001, 'overflow': '' }) }

      /*IE上不支持蒙版效果的处理*/
      if (Xut.style.noMaskBoxImage) { addEdges() }

      /*构建完成通知*/
      data.buildComplete(activatePageObj.scenarioId);

      /*执行自动动作之前的脚本*/
      runScript(activatePageObj, 'preCode');

      /*热点状态复位,多页也只运行一次*/
      self.resetOriginal(data.suspendIndex);

      /*预构建背景*/
      preCreateTask('background')

      //等待动画结束后构建
      activateAutoRun(activatePageObj, data);
    })



  }


  /**
   * 销毁整个页面管理对象
   * @param  {[type]} clearPageIndex [description]
   * @return {[type]}                [description]
   */
  clearPage(clearPageIndex) {
    const pageObj = this.$$getPageObj(clearPageIndex)
    if (pageObj) {
      //移除事件
      pageObj.baseDestroy();
      //移除列表
      this.$$removeGroup(clearPageIndex);
    }
  }


  /**
   * 销毁整个页面管理对象
   * @return {[type]} [description]
   */
  destroy() {
    //清理视频
    var pageId = Xut.Presentation.GetPageId(Xut.Presentation.GetPageIndex())

    removeVideo(pageId)

    //清理对象
    this.$$destroyGroup();

    //销毁事件
    if (config.doublePageMode) {
      $$off(this.rootNode)
    }

    //清理节点
    this.rootNode = null;
  }


  /**
   * 设置中断正在创建的页面对象任务
   * @param {[type]}   currIndex [description]
   * @param {Function} callback  [description]
   */
  _suspendInnerCreateTasks(leftIndex, currIndex, rightIndex) {
    let self = this;

    /*设置中断任务
    1.如果没有参数返回
    2.保证数组格式遍历*/
    const suspendTask = function(pageIndex) {
      if (pageIndex !== undefined) {
        if (!pageIndex.length) {
          pageIndex = [pageIndex]
        }
        let pageObj;
        pageIndex.forEach(function(pointer) {
          if (pageObj = self.$$getPageObj(pointer)) {
            pageObj.setTaskSuspend();
          }
        })
      }
    }

    suspendTask(leftIndex)
    suspendTask(currIndex)
    suspendTask(rightIndex)
  }

  /*检测活动窗口任务*/
  _checkTaskCompleted(currIndex, callback) {
    const currPageObj = this.$$getPageObj(currIndex)
    if (currPageObj) {
      currPageObj.checkThreadTaskComplete(function() {
        // console.log('11111111111当前页面创建完毕',currIndex+1)
        callback(currPageObj)
      })
    }
  }

  /**
   * 检测后台预创建任务
   * @return {[type]} [description]
   */
  _checkPreforkTasks(resumePointer, preCreateTask) {
    var resumeObj, resumeCount;
    if (!resumePointer.length) {
      resumePointer = [resumePointer];
    }
    resumeCount = resumePointer.length;
    while (resumeCount--) {
      if (resumeObj = this.$$getPageObj(resumePointer[resumeCount])) {
        resumeObj.createPreforkTask(function() {
          // console.log('后台处理完毕')
        }, preCreateTask)
      }
    }
  }

}

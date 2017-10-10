import { fix } from '../pagebase/move/translation'

/**
 * 跳转之前提高层级问题
 * 提高当前页面的层级，方便别的页面切换不产生视觉影响
 */
function raiseHierarchy(complier, visualIndex) {
  complier.pageMgr.assistPocess(visualIndex, pageObj => {
    pageObj.setPageContainerHierarchy({ 'z-index': 9997 })
  })
  complier.getMasterContext(() => {
    complier.masterMgr.assistPocess(visualIndex, pageObj => {
      pageObj.setPageContainerHierarchy({ 'z-index': 1 })
    })
  })
}


/**
 * 创建新的页面
 */
function createNewPage(complier, data, createCallback) {

  //缓存当前页面索引用于销毁
  let pageIndex
  let i = 0
  let collectContainers = []
  let create = data.create
  let targetIndex = data.targetIndex

  //需要创建的页面闭包器
  for (; i < create.length; i++) {
    pageIndex = create[i];
    collectContainers.push(function(targetIndex, pageIndex) {
      return function(callback) {
        //创建新结构
        this.createPageBase([pageIndex], targetIndex, 'toPage', callback, {
          'opacity': 0 //同页面切换,规定切换的样式
        })
      }
    }(targetIndex, pageIndex))
  }


  /**
   * 二维数组保存，创建返回的对象
   * 1 page对象
   * 2 母版对象
   * @type {Array}
   */
  data.pageBaseCollect = [];

  let count, collectLength
  let j = 0

  count = collectLength = collectContainers.length;

  if (collectContainers && collectLength) {
    for (; j < collectLength; j++) {
      //收集创建的根节点,异步等待容器的创建
      collectContainers[j].call(complier, callbackPageBase => {
        if (count === 1) {
          collectContainers = null;
          setTimeout(() => { createCallback(data) }, 100)
        }
        //接受创建后返回的页面对象
        data.pageBaseCollect.push(callbackPageBase);
        count--;
      });
    }
  }
}

/**
 * 节点创建完毕后，切换页面动，执行动作
 */
function creationLogic(complier, data) {

  const visualIndex = data.visualIndex
  const pageMgr = complier.pageMgr
  const targetIndex = data.targetIndex

  //停止当前页面动作
  complier.suspendPageBases({ 'stopIndex': visualIndex, 'action': 'toPage' })

  //========处理跳转中逻辑=========

  /**
   * 清除掉不需要的页面
   * 排除掉当前提高层次页面
   */
  _.each(data.destroy, function(destroyIndex) {
    if (destroyIndex !== visualIndex) {
      pageMgr.clearPage(destroyIndex)
    }
  })

  /*修正翻页2页的页面坐标值*/
  _.each(data.ruleOut, function(pageIndex) {
    if (pageIndex > targetIndex) {
      pageMgr.assistAppoint(pageIndex, function(pageObj) {
        fix(pageObj.$pageNode, 'nextEffect')
      })
    }
    if (pageIndex < targetIndex) {
      pageMgr.assistAppoint(pageIndex, function(pageObj) {
        fix(pageObj.$pageNode, 'prevEffect')
      })
    }
  })


  let jumpPocesss

  //母版
  complier.getMasterContext(function() {
    jumpPocesss = this.makeJumpPocesss(targetIndex)
    jumpPocesss.pre();
  })

  //===========跳槽后逻辑========================
  pageMgr.clearPage(visualIndex)

  jumpPocesss && jumpPocesss.clean(visualIndex, targetIndex)

  /**
   * 同页面切换,规定切换的样式复位
   */
  _.each(data.pageBaseCollect, function(pageBase) {
    _.each(pageBase, function(pageObj) {
      pageObj && pageObj.setPageContainerHierarchy({
        'opacity': 1
      })
    })
  })

  data.pageBaseCollect = null
  jumpPocesss = null
}



/**
 * 跳转页面逻辑处理
 * @param  {[type]} complier [description]
 * @param  {[type]} data     [description]
 * @param  {[type]} success  [description]
 * @return {[type]}          [description]
 */
export default function goToPage(complier, data, success) {
  //跳前逻辑
  raiseHierarchy(complier, data.visualIndex);
  /*创建新页面*/
  createNewPage(complier, data, function(data) {
    /*执行切换动作*/
    creationLogic(complier, data);
    success.call(complier, data)
  })
}

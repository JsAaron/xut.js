import { nextTick } from '../../../../../util/nexttick'
import { arrayUnique } from '../../../../../util/index'

/**
 *创建浮动相关的信息
 * @return {[type]} [description]
 */
function crateFloat(callback, floatName, dasFloat, pipeData, base) {

  var $containsNodes = [];
  var prefix = 'Content_' + pipeData.pid + "_";

  //去重复
  dasFloat.ids = arrayUnique(dasFloat.ids)

  var makePrefix, fragment, zIndex, zIndexs = dasFloat.zIndex;

  pipeData.taskCount++;

  //分离出浮动节点
  _.each(dasFloat.ids, function(id) {
    makePrefix = prefix + id;
    if(fragment = pipeData.contentsFragment[makePrefix]) {
      zIndex = zIndexs[id];
      //保证层级关系
      // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
      $containsNodes.push(fragment);
      delete pipeData.contentsFragment[makePrefix]
    }
  })

  //floatPages模式下面
  //如果是当前页面
  //因为会产生三页面并联
  //所以中间去最高层级
  if(floatName === 'floatPages' && pipeData.getStyle.offset === 0) {
    zIndex = 2001
  } else {
    zIndex = 2000
  }

  //浮动根节点
  //floatPages设置的content溢出后处理
  //在非视区增加overflow:hidden
  //可视区域overflow:''
  var overflow = 'overflow:hidden;'

  //如果是母板,排除
  if(floatName === 'floatMaters') {
    overflow = ''
  }

  let getStyle = base.getStyle
  let flowHtml =
    `<div id="${floatName}-li-${pipeData.pid}"
           class="xut-float"
           style="left:${getStyle.visualLeft}px;
                  top:${getStyle.visualTop}px;
                  ${Xut.style.transform}:${pipeData.getStyle.translate};z-index:${zIndex};${overflow}">
    </div>`
  const container = $(String.styleFormat(flowHtml))
  $(pipeData.rootNode).after(container)
  callback($containsNodes, container)
}

/**
 * 创建浮动母版对象
 * @return {[type]} [description]
 */
export function createFloatMater(base, pipeData, complete) {
  crateFloat(function($containsNodes, container) {
    //浮动容器
    pipeData.floatMaters.container = container;
    nextTick({
      'container': container,
      'content': $containsNodes
    }, function() {
      //收集浮动母版对象标识
      base.pageBaseHooks.floatMaters(pipeData.floatMaters);
      complete(pipeData);
    });
  }, 'floatMaters', pipeData.floatMaters, pipeData, base)
}

/**
 * 创建浮动的页面对象
 */
export function createFloatPage(base, pipeData, complete) {
  crateFloat(function($containsNodes, container) {
    pipeData.floatPages.container = container;
    nextTick({
      'container': container,
      'content': $containsNodes
    }, function() {
      //收集浮动母版对象标识
      base.pageBaseHooks.floatPages(pipeData.floatPages);
      complete(pipeData);
    });
  }, 'floatPages', pipeData.floatPages, pipeData, base)
}

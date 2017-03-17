import { nextTick } from '../../../../util/nexttick'
import { arrayUnique } from '../../../../util/index'

const TRANSFORM = Xut.style.transform


/**
 *创建浮动相关的信息
 * @return {[type]} [description]
 */
function crateFloat(callback, floatName, dasFloat, data, base) {

  var $containsNodes = [];
  var prefix = 'Content_' + data.pid + "_";

  //去重复
  dasFloat.ids = arrayUnique(dasFloat.ids)

  var makePrefix, fragment, zIndex, zIndexs = dasFloat.zIndex;

  data.count++;

  //分离出浮动节点
  _.each(dasFloat.ids, function(id) {
    makePrefix = prefix + id;
    if(fragment = data.contentsFragment[makePrefix]) {
      zIndex = zIndexs[id];
      //保证层级关系
      // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
      $containsNodes.push(fragment);
      delete data.contentsFragment[makePrefix]
    }
  })

  //floatPages模式下面
  //如果是当前页面
  //因为会产生三页面并联
  //所以中间去最高层级
  if(floatName === 'floatPages' && data.getStyle.offset === 0) {
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
    `<div id="${floatName}-li-${data.pid}"
           class="xut-float"
           style="left:${getStyle.visualLeft}px;
                  top:${getStyle.visualTop}px;
                  ${TRANSFORM}:${data.getStyle.translate};z-index:${zIndex};${overflow}">
    </div>`

  const container = $(String.styleFormat(flowHtml))
  $(data.rootNode).after(container)
  callback($containsNodes, container)
}

/**
 * 创建浮动母版对象
 * @return {[type]} [description]
 */
export function createFloatMater(base, data, complete) {
  crateFloat(function($containsNodes, container) {
    //浮动容器
    data.floatMaters.container = container;
    nextTick({
      'container': container,
      'content': $containsNodes
    }, function() {
      //收集浮动母版对象标识
      base.pageBaseHooks.floatMaters(data.floatMaters);
      complete(data);
    });
  }, 'floatMaters', data.floatMaters, data, base)
}

/**
 * 创建浮动的页面对象
 */
export function createFloatPage(base, data, complete) {
  crateFloat(function($containsNodes, container) {
    data.floatPages.container = container;
    nextTick({
      'container': container,
      'content': $containsNodes
    }, function() {
      //收集浮动母版对象标识
      base.pageBaseHooks.floatPages(data.floatPages);
      complete(data);
    });
  }, 'floatPages', data.floatPages, data, base)
}

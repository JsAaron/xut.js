import { arrayUnique } from '../../../../../util/lang'
import { nextTick } from '../../../../../util/nexttick'

/**
 *创建浮动相关的信息
 * @return {[type]} [description]
 */
function crateFloat(floatName, dasFloat, pipeData, baseGetStyle, complete) {

  var content = [];
  var prefix = 'Content_' + pipeData.chapterIndex + "_";

  //去重复
  dasFloat.ids = arrayUnique(dasFloat.ids)

  var makePrefix, fragment, zIndex, zIndexs = dasFloat.zIndex;

  pipeData.taskCount++;

  //分离出浮动节点
  _.each(dasFloat.ids, function(id) {
    makePrefix = prefix + id;
    if (fragment = pipeData.contentsFragment[makePrefix]) {
      zIndex = zIndexs[id];
      //保证层级关系
      // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
      content.push(fragment);
      delete pipeData.contentsFragment[makePrefix]
    }
  })

  //floatPage模式下面
  //如果是当前页面
  //因为会产生三页面并联
  //所以中间去最高层级
  if (floatName === 'floatPage' && pipeData.getStyle.offset === 0) {
    zIndex = 2001
  } else {
    zIndex = 2000
  }

  //浮动根节点
  //floatPage设置的content溢出后处理
  //在非视区增加overflow:hidden
  //可视区域overflow:''
  var overflow = 'overflow:hidden;'

  //如果是母板,排除
  if (floatName === 'floatMaster') {
    overflow = ''
  }

  let flowHtml =
    `<ul id="${floatName}-li-${pipeData.chapterIndex}"
         class="xut-float"
         style="left:${baseGetStyle.visualLeft}px;
                top:${baseGetStyle.visualTop}px;
                ${Xut.style.transform}:${pipeData.getStyle.translate};
                z-index:${zIndex};${overflow}">
    </ul>`
  const container = $(String.styleFormat(flowHtml))
  $(pipeData.rootNode).after(container)

  /*绘制节点到页面*/
  nextTick({ container, content }, () => {
    complete(container)
  });
}



/**
 * 创建浮动的页面对象
 */
export function createFloatPage(pipeData, pageDivertor, baseGetStyle, complete) {
  crateFloat('floatPage',
    pageDivertor,
    pipeData,
    baseGetStyle,
    complete
  )
}

/**
 * 创建浮动母版对象
 */
export function createFloatMaster(pipeData, masterDivertor, baseGetStyle, complete) {
  crateFloat('floatMaster',
    masterDivertor,
    pipeData,
    baseGetStyle,
    complete
  )
}

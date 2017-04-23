import { arrayUnique } from '../../../../../util/lang'
import { nextTick } from '../../../../../util/nexttick'

/**
 *创建浮动相关的信息
 *1 activity
 *2 component
 */
export function crateFloat(floatName, pipeData, divertor, complete) {

  /*增加回调次数计算*/
  pipeData.taskCount++;

  let content = [];
  let getStyle = pipeData.getStyle

  /*activity类型处理*/
  let makePrefix, fragment, zIndex
  if (divertor.ids.length) {
    const zIndexs = divertor.zIndex;
    const prefix = 'Content_' + pipeData.chapterIndex + "_";
    //去重复
    divertor.ids = arrayUnique(divertor.ids)
    _.each(divertor.ids, function(id) {
      makePrefix = prefix + id;
      fragment = pipeData.contentsFragment[makePrefix]
      if (fragment) {
        zIndex = zIndexs[id];
        //保证层级关系
        // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
        content.push(fragment);
        delete pipeData.contentsFragment[makePrefix]
      }
    })
  }

  /*component类型处理*/
  if (divertor.html.length) {
    content = $(divertor.html.join(""))
  }


  //floatPage模式下面
  //如果是当前页面
  //因为会产生三页面并联
  //所以中间去最高层级
  if (floatName === 'floatPage' && getStyle.offset === 0) {
    zIndex = 2001
  } else {
    zIndex = 2000
  }

  //浮动根节点
  //floatPage设置的content溢出后处理
  //在非视区增加overflow:hidden
  //可视区域overflow:''
  let overflow = 'overflow:hidden;'

  //如果是母板,排除
  if (floatName === 'floatMaster') {
    overflow = ''
  }

  /*浮动容器*/
  let id = `${floatName}-li-${pipeData.chapterIndex}`
  let container = $("#" + id)

  /*有可能在competent中已经创建,在content不需要重复创建*/
  if (!container.length) {
    container = $(String.styleFormat(
      `<ul id="${id}"
         class="xut-float"
         style="left:${getStyle.visualLeft}px;
                top:${getStyle.visualTop}px;
                ${Xut.style.transform}:${getStyle.translate};
                z-index:${zIndex};${overflow}">
       </ul>`
    ))
    $(pipeData.rootNode).after(container)
  }

  /*绘制节点到页面*/
  nextTick({ container, content }, () => {
    complete(container)
  });
}

///////////////////////////
///    文本特效
//////////////////////////

import { LetterEffect } from '../../../../../component/activity/content/letter-effect'

export function textFx(pipeData, textFx) {

  let uuid = 1
  let content
  let contentNode
  let parentNodes = [] //收集父节点做比对
  let group = {}
  let textfxNodes
  let parentNode

  //文本特效对象
  let textFxObjs = {}

  while(content = textFx.shift()) {
    if(contentNode = pipeData.contentsFragment[content.texteffectId]) {
      let contentId = content._id

      //初始化文本对象
      textFxObjs[contentId] = new LetterEffect(contentId)
      textfxNodes = contentNode.querySelectorAll('a[data-textfx]')

      if(textfxNodes.length) {
        textfxNodes.forEach(function(node) {
          //如果是共享了父节点
          parentNode = node.parentNode
          if(-1 != parentNodes.indexOf(parentNode)) {
            group[parentNode.textFxId].push(node)
          } else {
            parentNode.textFxId = uuid
            group[uuid] = []
            group[uuid++].push(node)
          }
          parentNodes.push(parentNode)
          textFxObjs[contentId].addQueue(node, node.getAttribute('data-textfx'))
        })
      }
    }
  }

  return textFxObjs
}

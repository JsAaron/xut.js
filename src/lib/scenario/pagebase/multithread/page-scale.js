import { ScalePan } from '../../../plugin/extend/scale-pan'

/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default function PageScale(rootNode, pageIndex) {
  let relatedMasterObj = Xut.Presentation.GetPageObj('master', pageIndex)
  let pageMasterNode
  if(relatedMasterObj) {
    pageMasterNode = relatedMasterObj.getContainsNode()[0]
  }
  return new ScalePan({
    rootNode,
    hasButton: false,
    tapClose: true,
    update(styleText, speed) {
      if(pageMasterNode) {
        pageMasterNode.style[Xut.style.transform] = styleText
        pageMasterNode.style[Xut.style.transitionDuration] = speed + 'ms'
      }
    }
  })
}

import PanPinch from '../../plugin/extend/pan.pinch'

const transform = Xut.style.transform
const transitionDuration = Xut.style.transitionDuration

/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default function Pinch($pagePinch, pageIndex) {

    let relatedMasterObj = Xut.Presentation.GetPageObj('master', pageIndex)
    let pageMasterNode
    if (relatedMasterObj) {
        pageMasterNode = relatedMasterObj.getContainsNode()[0]
    }

    return new PanPinch({
        $pagePinch,
        update(styleText, speed) {
            if (pageMasterNode) {
                pageMasterNode.style[transform] = styleText
                pageMasterNode.style[transitionDuration] = speed + 'ms'
            }
        }
    })
}

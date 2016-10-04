import Slide from '../../plugin/internal/slide'

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

    return new Slide({
        $pagePinch,
        pageIndex,
        update() {
            
        }
    })

}

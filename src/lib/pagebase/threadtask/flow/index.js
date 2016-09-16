import Flow from '../../../component/flow/index'
import { getCounts } from '../../../component/flow/layout'
/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, successCallback) {
    const chapterDas = base.chapterDas
    if (getCounts(chapterDas.seasonId, base.chapterId)) {
        // base._flows.register(new Flow(base, successCallback))
    } else {
        successCallback()
    }
}

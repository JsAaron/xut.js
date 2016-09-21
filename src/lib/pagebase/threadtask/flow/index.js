import Flow from '../../../component/flow/index'
import { getCounts } from '../../../component/flow/layout'
/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, successCallback) {
    const chapterDas = base.chapterDas

    //只有页面类型支持flow && chpater页存在flow数据
    if (base.pageType === "page" && getCounts(chapterDas.seasonId, base.chapterId)) {
        base._flows.register(new Flow(base, successCallback))
    } else {
        successCallback()
    }
}

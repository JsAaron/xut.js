import Flow from '../../../component/flow/flow'
import { isFlowPage } from '../../../component/flow/get'
/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, successCallback) {
    const chapterData = base.chapterData
    //只有页面类型支持flow && chpater页存在flow数据
    if (base.pageType === "page" && isFlowPage(chapterData.seasonId, base.chapterId)) {
        base._flows.register(
            new Flow({
                pageIndex: base.pageIndex,
                $pinchNode: base.getContainsNode(),
                seasonId: base.chapterData.seasonId,
                chapterId: base.chapterId,
                successCallback
            })
        )
    } else {
        successCallback()
    }
}

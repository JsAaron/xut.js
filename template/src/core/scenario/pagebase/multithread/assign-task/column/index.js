import ColumnClass from '../../../../../component/column/core'
import { isColumnPage } from '../../../../../component/column/api'
/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, callback) {
  const chapterData = base.chapterData
    //只有页面类型支持flow && chpater页存在flow数据
  if(base.pageType === "page" && isColumnPage(chapterData.seasonId, base.chapterId)) {
    base.columnGroup.add(
      new ColumnClass({
        pptMaster: base.chapterData.pptMaster, //母版ID
        pageIndex: base.pageIndex,
        rootNode: base.getContainsNode(),
        seasonId: base.chapterData.seasonId,
        chapterId: base.chapterId,
        callback
      })
    )
  } else {
    callback()
  }
}

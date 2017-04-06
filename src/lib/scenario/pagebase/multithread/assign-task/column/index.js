import ColumnClass from '../../../../../component/column/class'
import { isColumnPage } from '../../../../../component/column/depend'
/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, successCallback) {
  const chapterData = base.chapterData
  //只有页面类型支持flow && chpater页存在flow数据
  if(base.pageType === "page" && isColumnPage(chapterData.seasonId, base.chapterId)) {
    base._columns.register(
      new ColumnClass({
        pptMaster: base.chapterData.pptMaster, //母版ID
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

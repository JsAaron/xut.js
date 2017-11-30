//书签
import { BookMark } from './bookmark'

/**
 * 创建书签
 * @return {[type]} [description]
 */
export default function(activitProto) {

  activitProto.createBookMark = function() {
    var node, seasonId, pageId, pageData;
    if(this.pageType === 'master') {
      //模板取对应的页面上的数据
      pageData = Xut.Presentation.GetPageData();
      node = this.dataRelated.floatMasterDivertor.container;
      pageId = pageData._id;
      seasonId = pageData.seasonId;
    } else {
      node = this.$containsNode;
      seasonId = this.dataRelated.seasonId
      pageId = this.pageId
    }
    var options = {
      parent: node,
      seasonId: seasonId,
      pageId: pageId
    }

    if(this.bookMark) {
      //如果上次只是隐藏则可以恢复
      this.bookMark.restore();
    } else {
      this.bookMark = new BookMark(options);
    }
  }
}

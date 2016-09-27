//书签
import { BookMark } from './bookmark'

/**
* 创建书签
* @return {[type]} [description]
*/
export default function (activitProto) {

    activitProto.createBookMark = function () {
        var element, seasonId, pageId, pageData;
        if (this.pageType === 'master') {
            //模板取对应的页面上的数据
            pageData = Xut.Presentation.GetPageData();
            element = this.relatedData.floatMaters.container;
            pageId = pageData._id;
            seasonId = pageData.seasonId;
        } else {
            element = this.containsNode;
            seasonId = this.relatedData.seasonId
            pageId = this.pageId
        }
        var options = {
            parent: element,
            seasonId: seasonId,
            pageId: pageId
        }

        if (this.bookMark) {
            //如果上次只是隐藏则可以恢复
            this.bookMark.restore();
        } else {
            this.bookMark = new BookMark(options);
        }
    }
}

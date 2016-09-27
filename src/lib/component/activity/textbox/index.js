/**
 * 文本框
 */
import { HtmlBox } from './htmlbox'

export default function (activitProto) {

    /**
     * 检测是HTML文本框处理
     * @return {[type]} [description]
    */
    activitProto.htmlTextBox = function () {
        var self = this;
        var relatedData = this.relatedData;
        var contentHtmlBoxIds = relatedData.contentHtmlBoxIds;
        var contentId;
        var contentName;
        var $contentNode;
        //文本框实例对象
        //允许一个activity有多个
        this.htmlBoxInstance = [];
        //创建文本框对象
        if (contentHtmlBoxIds.length && relatedData.contentDas) {
            _.each(relatedData.contentDas, function (cds) {
                if (~contentHtmlBoxIds.indexOf(cds._id)) {
                    contentId = cds._id;
                    contentName = self.makePrefix('Content', self.pid, contentId);
                    //找到对应绑定事件的元素
                    $contentNode = self.getContextNode(contentName)
                    if (!$contentNode.attr("data-htmlbox")) {
                        //构建html文本框对象
                        self.htmlBoxInstance.push(new HtmlBox(contentId, $contentNode));
                        //增加htmlbox标志去重
                        //多个actictiy共享问题
                        $contentNode.attr("data-htmlbox", "true")
                    }
                }
            })
        }
    }


}
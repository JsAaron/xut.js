import { ShowNote as ShowNoteClass } from '../component/note/index'
import { config } from '../../config/index'

export default {

    /**
     * 创建热点元素结构（用于布局可触发点）
     * 根据数据创建自己的热点元素结构（用于拼接结构字符串）
     * 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
     * actType + "_" + _id
     * @return {[type]}              [description]
     */
    createDom(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {

        const id = activityData['_id']
        const width = activityData.scaleWidth
        const height = activityData.scaleHeight
        const newWidth = (width + height) / 2 * config.iconHeight

        const html =
            `<div id="ShowNote_${id}"
                      class="xut-showNote"
                      data-belong ="${pageType}"
                      data-delegate="shownote"
                      style="width:${newWidth}px;height:${newWidth}px">
                 </div>`

        return String.styleFormat(html)
    }


    /**
     * touchEnd 全局派发的点击事件
     * 如果stopGlobalEvent == ture 事件由全局派发
     */
    , trigger(data) {
        data.data = Xut.Presentation.GetPageData(data.pageIndex);
        new ShowNoteClass(data)
    }


    /**
     * 自动运行生成Action或者widget触发点对象
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    , autoPlay() {}


    /**
     * 销毁页面hotspot事件与Action或widget事件
     * @param  {[type]} activeObejct [需要处理的活动对象]
     * @param  {[type]} pageIndex    [页码标示]
     * @param  {[type]} rootEle      [根元素]
     * @return {[type]}              [description]
     */
    , destroy(opts) {
        this && this.destroy();
    }

}

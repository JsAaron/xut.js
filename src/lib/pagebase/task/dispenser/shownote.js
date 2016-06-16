
import { ShowNote as ShowNoteClass } from '../../../component/note/index'

let ShowNote = {

    //==========创建热点元素结构（用于布局可触发点）===============
    //
    // 根据数据创建自己的热点元素结构（用于拼接结构字符串）
    //
    // 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
    //actType + "_" + _id
    createDom: function(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
        var retStr = "",
            newWidth,
            id = activityData['_id'],
            width = activityData.scaleWidth,
            height = activityData.scaleHeight,
            newWidth = (width + height) / 2 * Xut.config.iconHeight;

        retStr += '<div id="ShowNote_' + id + '" class="xut-showNote" data-belong =' + pageType + ' data-delegate="ShowNote" style="width:' + newWidth + 'px;height:' + newWidth + 'px"></div>';
        return retStr;
    },

    /**
     * touchEnd 全局派发的点击事件
     * 如果stopGlobalEvent == ture 事件由全局派发
     */
    eventDelegate: function(data) {
        data.data = Xut.Presentation.GetPageData(data.pageIndex);
        new ShowNoteClass(data)
    },

    //自动运行生成Action或者widget触发点对象
    autoPlay: function(opts) {},

    /**
     * 翻页后处理页面中活动热点的状态
     * @param  {[type]} activeObejct [需要处理的活动对象]
     *
     * 比如音频,视频 翻页需要暂停，也可以销毁
     */
    flipOver: function(opts) {
        //console.log('翻页处理活动对象', activeObejct ,pageIndex);
    },


    /**
     * 销毁页面hotspot事件与Action或widget事件
     * @param  {[type]} activeObejct [需要处理的活动对象]
     * @param  {[type]} pageIndex    [页码标示]
     * @param  {[type]} rootEle      [根元素]
     * @return {[type]}              [description]
     */
    destroy: function(opts) {
        this && this.destroy();
    },

    //========复位对象==========
    //
    //  通过按物理键，关闭当前热点
    //
    //  @return 如果当前没有需要处理的Action,
    //  需要返回一个状态标示告诉当前是否应该退出应用
    //
    recovery: function(opts) {
        if (this.state) {
            this.dispatchProcess();
            return true;
        }
        return false
    }
}


export { ShowNote }

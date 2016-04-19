import {Adapter} from  '../../../component/widget/adapter'

let Widget = {
    //==========创建热点元素结构（用于布局可触发点）===============
    //
    // 根据数据创建自己的热点元素结构（用于拼接结构字符串）
    //
    // 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
    //
    // sqlRet    具体动作对象的数据
    // pageData  当前页面数据
    // chaperId  当前页面的chapterId
    // pageIndex 当前页面索引号
    // zIndex    热点元素的层级
    //
    createDom: function(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
        var retStr = '',
            layerId,
            cssStyle,
            autoPlay = activityData.autoPlay;

        //如果是自动播放,则不创建结构
        if (autoPlay) {
            return retStr;
        }

        var backgroundImage = '',
            width = activityData.scaleWidth,
            height = activityData.scaleHeight,
            top = activityData.scaleTop,
            left = activityData.scaleLeft,
            actType = activityData.actType,
            md5 = activityData.md5;

        //热点背景图
        if (md5) {
            backgroundImage = "background-image: url(" + Xut.config.pathAddress + md5 + ");";
        }

        //创建触发点结构
        layerId = actType + "_" + activityData._id;
        cssStyle = 'cursor: pointer;width:' + width + 'px;height:' + height + 'px;left:' + left + 'px;top:' + top + 'px;background-size:100% 100%;position:absolute;z-index:' + zIndex + ';' + backgroundImage + '';

        return String.format(
            '<div id="{0}"' + ' data-belong ="{1}"' + ' data-delegate="{2}"'
            // +' autoplay="{3}"' svg打包不可以属性
            + ' style="{4}">' + ' </div>',
            layerId,
            pageType,
            actType,
            autoPlay,
            cssStyle
        );
    },

    //事件委托
    //通过点击触发
    eventDelegate: function(data) {
        return Adapter(data)
    },

    //在当前页面自动触发的通知
    autoPlay: function(data) {
        Adapter({
            'rootNode'   : data.rootNode,
            "type"       : data.type,
            "pageType"   : data.pageType,
            "activityId" : data.id,
            "pageIndex"  : data.pageIndex,
            "isAutoPlay" : true
        })
    },

    /**
     *  复位状态通知
     *
     *  作用：用户按页面右上角返回，或者pad手机上的物理返回键
     *
     *  那么：
     *      1 按一次， 如果当前页面有活动热点，并且热点对象还在可视活动状态（比如文本，是显示，音频正在播放）
     *        那么则调用此方法，做复位处理，即文本隐藏，音频关闭
     *        然后返回true, 用于反馈给控制器,停止下一步调用
     *        按第二次,则退出页面
     *
     *     2 按一次，如果没有活动的对象，return false,这直接退出页面
     *
     * @param  {[type]} activeObejct [description]
     * @return {[type]}              [description]
     */
    recovery: function(opts) {
        return this.recovery();
    }
}


export {Widget}
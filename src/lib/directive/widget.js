import { Adapter } from '../component/widget/adapter'

export default {

    /**
     * 创建热点元素结构（用于布局可触发点
     * 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
     * 根据数据创建自己的热点元素结构（用于拼接结构字符串）
     * @return {[type]}              [description]
     */
    createDom({
            _id,
            md5,
            autoPlay,
            actType,
            scaleWidth,
            scaleHeight,
            scaleTop,
            scaleLeft
        } = {}, chpaterData, chapterId, pageIndex, zIndex, pageType) {

            let backgroundImage = ''

            //如果是自动播放,则不创建结构
            if (autoPlay) {
                return ''
            }

            //热点背景图
            if (md5) {
                backgroundImage = "background-image: url(" + Xut.config.pathAddress + md5 + ");"
            }

            let html =
                '<div id="{{id}}" ' +
                'data-belong="{{pageType}}" ' +
                'data-delegate="{{actType}}" ' +
                'style=' +
                '"' +
                'cursor: pointer;' +
                'background-size:100% 100%;' +
                'position:absolute;' +
                'width:{{width}}px;height:{{height}}px;left:{{left}}px;top:{{top}}px;' +
                'z-index:{{zIndex}};' +
                '{{backgroundImage}}' +
                '"' +
                '></div>'

            return _.template(html, {
                id: actType + "_" + _id,
                pageType: pageType,
                actType: actType,
                autoPlay: autoPlay,
                width: scaleWidth,
                height: scaleHeight,
                left: scaleLeft,
                top: scaleTop,
                zIndex: zIndex,
                backgroundImage: backgroundImage
            })

        },


        /**
         * 事件委托
         * 通过点击触发
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        eventDelegate(data) {
            return Adapter(data)
        },


        /**
         * 在当前页面自动触发的通知
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        autoPlay(data) {
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
        recovery(opts) {
            return this.recovery();
        }
}

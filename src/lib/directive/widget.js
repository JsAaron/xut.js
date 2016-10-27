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

        const id = actType + "_" + _id
        const html =
            `<div id="${id}"
                  data-belong="${pageType}"
                  data-delegate="${actType}"
                  style="cursor:pointer;
                         background-size:100% 100%;
                         position:absolute;
                         width:${scaleWidth}px;
                         height:${scaleHeight}px;
                         left:${scaleLeft}px;
                         top:${scaleTop}px;
                         z-index:${zIndex};
                         ${backgroundImage}">
            </div>`

        return String.styleFormat(html)
    }


    /**
     * 自动零件
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    , autoPlay({
        id,
        rootNode,
        pageType,
        pageIndex
    } = {}) {
        Adapter({
            rootNode,
            pageType,
            pageIndex,
            activityId: id,
            isAutoPlay: true
        })
    }


    /**
     * 事件委托
     * 通过点击触发
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    , trigger(data) {
        return Adapter(data)
    }

}

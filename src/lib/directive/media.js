import { parseJSON } from '../util/index'
import { config } from '../config/index'
import { triggerAudio, autoAudio } from '../component/audio/manager'
import { triggerVideo, autoVideo } from '../component/video/manager'

//临时音频动作数据
const tempData = {}

export default {

    createDom({
            _id,
            md5,
            actType,
            category,
            itemArray,
            scaleWidth,
            scaleHeight,
            scaleTop,
            scaleLeft
        } = {}, chpaterData, chapterId, pageIndex, zIndex, pageType) {

            let html, mediaIcon = '',
                startImage = ''

            //如果没有宽高则不创建绑定节点
            if (!scaleWidth || !scaleHeight) return ''

            let screenSize = config.screenSize

            //解析音乐动作
            //冒泡动作靠节点传递数据
            if (itemArray) {
                itemArray = parseJSON(itemArray);
                let start = itemArray[0];
                let stop = itemArray[1];
                tempData[_id] = {};
                if (start) {
                    if (start.startImg) {
                        startImage = start.startImg;
                        tempData[_id]['startImg'] = startImage;
                        startImage = 'background-image:url(' + startImage + ');';
                    }
                    if (start.script) {
                        tempData[_id]['startScript'] = start.script;
                    }
                }
                if (stop) {
                    if (stop.stopImg) {
                        tempData[_id]['stopImg'] = stop.stopImg;
                    }
                    if (stop.script) {
                        tempData[_id]['stopScript'] = stop.script
                    }
                }
            }

            //首字母大写
            const mediaType = category.replace(/(\w)/, function(v) {
                return v.toUpperCase()
            })

            //只针对网页插件增加单独的点击界面
            //如果有视频图标
            if (category == 'webpage' &&
                (scaleWidth > 200) &&
                (scaleHeight > 100) &&
                (scaleWidth <= screenSize.width) &&
                (scaleHeight <= screenSize.height)) {

                const mediaIconSize = 74;
                const posX = (scaleWidth - mediaIconSize) / 2;
                const posY = (scaleHeight - mediaIconSize) / 2;
                const icon = 'background-image:url(images/icons/web_hotspot.png)'
                mediaIcon = `<div 
                              id="icon_${_id}" 
                              type="icon" 
                              style="width:${mediaIconSize}px;height:${mediaIconSize}px;top:${posY}px;left:${posX}px;position:absolute;${icon}"></div>`
            }


            //创建音频对象
            //Webpage_1
            //Audio_1
            //Video_1
            return `<div 
                      id="${mediaType + "_" + _id}" 
                      data-belong="${pageType}" 
                      data-delegate="${category}" 
                      style="width:${scaleWidth}px;height:${scaleHeight}px;left:${scaleLeft}px;top:${scaleTop}px;z-index:${zIndex};${startImage}background-size:100% 100%;position:absolute;">${mediaIcon}</div>`
        },


        /**
         * 仅创建一次
         * data传递参数问题
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        onlyCreateOnce(id) {
            var data;
            if (data = tempData[id]) {
                delete tempData[id]
                return data;
            }
        },


        /**
         * touchEnd 全局派发的点击事件
         * 如果stopGlobalEvent == ture 事件由全局派发
         */
        eventDelegate({
            id,
            target,
            rootNode,
            pageIndex,
            activityId
        } = {}) {
            let category = target.getAttribute('data-delegate')
            if (category) {
                let chapterId = Xut.Presentation.GetPageId(pageIndex);
                /**
                 * 传入chapterId 页面ID
                 * activityId    视频ID
                 * eleName       节点名  //切换控制
                 * 根节点
                 */
                if (category == 'audio') {
                    triggerAudio(chapterId, activityId, this.onlyCreateOnce(id))
                } else {
                    triggerVideo(chapterId, activityId, $(rootNode))
                }
            }
        },


        /**
         * 自动运行
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        autoPlay({
            id,
            autoPlay,
            category,
            rootNode,
            pageIndex,
            chapterId
        } = {}) {
            if (!category) return
            if (category == 'audio') {
                autoAudio(chapterId, id, this.onlyCreateOnce(id));
            } else {
                autoVideo(chapterId, id, rootNode);
            }
        }

}

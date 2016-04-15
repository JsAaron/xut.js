import { parseJSON } from '../../../util/index'

//临时音频动作数据
let tempData = {};

let Media = {

    createDom: function(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
            var width = activityData.scaleWidth,
            height = activityData.scaleHeight,
            top = activityData.scaleTop,
            left = activityData.scaleLeft,
            actType = activityData.actType,
            id = activityData._id;

        //如果没有宽高则不创建绑定节点
        if (!width || !height) return '';

        var category = activityData.category;
        var mediaIcon,
            mediaIconSize,
            posX,
            posY,
            start,
            stop,
            itemArray,
            startImage = "";

        var screenSize = Xut.config.screenSize

        //只针对网页插件增加单独的点击界面
        if (category == 'webpage' && (width > 200) && (height > 100) && (width <= screenSize.width) && (height <= screenSize.height)) {
            mediaIcon = 'background-image:url(images/icons/web_hotspot.png)';
        }

        //解析音乐动作
        //冒泡动作靠节点传递数据
        if (itemArray = activityData.itemArray) {
            itemArray = parseJSON(itemArray);
            start = itemArray[0];
            stop = itemArray[1];
            tempData[id] = {};
            if (start) {
                if (start.startImg) {
                    startImage = start.startImg;
                    tempData[id]['startImg'] = startImage;
                    startImage = 'background-image:url(' + startImage + ');';
                }
                if (start.script) {
                    tempData[id]['startScript'] = start.script;
                }
            }
            if (stop) {
                if (stop.stopImg) {
                    tempData[id]['stopImg'] = stop.stopImg;
                }
                if (stop.script) {
                    tempData[id]['stopScript'] = stop.script
                }
            }
        }

        //首字母大写
        var mediaType = category.replace(/(\w)/, function(v) {
            return v.toUpperCase()
        })


        //创建音频对象
        //Webpage_1
        //Audio_1
        //Video_1
        var tpl = String.format(
            '<div id="{0}"' + ' data-belong="{1}"' + ' data-delegate="{2}"' + ' style="width:{3}px;height:{4}px;left:{5}px;top:{6}px;z-index:{7};{8}background-size:100% 100%;position:absolute;">',
            mediaType + "_" + id,
            pageType,
            category,
            width,
            height,
            left,
            top,
            zIndex,
            startImage
        );

        //如果有视频图标
        if (mediaIcon) {
            mediaIconSize = 74;
            posX = (width - mediaIconSize) / 2;
            posY = (height - mediaIconSize) / 2;

            tpl += String.format(
                '<div id="icon_{0}"' + ' type="icon"' + ' style="position:absolute;top:{1}px;left:{2}px;width:{3}px;height:{4}px;{5};">' + ' </div>',
                id,
                posY,
                posX,
                mediaIconSize,
                mediaIconSize,
                mediaIcon
            )
        }

        tpl += '</div>';

        return tpl;
    },


    //仅创建一次
    //data传递参数问题
    onlyCreateOnce: function(id) {
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
    eventDelegate: function(data) {
        var category, chapterId;
        if (category = data.target.getAttribute('data-delegate')) { //触发类型
            chapterId = Xut.Presentation.GetPageId(data.pageIndex);
            /**
             * 传入chapterId 页面ID
             * activityId    视频ID
             * eleName       节点名  //切换控制
             * 根节点
             */
            if (category == 'audio') {
                Xut.AudioManager.trigger(chapterId, data.activityId, this.onlyCreateOnce(data.id));
            } else {
                Xut.VideoManager.trigger(chapterId, data.activityId, $(data.rootNode));
            }
        }
    },


    //自动运行
    autoPlay: function(data) {
        var category = data.category;
        if (!category) return;
        var rootNode = data.rootNode,
            pageIndex = data.pageIndex,
            chapterId = data.chapterId,
            activityId = data.id,
            triggerType = category == 'audio' ? 'audioManager' : 'videoManager';

        //数据库视频音频不规则问题导致
        //首字母大写
        var mediaType = category.replace(/(\w)/, function(v) {
            return v.toUpperCase()
        })

        //自动音频
        if (category == 'audio') {
            Xut.AudioManager.autoPlay(chapterId, activityId, this.onlyCreateOnce(data.id));
        } else {
            //自动视频
            Xut.VideoManager.autoPlay(chapterId, activityId, rootNode);
        }
    }

}


export {Media}
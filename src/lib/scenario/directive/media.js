import { parseJSON, getFileFullPath } from '../../util/index'
import { config } from '../../config/index'
import { triggerAudio, autoAudio, getMediaData, hasHotAudioPlay } from '../../component/audio/api'
import { triggerVideo, autoVideo } from '../../component/video/api'

//临时音频动作数据
const tempData = {}

//音频按钮尺寸
const mediaIconSize = 74

/**
 * 仅创建一次
 * data传递参数问题
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
const onlyCreateOnce = (id) => {
  let data = tempData[id]
  if (data) {
    delete tempData[id]
    return data;
  }
}


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
  }, chpaterData, chapterId, pageIndex, zIndex, pageType) {

    let mediaIcon = ''
    let startImage = ''
    let pauseImage = ''

    //如果没有宽高则不创建绑定节点
    if (!scaleWidth || !scaleHeight) return ''

    //解析音乐动作
    //冒泡动作靠节点传递数据
    if (itemArray) {
      itemArray = parseJSON(itemArray);
      let start = itemArray[0];
      let stop = itemArray[1];

      const itemLength = itemArray.length

      /*如果只有一个参数，并且还有zIndex*/
      if (itemLength === 1 && (1 !== start.indexOf('zIndex'))) {
        const option = parseJSON(start)
        if (option) {
          zIndex = option.zIndex
          start = null
        }
      }
      /*如果二个参数，并且还有zIndex*/
      else if (itemLength === 2 && (1 !== stop.indexOf('zIndex'))) {
        const option = parseJSON(stop)
        if (option) {
          zIndex = option.zIndex
          stop = null
        }
      }
      /*如果只有三个参数，并且还有zIndex*/
      else if (itemLength === 3 && (1 !== itemArray.indexOf('zIndex'))) {
        const option = parseJSON(itemArray[2])
        if (option) {
          zIndex = option.zIndex
        }
      }

      tempData[_id] = {};
      if (start) {
        if (start.startImg) {
          startImage = start.startImg;
          tempData[_id]['startImg'] = startImage;
          startImage = 'background-image:url(' + getFileFullPath(startImage, 'hot-media') + ');';
        }
        if (start.script) {
          tempData[_id]['startScript'] = start.script;
        }
      }
      if (stop) {
        if (stop.stopImg) {
          tempData[_id]['stopImg'] = stop.stopImg;
          pauseImage = 'background-image:url(' + getFileFullPath(stop.stopImg, 'hot-media') + ');';
        }
        if (stop.script) {
          tempData[_id]['stopScript'] = stop.script
        }
      }

    }

    //只针对网页插件增加单独的点击界面
    //如果有视频图标
    if (category == 'webpage' &&
      (scaleWidth > 200) &&
      (scaleHeight > 100) &&
      (scaleWidth <= config.visualSize.width) &&
      (scaleHeight <= config.visualSize.height)) {
      mediaIcon =
        `<div id="icon_${_id}"
              type="icon"
              style="width:${mediaIconSize}px;
                     height:${mediaIconSize}px;
                     top:${(scaleHeight - mediaIconSize) / 2}px;
                     left:${(scaleWidth - mediaIconSize) / 2}px;
                     position:absolute;background-image:url(images/icons/web_hotspot.png)">
         </div>`
    }

    //首字母大写
    const mediaType = category.replace(/(\w)/, v => v.toUpperCase())

    /*默认状态*/
    let imageBackground = pauseImage || startImage

    /* 音频在创建dom的时候需要查下，这个hot对象是否已经被创建过
       如果创建过，那么图标状态需要处理*/
    if (hasHotAudioPlay(chapterId, _id)) {
      imageBackground = startImage
    }

    /*
    查找视频音频是否被浮动到页面,这个很特殊的处理
    需要把节点合并到content种一起处理浮动对象
     */
    let hasFloat = false
    const mediaData = getMediaData(mediaType, _id)
    if (mediaData && mediaData.isfloat) {
      hasFloat = true
    }

    //创建音频对象
    //Webpage_1
    //Audio_1
    //Video_1
    const html = String.styleFormat(
      `<div id="${mediaType + "_" + _id}"
            data-belong="${pageType}"
            data-delegate="${category}"
            style="width:${scaleWidth}px;
                   height:${scaleHeight}px;
                   left:${scaleLeft}px;
                   top:${scaleTop}px;
                   z-index:${zIndex};
                   ${imageBackground}
                   background-size:100% 100%;
                   position:absolute;">
            ${mediaIcon}
       </div>`
    )

    return {
      html,
      hasFloat
    }
  }

  /**
   * 自动运行
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  ,
  autoPlay({
    id,
    pageType,
    category,
    rootNode,
    pageIndex,
    chapterId
  }) {
    if (!category) return
    if (category == 'audio') {
      autoAudio(chapterId, id, onlyCreateOnce(id));
    } else {
      autoVideo({
        pageType,
        rootNode,
        chapterId,
        pageIndex,
        'activityId': id
      })
    }
  }

  /**
   * touchEnd 全局派发的点击事件
   * 如果stopGlobalEvent == ture 事件由全局派发
   * isColumn 流式排版触发的媒体
   */
  ,
  trigger({
    id,
    target,
    rootNode,
    pageIndex,
    activityId,
    columnData = {}
  }) {

    /*************
      流式布局处理
    **************/
    if (columnData.isColumn) {
      if (columnData.type === 'Audio') {
        triggerAudio({
          activityId,
          columnData,
          chapterId: columnData.chapterId,
          data: onlyCreateOnce(id)
        })
      } else {
        triggerVideo({
          chapterId: columnData.chapterId,
          columnData,
          activityId,
          rootNode,
          pageIndex
        })
      }
      return
    }

    /*************
      PPT页面处理
    **************/
    const category = target.getAttribute('data-delegate')
    if (category) {
      /*音频点击可以是浮动母版了，所以这里必须要明确查找chapter属于的类型页面*/
      const pageType = target.getAttribute('data-belong')
      const chapterId = Xut.Presentation.GetPageId(pageType, pageIndex);
      if (category == 'audio') {
        triggerAudio({
          chapterId,
          activityId,
          data: onlyCreateOnce(id)
        })
      } else {
        triggerVideo({
          chapterId,
          activityId,
          rootNode,
          pageIndex,
          pageType
        })
      }
    }
  }
}

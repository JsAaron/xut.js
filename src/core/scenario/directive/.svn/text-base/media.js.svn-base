import { parseJSON, getFileFullPath, titleCase } from '../../util/index'
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

    //如果没有宽高则不创建绑定节点
    if (!scaleWidth || !scaleHeight) return ''

    let display
    let startImage
    let startScript
    let stopImage
    let stopScript
    let mediaIcon = ''

    //解析音乐动作
    if (itemArray) {

      itemArray = parseJSON(itemArray);

      /**
       * 老模式
       *      "itemArray": "[\r\n  {\r\n    \"startImg\": \"027c3803a38237ad567484bbe42385df.png\"\r\n  },\r\n  {\r\n    \"stopImg\": \"676183f05ef671b9ba3609ec762f9e5e.png\"\r\n  }"
       *
       *  */
      if (itemArray.length) {
        const start = itemArray[0];
        const stop = itemArray[1];
        /*音频Action参数*/
        if (start) {
          startImage = start.startImg ? start.startImg : ''
          startScript = start.script ? start.script : ''
        }
        if (stop) {
          stopImage = start.stopImg ? start.stopImg : ''
          stopScript = stop.script ? start.script : ''
        }

      } else {
        /*
        新模式
         itemArray:{
           startImage:'027c3803a38237ad567484bbe42385df.png',
           stopImage:'676183f05ef671b9ba3609ec762f9e5e.png',
           startScript:'',
           stopScript:'',
           zIndex:12,
           display:'hidden'
         }
        */
        zIndex = itemArray.zIndex
        display = itemArray.display
        startImage = itemArray.startImage
        startScript = itemArray.startScript
        stopImage = itemArray.stopImage
        stopScript = itemArray.stopScript
      }

      /*音频Action动作数据*/
      tempData[_id] = {};
      if (startImage) {
        tempData[_id]['startImage'] = startImage;
        startImage = 'background-image:url(' + getFileFullPath(startImage, 'hot-media') + ');';
      }
      if (startScript) {
        tempData[_id]['startScript'] = startScript
      }
      if (stopImage) {
        tempData[_id]['stopImage'] = stopImage
        stopImage = 'background-image:url(' + getFileFullPath(stopImage, 'hot-media') + ');';
      }
      if (stopScript) {
        tempData[_id]['stopScript'] = stopScript
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
    const mediaType = titleCase(category)

    /*默认状态*/
    let imageBackground = startImage || ''

    /*
    音频在创建dom的时候需要查下
    这个hot对象是否已经被创建过
    如果创建过，那么图标状态需要处理
    */
    if (hasHotAudioPlay(chapterId, _id)) {
      imageBackground = stopImage
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

    /*是否隐藏,如果隐藏通过脚本调用*/
    const visibility = display === 'hidden' ? "visibility:hidden;" : ''


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
                   ${visibility}
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
      /*通过id搜索*/
      rootNode = rootNode.closest(`#${Xut.View.GetPageNodeIdName(pageType,pageIndex,chapterId)}`)
      if (!rootNode.length) {
        /*自动ppt视频，是采用的li父节点，所以这里需要处理下*/
        rootNode = rootNode.closest('li')
      }
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

  /*销毁数据*/
  ,
  destory() {

  }
}

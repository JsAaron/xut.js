//事件钩子
import delegateHooks from './hooks'
import { $trigger } from '../command/index'

/**
 * 简化委托处理，默认一层元素只能绑定一个委托事件
 */
export function closestProcessor(event, pageType) {

  var i, k, attribute, attributes, value,
    cur = event.target;

  if (cur.nodeType) {
    //如果触发点直接是li
    if (cur === this) {
      return {
        'rootNode': this,
        'elem': cur,
        'handlers': delegateHooks['data-container']
      }
    }
    //否则是内部的节点
    try {
      for (; cur !== this; cur = cur.parentNode || this) {
        //如果是canvas节点
        if (cur.nodeName && cur.nodeName.toLowerCase() === 'canvas') {
          //是否为滑动行为
          if (Xut.Contents.Canvas.getSupportState()) {
            return true;
          } else {
            return false;
          }
        }
        //如果是dom节点
        attributes = cur['attributes']
        for (k in delegateHooks) {
          if (attribute = attributes[k]) {
            value = attribute['value' || 'nodeValue']
            return {
              'rootNode': this,
              'elem': cur,
              'attribute': value,
              'pageType': pageType,
              'handlers': delegateHooks[k]
            }
          }
        }
      }
    } catch (err) {
      // Xut.plat.isBrowser && console.log('默认事件跟踪', err)
    }

  }
}


/*
委托处理媒体
视频、音频
 */
export function closestMedia(target, chapterId, pageIndex) {
  if (target) {

    const hasPoster = target.getAttribute('data-type')

    /*
      如果是column视频的poster层
      1 保存视频的嵌套容器
      2 修正target的目标为父容器Video
      视频播放节点与图片Poster是平行的
      poster 层级index -1
      video  层级index 0
    */
    let container
    if (hasPoster === 'poster' && !key) {
      container = target
      target = target.parentNode
    }

    const key = target.getAttribute('id')
    const matchType = key && key.match(/(Audio|Video)_(\w+)/)
    if (matchType) {
      const fileName = target.getAttribute('data-name') //文件名
      if (fileName) {
        const type = matchType[1]
        const id = matchType[2]

        if (fileName) {
          $trigger({
            target,
            pageIndex
          }, {
            id,
            type,
            startImage: target.getAttribute('data-startImage'),
            stopImage: target.getAttribute('data-stopImage'),
            container: container || target,
            track: 8888, //播放就删除
            chapterId: 'column',
            isColumn: true,
            fileName
          })
        }
      } else {
        console.log('column中的媒体文件不存在')
      }
    }
  }
}

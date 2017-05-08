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
    const key = target.getAttribute('id')
    const matchType = key && key.match(/(Audio|Video)_(\w+)/)
    if (matchType) {
      const fileName = target.getAttribute('data-name') //文件名
      if (fileName) {
        const type = matchType[1]
        const id = matchType[2]
        if (fileName) {
          let poster
          if (type === 'Video') {
            poster = target.getAttribute('data-poster')
          }
          $trigger({
            target,
            pageIndex
          }, {
            id,
            type,
            poster, //视频预览图
            container: target,
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

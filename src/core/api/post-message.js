/**
 * 读库服务器网址
 * 通过iframe加载本地localhost地址的时候
 * 会有通讯跨域的问题
 * 这里统一解决问题的接口
 */
import { makeJsonPack, $warn } from '../util/index'

/////////////////////////
///
/// 发送外部消息
///
////////////////////////


/**
 * 发送通讯接口
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function sendPostMessage(type, data = {}) {
  return type && window.parent && window.parent.postMessage({
    type: type,
    content: data
  }, '*');
}


/**
 * 监控内部的watch，转化成外部的PostMessage
 * @return {[type]} [description]
 */
export function watchPostMessage() {
  //秒秒学，完成通知
  Xut.Application.Watch('complete', function() {
    sendPostMessage('complete')
  })

  //秒秒学收集用户信息通知
  Xut.Application.Watch('trackCode', function(type, options) {
    sendPostMessage(type, options)
  })
}

export function unWatchPostMessage() {
  Xut.Application.unWatch('complete')
  Xut.Application.unWatch('trackCode')
}


/////////////////////////
///
/// 接收外部消息后处理
///
////////////////////////


/**
 * 监听跨域的外部事件
 * 秒秒学使用
 * 2017.11.28
 */
export function bindMessage() {
  window.addEventListener('message', handleMessage, false);
}

export function unBindMessage() {
  window.removeEventListener('message', handleMessage, false);
}

/**
 * 接收外部通讯，设置
 * @param {[type]} event [description]
 */
function handleMessage(event) {
  if (event.data && event.data.type) {
    //外部调用内部API处理
    if (event.data.type === 'api' && event.data.content) {
      try {
        makeJsonPack(event.data.content)()
      } catch (err) {
        $warn({
          type: 'api',
          content: `跨域message接受API出错 ${event.data.content}`
        })
      }
    }
  }
}

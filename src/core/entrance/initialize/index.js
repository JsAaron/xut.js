/**
 * app初始化功能
 * @return {[type]} [description]
 */
import { initAsyn } from './asyn'
import { initAudio } from '../../component/audio/api'
import { initVideo } from '../../component/video/api'
import { initGlobalAPI } from '../../api/global-api/index'
import { initGlobalEvent } from './global-event'
import { config } from '../../config/index'

/**
 * 代码初始化
 */
initAudio()
initVideo()
initGlobalAPI()

initGlobalEvent()

export default function initApp(callback) {
  /*针对异步的代码以前检测出来*/
  initAsyn(() => {
    if (window.parent) {
      //读库上iframe跨域报错处理
      //一个服务器域，一个是本地域，所以parent无法访问了
      //通过一个定时器延迟，等待第一次config.postMessage的配置
      return setTimeout(callback, 0)
    }
    callback()
  })
}

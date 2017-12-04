/**
 * app初始化功能
 * @return {[type]} [description]
 */
import { initAsyn } from './asyn'
import { initGlobalEvent } from './global-event'
import { initAudio } from '../../component/audio/api'
import { initVideo } from '../../component/video/api'
import { initGlobalAPI } from '../../api/global-api/index'

/**
 * 代码初始化
 */
initAudio()
initVideo()
initGlobalAPI()

export default function initApp(callback) {
  /*针对异步的代码以前检测出来*/
  initAsyn(() => {
    //全局的一些事件处理
    initGlobalEvent();
    callback()
  })
}

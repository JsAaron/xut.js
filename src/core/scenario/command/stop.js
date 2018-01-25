/**
 * 停止动作
 * 给全局stop接口使用
 * 与suspend的区别就是，这个全除了suspend的处理，还包括零件的暂停
 * @return {[type]} [description]
 */
import access from './access'

import { clearAudio } from '../../component/audio/api'
import { clearVideo } from '../../component/video/api'

/**
 * 停止所有热点动作,并返回状态
 * 1 content
 * 2 widget
 * 动画,视频,音频...........................
 * 增加场景模式判断
 *
 *  skipAudio 是否跳过音频，不处理
 *    true 跳过
 *    false 不跳过
 */

import { $stopAutoWatch } from './auto'

/**
 * 复位状态/状态控制
 * 如果返回false证明有热点
 * 第一次只能关闭热点不能退出页面
 * @param  {[type]} pageObj [description]
 * @return {[type]}         [description]
 */
export function $stop(skipAudio) {

  if (!skipAudio) {
    //清理音频
    clearAudio()
  }

  //清理视频
  clearVideo()

  //场景页面切换的调用，需要停止
  $stopAutoWatch()

  //停止热点
  return access(function(pageBase, activityObjs, componentObjs) {

    //如果返回值是false,则是算热点处理行为
    let falg = false

    //content类型
    activityObjs && _.each(activityObjs, function(obj) {
      if (obj.stop && obj.stop()) {
        falg = true
      }
    })


    //零件类型
    componentObjs && _.each(componentObjs, function(obj) {
      if (obj.stop && obj.stop()) {
        falg = true
      }
    })

    return falg;
  })
}

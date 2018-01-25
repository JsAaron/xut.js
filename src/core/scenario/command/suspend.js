/**
 * 暂停控制
 * @return {[type]} [description]
 */
import access from './access'
import { $stopAutoWatch } from './auto'
import { hangUpAudio, clearAudio } from '../../component/audio/api'
import { removeVideo, clearVideo } from '../../component/video/api'
import { stopPreload } from 'preload/index'


/**
 * 翻页停止content动作
 * 翻页时,暂停滑动页面的所有热点动作
 *
 * 如果传递了allHandle 停止所有的视频
 * allHandle 给接口Xut.Application.Original() 使用
 *
 * 页面与模板翻页都会调用暂停接口
 */
export function $suspend(pageBase, pageId, allHandle) {

  //零件对象翻页就直接销毁了
  //无需暂时
  //这里只处理音频 + content类型
  access(pageBase, (pageBase, activityObjs) => {

    /*停止预加载*/
    // stopPreload()

    /*这个必须要，翻页停止AUTO的自动延时延时器，否则任务会乱套,e.g. 跨页面音频*/
    $stopAutoWatch()

    //多媒体处理
    if (pageId !== undefined) {
      //离开页面销毁视频
      removeVideo(pageId);
      //翻页停止母板音频
      if (pageBase.pageType === 'master') {
        hangUpAudio()
      }
    }

    //content类型
    activityObjs && _.each(activityObjs, (obj) => {
      obj.stop && obj.stop();
    })

    //如果是外部调用接口
    //Xut.Application.Original
    //销毁视频
    //销毁所有的音频
    if (allHandle) {
      clearVideo()
      clearAudio()
    }

  })

}

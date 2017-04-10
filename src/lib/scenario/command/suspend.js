/**
 * 暂停控制
 * @return {[type]} [description]
 */
import access from './access'
import { hangUpAudio, clearAudio } from '../../component/audio/manager'
import { removeVideo, clearVideo } from '../../component/video/manager'


/**
 * 翻页停止content动作
 * 翻页时,暂停滑动页面的所有热点动作
 *
 * 如果传递了allHandle 停止所有的视频
 * allHandle 给接口Xut.Application.Original() 使用
 *
 * @param  {[type]} pageObj [description]
 * @param  {[type]} pageId  [description]
 * @param  {[type]} all     [description]
 * @return {[type]}         [description]
 */
export function $suspend(pageObj, pageId, allHandle) {

  //零件对象翻页就直接销毁了
  //无需暂时
  //这里只处理音频 + content类型
  access(pageObj, (pageObj, contentObjs) => {

    //多媒体处理
    if(pageId !== undefined) {
      //离开页面销毁视频
      removeVideo(pageId);
      //翻页停止母板音频
      if(pageObj.pageType === 'master') {
        hangUpAudio()
      }
    }

    //content类型
    contentObjs && _.each(contentObjs, (obj) => {
      obj.stop && obj.stop();
    })

    //如果是外部调用接口
    //销毁视频
    //销毁所有的音频
    if(allHandle) {
      clearVideo()
      clearAudio()
    }

  })

}

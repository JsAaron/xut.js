/**
 * 暂停控制
 * @return {[type]} [description]
 */

import { access } from './access'


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
export function suspend(pageObj, pageId, allHandle) {

    access(pageObj, (pageObj, ContentObjs, ComponentObjs) => {

        //多媒体处理
        if (pageId !== undefined) {
            //离开页面销毁视频
            Xut.VideoManager.removeVideo(pageId);
            //翻页停止母板音频
            if (pageObj.pageType === 'master') {
                Xut.AudioManager.hangUpAudio()
            }
        }

        //content类型
        if (ContentObjs) {
            _.each(ContentObjs, (obj) => {
                obj.flipOver && obj.flipOver();
            })
        }

        //如果是外部调用接口
        //销毁视频
        //销毁所有的音频
        if (allHandle) {
            Xut.VideoManager.hangUpVideo()
            Xut.AudioManager.hangUpAudio()
        }

    })

}

/**
 * 暂停控制
 * @return {[type]} [description]
 */

//翻页时,暂停滑动页面的所有热点动作
//翻页停止content动作
export function suspend(pageObj, pageId) {

    Xut.accessControl(pageObj, function(pageObj, ContentObjs, ComponentObjs) {
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
            _.each(ContentObjs, function(obj) {
                obj.flipOver && obj.flipOver();
            })
        }
    })

}

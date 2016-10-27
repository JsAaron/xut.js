/**
 * 热点动作控制器模块
 * 1 所有content热点停止
 * 2 所有content热点销毁
 * 3 app应用销毁
 */
import { $$stop } from './command/index'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'

/**
 * 停止热点动作
 * @param  {[type]} context   [description]
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const clearHots = () => {
    return $$stop()
}


/**
 * 检测媒体的播放状态
 *   1 视频
 *   2 音频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
const clearMedia = (pageId) => {
    //音频 视频 是否有处理
    let flag = false

    if (clearAudio(pageId)) {
        flag = true;
    }

    if (clearVideo()) {
        flag = true;
    }

    return flag;
}


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
export function stopProcessor(skipAudio) {

    //是否存在运行中
    let hasRun = false;

    //清理音频
    if (clearMedia(skipAudio)) {
        hasRun = true
    }

    //清理热点
    ///content, Action', 'Widget', 'ShowNote'
    if (clearHots()) {
        hasRun = true
    }

    return hasRun
}


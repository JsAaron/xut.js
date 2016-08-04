/**
 * 热点动作控制器模块
 * 1 所有content热点停止
 * 2 所有content热点销毁
 * 3 app应用销毁
 */

//调度器
import { recovery } from './command/index'
import { show } from './util/notice'
import { close } from './toolbar/navbar/index'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'

/**
 * [checkWidgets description]
 * @param  {[type]} context   [description]
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
let checkWidgets = (context, pageIndex) => {
    return recovery()
}


/**
 *  检测媒体的播放状态
 *   1 视频
 *    2 音频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
let checkMedia = (pageId) => {
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
 * 消息提示框
 * @param  {[type]} info [description]
 * @return {[type]}      [description]
 */
export function promptMessage(info) {
    show({
        hindex: Xut.Presentation.GetPageIndex(),
        content: info || "再按一次将退回到主页",
        time: 3000
    });
}


/**
 * 停止所有热点动作,并返回状态
 * 1 content
 * 2 widget
 * 动画,视频,音频...........................
 * 增加场景模式判断
 */
export function suspendHandles(context, pageIndex, skipMedia) {

    //是否存在运行中
    let stateRun = false;

    //处理音频
    if (checkMedia(skipMedia)) {
        stateRun = true;
    }

    //正在运行的热点
    ///content,Action', 'Widget', 'ShowNote'
    if (checkWidgets(context, pageIndex)) {
        stateRun = true;
    }

    //处理导航
    close(() => {
        stateRun = true;
    });

    return stateRun;
}

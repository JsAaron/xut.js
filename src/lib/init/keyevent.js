import {getPlugVideoState, closePlugVideo} from './video'

/**
 *  物理按键处理
 */

//退出加锁,防止过快点击
var outLock = false;

//回退按钮状态控制器
function controller(state) {
    //如果是子文档处理
    if (Xut.isRunSubDoc) {
        //通过Action动作激活的,需要到Action类中处理
        Xut.publish('subdoc:dropApp');
        return;
    }
    //正常逻辑
    outLock = true;

    Xut.Application.Suspend({
        dispose: function () { //停止热点动作
            setTimeout(function () {
                outLock = false;
            }, 100)
        },
        processed: function () { //退出应用
            state === 'back' && Xut.Application.DropApp();
        }
    });
}

/**
 * 绑定控制案例事件
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export function bindKeyEvent(config) {
    //存放绑定事件
    config._event = {
        //回退键
        back: function () {
            //如果是预加载视频
            if (getPlugVideoState()) {
                closePlugVideo()
            } else {
                controller('back');
            }
        },
        //暂停键
        pause: function () {
            controller('pause');
        }
    }
}

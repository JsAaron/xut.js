import {
    getPlugVideoState,
    closePlugVideo
} from './lauch.video'

/**
 * 退出加锁,防止过快点击
 * @type {Boolean}
 */
let outLock = false;

/**
 * 回退按钮状态控制器
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
const controller = (state) => {
    //如果是子文档处理
    if (Xut.isRunSubDoc) {
        //通过Action动作激活的,需要到Action类中处理
        Xut.publish('subdoc:dropApp');
        return;
    }

    //正常逻辑
    outLock = true;

    Xut.Application.Suspend({

        /**
         * 停止热点动作
         * @return {[type]} [description]
         */
        dispose() {
            setTimeout(() => { outLock = false }, 100)
        },

        /**
         * 退出应用
         * @return {[type]} [description]
         */
        processed() {
            state === 'back' && Xut.Application.DropApp();
        }
    });
}

/**
 * 绑定控制案例事件
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export default function button(config) {
    /**
     * 存放绑定事件
     * @type {Object}
     */
    config._event = {

        /**
         * 回退键
         * @return {[type]} [description]
         */
        back() {
            //如果是预加载视频
            if (getPlugVideoState()) {
                closePlugVideo()
            } else {
                controller('back');
            }
        },

        /**
         * 暂停键
         * @return {[type]} [description]
         */
        pause() {
            controller('pause');
        }
    }
}

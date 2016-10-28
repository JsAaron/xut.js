import {
    getPlugVideoState,
    closePlugVideo
} from './app.video'

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
    window.GLOBALCONTEXT.navigator.notification.confirm('您确认要退出吗？',
        function(button) {
            if (1 == button) {
                Xut.Application.Stop({
                    processed() {
                        window.GLOBALCONTEXT.navigator.app.exitApp()
                    }
                })
            }
        },
        '退出', '确定,取消'
    )
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

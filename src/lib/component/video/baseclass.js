/**
 * 视频基础类
 */
export class BaseClass {

    constructor() {}

    /**
     * 播放
     * @return {[type]} [description]
     */
    play() {
        //隐藏工具栏
        Xut.View.Toolbar("hide");
        this._play();
    }

    /**
     * 停止
     * @return {[type]} [description]
     */
    stop() {
        //显示工具栏
        Xut.View.Toolbar("show");
        this._stop();
    }

    /**
     * 关闭
     * @return {[type]} [description]
     */
    close() {
        this._destroy()
    }

}

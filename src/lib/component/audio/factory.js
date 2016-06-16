
import { Action } from './action'
import { Subtitle } from './subtitle'

/**
 * 音频工厂类
 * @param {[type]} options [description]
 */
export class AudioFactory {
    constructor() {}

    //构建之前关数据
    preRelated(trackId, options) {
        //完成end后 外部回调删除这个对象
        //单独调用引用对象
        //传递一个 options.complete
        this.innerCallback = options.innerCallback;
        //仅运行一次
        //外部调用
        this.outerCallback = trackId == 9999 ? options.complete : null;
    }

    //构建之后关数据
    afterRelated(audio, options, controlDoms) {
        //音频重复播放次数
        if (options.data && options.data.repeat) {
            this.repeat = Number(options.data.repeat); //需要重复
        }
        //音频动作
        if (options.action) {
            this.acitonObj = Action(options);
        }
        //字幕对象
        if (options.subtitles && options.subtitles.length > 0) {
            //创建字幕对象
            this.subtitleObject = new Subtitle(audio, options, controlDoms);
        }

        //如果有外部回调处理
        if (this.outerCallback) {
            this.outerCallback.call(this);
        }

    }

    //运行成功失败后处理方法
    //phoengap会调用callbackProcess
    //导致乱了
    callbackProcess(sysCommand) {
        if (this.outerCallback) { //外部调用结束
            this.end();
        } else {
            //安卓没有重复播放
            //phonegap未处理
            if (!Xut.plat.isAndroid && this.repeat) {
                //如果需要重复
                this.repeatProcess();
            } else {
                //外部清理对象
                //audioManager中直接删当前对象
                this.innerCallback(this);
            }
        }
    }

    //重复处理
    repeatProcess() {
        --this.repeat;
        this.play()
    }

    //播放
    play() {
        //flash模式不执行
        if (this.audio && !this.isFlash) {
            this.status = 'playing';
            this.audio.play();
        }
        this.acitonObj && this.acitonObj.play();
    }

    //停止
    pause() {
        this.status = 'paused';
        this.audio.pause();
        this.acitonObj && this.acitonObj.pause();
    }

    //销毁
    end() {
        this.status = 'ended';
        this.audio.end();
        this.audio = null;
        this.acitonObj && this.acitonObj.destroy();
    }

    //相关
    destroyRelated() {
        //销毁字幕
        if (this.subtitleObject) {
            this.subtitleObject.destroy()
            this.subtitleObject = null;
        }
        //动作
        if (this.acitonObj) {
            this.acitonObj.destroy();
            this.acitonObj = null;
        }
    }
}

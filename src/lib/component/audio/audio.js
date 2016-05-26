/**
 * 音频播放
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */
import { Action } from './action'
import { Subtitle } from './subtitle'
import { hash } from '../../util/dom'

let Player = null
let noop = function () { }
let instance = hash() //存放不同音轨的一个实例
let html5Audio

/**
 * 音频工厂类
 * @param {[type]} options [description]
 */
var AudioFactory = Xut.CoreObject.extend({

    //构建之前关数据
    preRelated: function (trackId, options) {
        //完成end后 外部回调删除这个对象
        //单独调用引用对象
        //传递一个 options.complete
        this.innerCallback = options.innerCallback;
        //仅运行一次
        //外部调用
        this.outerCallback = trackId == 9999 ? options.complete : null;
    },

    //构建之后关数据
    afterRelated: function (audio, options, controlDoms) {
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

    },
    //运行成功失败后处理方法
    //phoengap会调用callbackProcess
    //导致乱了
    callbackProcess: function (sysCommand) {
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
    },

    //重复处理
    repeatProcess: function () {
        --this.repeat;
        this.play()
    },

    //播放
    play: function () {
        //flash模式不执行
        if (this.audio && !this.isFlash) {
            this.status = 'playing';
            this.audio.play();
        }
        this.acitonObj && this.acitonObj.play();
    },

    //停止
    pause: function () {
        this.status = 'paused';
        this.audio.pause();
        this.acitonObj && this.acitonObj.pause();
    },

    //销毁
    end: function () {
        this.status = 'ended';
        this.audio.end();
        this.audio = null;
        this.acitonObj && this.acitonObj.destroy();
    },

    //相关
    destroyRelated: function () {
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
});


/**
 * 使用PhoneGap的Media播放
 * @param  {string} url 路径
 * @return {[type]}      [description]
 */
var _Media = AudioFactory.extend({

    init: function (options, controlDoms) {

        var url = Xut.config.audioPath() + options.url,
            trackId = options.trackId,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        //音频成功与失败调用
        audio = new window.GLOBALCONTEXT.Media(url, function () {
            self.callbackProcess(true);
        }, function () {
            self.callbackProcess(true);
        });

        //autoplay
        this.audio = audio;
        this.trackId = trackId;
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    },
    //取反
    end: function () {
        if (this.audio) {
            this.audio.release();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
});


/**
 * 采用Falsh播放
 * @type {[type]}
 */
var _Flash = AudioFactory.extend({
    init: function (options, controlDoms) {
        var trackId = options.trackId,
            url = Xut.config.audioPath() + options.url,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        audio = new Audio5js({
            swf_path: './lib/data/audio5js.swf',
            throw_errors: true,
            format_time: true,
            ready: function (player) {
                this.load(url);
                //如果调用了播放
                this.play()
                self.status = "playing"
            }
        });

        this.audio = audio;
        this.trackId = trackId;
        this.status = 'playing';
        this.options = options;

        this.isFlash = true;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    },

    end: function () {
        if (this.audio) {
            this.audio.destroy();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
})


/**
 * 使用html5的audio播放
 * @param  {string} url    音频路径
 * @param  {object} options 可选参数
 * @return {object}         [description]
 */
var _Audio = AudioFactory.extend({
    init: function (options, controlDoms) {
        var trackId = options.trackId,
            url = Xut.config.audioPath() + options.url,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        if (instance[trackId]) {
            audio = Xut.fix.audio ? Xut.fix.audio : instance[trackId];
            audio.src = url;
        } else {
            //create a new Audio instance
            //如果为ios browser 用Xut.fix.audio 指定src 初始化见app.js
            if (Xut.fix.audio) {
                audio = Xut.fix.audio;
                audio.src = url;
            } else {
                audio = new Audio(url);
            }

            //更新音轨
            //妙妙学方式不要音轨处理
            if (!Xut.fix.audio) {
                instance[trackId] = audio;
            }

            audio.addEventListener('ended', function () {
                self.callbackProcess()
            }, false);

            audio.addEventListener('error', function () {
                self.callbackProcess()
            }, false);
        }

        this.audio = audio;
        this.trackId = trackId;
        this.status = 'playing';
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    },

    end: function () {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('ended', this.callbackProcess, false)
            this.audio.removeEventListener('error', this.callbackProcess, false)
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
})



var createUUID = function () {
    return UUIDcreatePart(4) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(6);
};

function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i = 0; i < length; i++) {
        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}


/**
 * 使用PhoneGap的 js直接调用 cordova Media播放
 * @param  {string} url 路径
 * @return {[type]}      [description]
 */
var _cordovaMedia = AudioFactory.extend({

    init: function (options, controlDoms) {

        var url = Xut.config.audioPath() + options.url,
            trackId = options.trackId,
            self = this,
            audio;

        this.id = createUUID();

        //构建之前处理
        this.preRelated(trackId, options);

        var audio = {
            startPlayingAudio: function () {
                window.audioHandler.startPlayingAudio(self.id, url)
            },
            pausePlayingAudio: function () {
                window.audioHandler.pausePlayingAudio(self.id)
            },
            release: function () {
                window.audioHandler.release(self.id)
            },
            /**
             * 扩充，获取位置
             * @return {[type]} [description]
             */
            expansionCurrentPosition: function () {
                return window.getCurrentPosition(self.id)
            }
        }

        //autoplay
        this.audio = audio;
        this.trackId = trackId;
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    },

    //播放
    play: function () {
        if (this.audio) {
            this.status = 'playing';
            this.audio.startPlayingAudio();
        }
        this.acitonObj && this.acitonObj.play();
    },

    //停止
    pause: function () {
        this.status = 'paused';
        this.audio && this.audio.pausePlayingAudio();
        this.acitonObj && this.acitonObj.pause();
    },


    //结束
    end: function () {
        if (this.audio) {
            this.audio.release();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
});



/**
 * 检测是否支持HTML5的audio播放
 * @param  {[type]} success [description]
 * @param  {[type]} fail    [description]
 * @return {[type]}         [description]
 */
function supportAudio(fail) {
    try {
        var audio = new Audio("lib/data/support.mp3");
        //如果错误
        audio.addEventListener('error', function (e) {
            audio = null;
            fail()
        }, false);
    } catch (er) { }
};


//apk的情况下
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
    html5Audio = _Media;
} else {

    //妙妙学的 客户端浏览器模式
    if (window.MMXCONFIG && window.audioHandler) {
        html5Audio = _cordovaMedia;
    } else {
        //pc
        html5Audio = _Audio;
    }

    //2015.12.23
    //如果不支持audio改用flash
    // supportAudio(function() {
    //     Xut.Audio = _Flash;
    // });
}

Xut.Audio = html5Audio



export {
html5Audio
}

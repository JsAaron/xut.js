/**
 * 音频播放
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */
import { hash } from '../../util/dom'
import { AudioFactory } from './factory'

let Player = null
let noop = function() {}
let instance = hash() //存放不同音轨的一个实例
let audioPlayer


let createUUID = () => {
    return UUIDcreatePart(4) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(6);
};


let UUIDcreatePart = (length) => {
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
 * 检测是否支持HTML5的audio播放
 * @param  {[type]} success [description]
 * @param  {[type]} fail    [description]
 * @return {[type]}         [description]
 */
let supportAudio = (fail) => {
    try {
        var audio = new Audio("lib/data/support.mp3");
        //如果错误
        audio.addEventListener('error', function(e) {
            audio = null;
            fail()
        }, false);
    } catch (er) {}
}


/**
 * 使用PhoneGap的Media播放
 * @param  {string} url 路径
 * @return {[type]}      [description]
 */
class _Media extends AudioFactory {

    constructor(options, controlDoms) {
        super()

        var url = Xut.config.audioPath() + options.url,
            trackId = options.trackId,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        //音频成功与失败调用
        audio = new window.GLOBALCONTEXT.Media(url, function() {
            self.callbackProcess(true);
        }, function() {
            self.callbackProcess(true);
        });

        //autoplay
        this.audio = audio;
        this.trackId = trackId;
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    }

    //取反
    end() {
        if (this.audio) {
            this.audio.release();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
}


/**
 * 采用Falsh播放
 * @type {[type]}
 */
class _Flash extends AudioFactory {

    constructor(options, controlDoms) {
        super()
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
            ready: function(player) {
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
    }

    end() {
        if (this.audio) {
            this.audio.destroy();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
}


/**
 * 使用html5的audio播放
 * @param  {string} url    音频路径
 * @param  {object} options 可选参数
 * @return {object}         [description]
 */
class _Audio extends AudioFactory {

    constructor(options, controlDoms) {
        super()
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

            audio.addEventListener('ended', function() {
                self.callbackProcess()
            }, false);

            audio.addEventListener('error', function() {
                self.callbackProcess()
            }, false);
        }

        this.audio = audio;
        this.trackId = trackId;
        this.status = 'playing';
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    }

    end() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('ended', this.callbackProcess, false)
            this.audio.removeEventListener('error', this.callbackProcess, false)
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
}


/**
 * 使用PhoneGap的 js直接调用 cordova Media播放
 * @param  {string} url 路径
 * @return {[type]}      [description]
 */
class _cordovaMedia extends AudioFactory {

    constructor(options, controlDoms) {
        super()
        var url = Xut.config.audioPath() + options.url,
            trackId = options.trackId,
            self = this,
            audio;

        this.id = createUUID();

        //构建之前处理
        this.preRelated(trackId, options);

        var audio = {
            startPlayingAudio: function() {
                window.audioHandler.startPlayingAudio(self.id, url)
            },
            pausePlayingAudio: function() {
                window.audioHandler.pausePlayingAudio(self.id)
            },
            release: function() {
                window.audioHandler.release(self.id)
            },
            /**
             * 扩充，获取位置
             * @return {[type]} [description]
             */
            expansionCurrentPosition: function() {
                return window.getCurrentPosition(self.id)
            }
        }

        //autoplay
        this.audio = audio;
        this.trackId = trackId;
        this.options = options;

        //相关数据
        this.afterRelated(audio, options, controlDoms);
    }

    //播放
    play() {
        if (this.audio) {
            this.status = 'playing';
            this.audio.startPlayingAudio();
        }
        this.acitonObj && this.acitonObj.play();
    }

    //停止
    pause() {
        this.status = 'paused';
        this.audio && this.audio.pausePlayingAudio();
        this.acitonObj && this.acitonObj.pause();
    }


    //结束
    end() {
        if (this.audio) {
            this.audio.release();
            this.audio = null;
        }
        this.status = 'ended';
        this.destroyRelated();
    }
}


//安卓客户端apk的情况下
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
    audioPlayer = _Media;
} else {
    //妙妙学的 客户端浏览器模式
    if (window.MMXCONFIG && window.audioHandler) {
        audioPlayer = _cordovaMedia;
    } else {
        //pc
        audioPlayer = _Audio;
    }
    //2015.12.23
    //如果不支持audio改用flash
    // supportAudio(function() {
    //     Xut.Audio = _Flash;
    // });
}


export {
    audioPlayer

}

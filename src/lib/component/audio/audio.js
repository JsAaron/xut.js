/**
 * 音频播放
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */
import { hash } from '../../util/lang'
import { config } from '../../config/index'
import { BaseClass } from './baseclass'
import { hasAudioes, getAudio } from './fix'


let Player = null
const noop = function() {}
let instance = hash() //存放不同音轨的一个实例
let audioPlayer
const plat = Xut.plat


let UUIDcreatePart = (length) => {
    let uuidpart = ""
    let uuidchar
    for (let i = 0; i < length; i++) {
        uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}


let createUUID = () => [4, 2, 2, 2, 6].map(UUIDcreatePart).join('-')


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
class _Media extends BaseClass {

    constructor(options, controlDoms) {
        super()

        var url = config.audioPath() + options.url,
            trackId = options.trackId,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        //音频成功与失败调用
        audio = new window.GLOBALCONTEXT.Media(url, () => {
            self.callbackProcess(true);
        }, () => {
            self.callbackProcess(true);
        })

        //autoplay
        this.audio = audio;
        this.trackId = trackId;
        this.options = options;

        //相关数据
        this.afterRelated(options, controlDoms)

        this.play()
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */
    getAudioTime(callback) {
        this.audio.getCurrentPosition((position) => {
            let audioTime
            position = position * 1000;
            if (!this.changeValue) {
                this.changeValue = position
            }
            position -= this.changeValue;
            if (position > -1) {
                audioTime = Math.round(position);
            }
            callback(audioTime)
        }, (e) => {
            console.log("error:" + e);
            //出错继续检测
            callback()
        })
    }

    /**
     * 取反
     * @return {[type]} [description]
     */
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
class _Flash extends BaseClass {

    constructor(options, controlDoms) {
        super()
        var trackId = options.trackId,
            url = config.audioPath() + options.url,
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
        this.afterRelated(options, controlDoms);
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */
    getAudioTime(callback) {
        callback(Math.round(this.audio.audio.audio.currentTime * 1000))
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
 * 采用_Audio5js播放
 * @type {[type]}
 */
class _Audio5js extends BaseClass {

    constructor(options, controlDoms) {
        super()
        var trackId = options.trackId,
            url = config.audioPath() + options.url,
            self = this,
            audio;

        //构建之前处理
        this.preRelated(trackId, options);

        audio = new Audio5js({
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

        //相关数据
        this.afterRelated(options, controlDoms);
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */
    getAudioTime(callback) {
        callback(Math.round(this.audio.audio.audio.currentTime * 1000))
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
class _Audio extends BaseClass {

    constructor(options, controlDoms) {
        super()

        let trackId = options.trackId
        let url = config.audioPath() + options.url
        let audio
        let self = this

        let replaceAudio = hasAudioes()

        //构建之前处理
        this.preRelated(trackId, options);

        if (instance[trackId]) {
            audio = replaceAudio ? getAudio() : instance[trackId];
            audio.src = url;
        } else {

            //create a new Audio instance
            //如果为ios browser 用Xut.fix.audioes 指定src 初始化见app.js
            if (replaceAudio) {
                audio = getAudio();
                audio.src = url;
            } else {
                audio = new Audio(url);
            } 
 
            //更新音轨
            //妙妙学方式不要音轨处理
            if (!replaceAudio) {
                instance[trackId] = audio;
            }

        }

        this._callback = () => {
            self.callbackProcess()
        }

        this._throughCallback = () => {
            self.play()
        }

        /**
         * safari 自动播放
         * 手机浏览器需要加
         * 2016.8.26
         * @type {Boolean}
         */
        audio.autoplay = true

        audio.addEventListener('canplaythrough', this._throughCallback, false)
        audio.addEventListener('ended', this._callback, false)
        audio.addEventListener('error', this._callback, false)

        this.audio = audio;
        this.trackId = trackId;
        this.status = 'playing';
        this.options = options;

        //相关数据
        this.afterRelated(options, controlDoms)
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */
    getAudioTime(callback) {
        callback(Math.round(this.audio.currentTime * 1000))
    }

    end() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('canplaythrough', this._throughCallback, false)
            this.audio.removeEventListener('ended', this._callback, false)
            this.audio.removeEventListener('error', this._callback, false)
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
class _cordovaMedia extends BaseClass {

    constructor(options, controlDoms) {
        super()
        var url = config.audioPath() + options.url,
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
        this.afterRelated(options, controlDoms)

        this.play()
    }


    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */
    getAudioTime(callback) {
        callback(Math.round(this.audio.expansionCurrentPosition() * 1000))
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
if (plat.isAndroid && !plat.isBrowser) {
    audioPlayer = _Media
} else {
    //妙妙学的 客户端浏览器模式
    if (window.MMXCONFIG && window.audioHandler) {
        audioPlayer = _cordovaMedia
    } else {

        //安卓 && ios手机端
        //用纯video 因为 safari要加autoplay
        if (plat.noAutoPlayMedia) {
            audioPlayer = _Audio
        } else {
            //特殊情况
            //有客户端的内嵌浏览器模式
            audioPlayer = _Audio5js
        }

    }
    //2015.12.23
    //如果不支持audio改用flash
    // supportAudio(function() {
    //     Xut.Audio = Flash;
    // });
}


export {
    audioPlayer
}

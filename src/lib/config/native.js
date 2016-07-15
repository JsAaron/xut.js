import sourceUrl from './common'

let isIOS = Xut.plat.isIOS
let isAndroid = Xut.plat.isAndroid


//杂志直接打开
const nativeConf = {

    /**
     * 资源图片
     * @return {[type]} [description]
     */
    resources(config) {
        if (isIOS) {
            return sourceUrl
        }
        if (isAndroid) {
            if (parseInt(config.storageMode)) {
                //sd卡加载资源数据
                return "/sdcard/appcarrier/magazine/" + config.appId + "/" + sourceUrl;
            } else {
                //android_asset缓存加载资源
                return "/android_asset/www/" + sourceUrl;
            }
        }
    },

    /**
     * 视频路径
     * ios平台在缓存
     * 安卓在编译raw中
     */
    video() {
        if (isIOS) {
            return sourceUrl;
        }
        if (isAndroid) {
            return 'android.resource://#packagename#/raw/';
        }
    },

    /**
     * 音频路径
     * ios平台在缓存
     * 安卓在缓存中
     * @return {[type]} [description]
     */
    audio() {
        if (isIOS) {
            return sourceUrl;
        }
        if (isAndroid) {
            return "/android_asset/www/" + sourceUrl;
        }
    },

    /**
     * 读取svg路径前缀
     * @return {[type]} [description]
     */
    svg() {
        return 'www/' + sourceUrl;
    }
}



export default nativeConf

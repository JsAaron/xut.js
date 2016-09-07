import { sourcePath, widgetPath } from './default'

const isIOS = Xut.plat.isIOS
const isAndroid = Xut.plat.isAndroid


//杂志直接打开
export default {

    /**
     * 资源图片
     * @return {[type]} [description]
     */
    resources(config) {
        if (isIOS) {
            return sourcePath
        }
        if (isAndroid) {
            if (parseInt(config.storageMode)) {
                //sd卡加载资源数据
                return "/sdcard/appcarrier/magazine/" + config.appId + "/" + sourcePath;
            } else {
                //android_asset缓存加载资源
                return "/android_asset/www/" + sourcePath;
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
            return sourcePath;
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
            return sourcePath;
        }
        if (isAndroid) {
            return "/android_asset/www/" + sourcePath;
        }
    },

    /**
     * 读取svg路径前缀
     * @return {[type]} [description]
     */
    svg() {
        return 'www/' + sourcePath;
    },

    /**
     * js零件
     * 2016.8.3 喵喵学
     * @return {[type]} [description]
     */
    jsWidget() {
        if (isIOS) {
            return widgetPath
        }
        if (isAndroid) {
            return "/android_asset/www/" + widgetPath;
        }
    }
}



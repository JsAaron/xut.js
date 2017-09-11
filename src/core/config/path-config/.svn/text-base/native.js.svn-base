import { getWidgetPath, getSourcePath } from './browser'

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
        return getSourcePath()
      }
      if (isAndroid) {
        if (parseInt(config.launch.storageMode)) {
          //sd卡加载资源数据
          return "/sdcard/appcarrier/magazine/" + config.data.appId + "/" + getSourcePath();
        } else {
          //android_asset缓存加载资源
          return "/android_asset/www/" + getSourcePath();
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
        return getSourcePath();
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
        return getSourcePath();
      }
      if (isAndroid) {
        return "/android_asset/www/" + getSourcePath();
      }
    },

    /**
     * 读取svg路径前缀
     * @return {[type]} [description]
     */
    svg() {
      return 'www/' + getSourcePath();
    },

    /**
     * js零件
     * 2016.8.3 喵喵学
     * @return {[type]} [description]
     */
    jsWidget() {
      if (isIOS) {
        return getWidgetPath()
      }
      if (isAndroid) {
        return "/android_asset/www/" + getWidgetPath();
      }
    }
}

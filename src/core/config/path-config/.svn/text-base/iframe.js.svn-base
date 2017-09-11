import { getSourcePath } from './browser'

const isIOS = Xut.plat.isIOS
const isAndroid = Xut.plat.isAndroid
const DUKUCONFIG = window.DUKUCONFIG
const MMXCONFIG = window.MMXCONFIG
const CLIENTCONFIGT = window.CLIENTCONFIGT
const SUbCONFIGT = window.SUbCONFIGT

/**
 * 读酷模式下的路径
 * @param  {[type]} DUKUCONFIG [description]
 * @return {[type]}                   [description]
 */
if (DUKUCONFIG) {
  DUKUCONFIG.path = DUKUCONFIG.path.replace('//', '/')
}

/**
 * 除右端的"/"
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const rtrim = function (str) {
  if (typeof str != 'string') return str;
  var lastIndex = str.length - 1;
  if (str.charAt(lastIndex) === '/') {
    return str.substr(0, lastIndex)
  } else {
    return str;
  }
}


// var MMXCONFIGPath = '.'
// if (MMXCONFIG && MMXCONFIG.path) {
//     MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
// }
let MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
if (MMXCONFIG && MMXCONFIG.path) {
  MMXCONFIGPath = rtrim(MMXCONFIG.path)
}


/**
 *  通过iframe加载判断当前的加载方式
 *  1 本地iframe打开子文档
 *  2 读酷加载电子杂志
 *  3 读酷加载电子杂志打开子文档
 */
const iframeMode = (() => {
  let mode;
  if (SUbCONFIGT && DUKUCONFIG) {
    //通过读酷客户端开打子文档方式
    mode = 'iframeDuKuSubDoc'
  } else {
    //子文档加载
    if (SUbCONFIGT) {
      mode = 'iframeSubDoc'
    }
    //读酷客户端加载
    if (DUKUCONFIG) {
      mode = 'iframeDuKu'
    }
    //客户端模式
    //通过零件加载
    if (CLIENTCONFIGT) {
      mode = 'iframeClient'
    }
    //秒秒学客户端加载
    if (MMXCONFIG) {
      mode = 'iframeMiaomiaoxue'
    }
  }
  return mode;
})()


//iframe嵌套配置
//1 新阅读
//2 子文档
//3 秒秒学
export default {


  /**
   * 资源图片
   * @return {[type]} [description]
   */
  resources() {
      if (isIOS) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return getSourcePath();
          case 'iframeDuKuSubDoc':
            return getSourcePath();
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }

      if (isAndroid) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeDuKuSubDoc':
            return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }
    },


    /**
     * 视频路径
     * @return {[type]} [description]
     */
    video() {
      if (isIOS) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return getSourcePath()
          case 'iframeDuKuSubDoc':
            return getSourcePath();
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }

      if (isAndroid) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return 'android.resource://#packagename#/raw/';
          case 'iframeDuKuSubDoc':
            return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }
    },


    /**
     * 音频路径
     * @return {[type]} [description]
     */
    audio() {
      if (isIOS) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return getSourcePath();
          case 'iframeDuKuSubDoc':
            return getSourcePath();
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }
      if (isAndroid) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeDuKuSubDoc':
            return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }
    },


    /**
     * 调用插件处理
     * @return {[type]} [description]
     */
    svg() {
      if (isIOS) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            //www/content/subdoc/00c83e668a6b6bad7eda8eedbd2110ad/content/gallery/
            return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeDuKuSubDoc':
            return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }

      if (isAndroid) {
        switch (iframeMode) {
          case 'iframeDuKu':
            return DUKUCONFIG.path;
          case 'iframeSubDoc':
            return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeDuKuSubDoc':
            return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
          case 'iframeClient':
            return CLIENTCONFIGT.path;
          case 'iframeMiaomiaoxue':
            return MMXCONFIGPath + '/content/gallery/';
        }
      }
    },


    /**
     * js零件
     * 2016.8.3 喵喵学
     * @return {[type]} [description]
     */
    jsWidget() {
      return MMXCONFIGPath + '/content/widget/'
    }

}


import common from './common'

let sourceUrl = common.sourceUrl
let isIOS = Xut.plat.isIOS
let isAndroid = Xut.plat.isAndroid


/**
 * 读酷模式下的路径
 * @param  {[type]} window.DUKUCONFIG [description]
 * @return {[type]}                   [description]
 */
if (window.DUKUCONFIG) {
    window.DUKUCONFIG.path = window.DUKUCONFIG.path.replace('//', '/')
}

/**
 * 除右端的"/"
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
var rtrim = function(str) {
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
var MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
if (window.MMXCONFIG && window.MMXCONFIG.path) {
    MMXCONFIGPath = rtrim(window.MMXCONFIG.path)
}


/**
 *  通过iframe加载判断当前的加载方式
 *  1 本地iframe打开子文档
 *  2 读酷加载电子杂志
 *  3 读酷加载电子杂志打开子文档
 */
let iframeMode = (() => {
    let mode;
    if (window.SUbCONFIGT && window.DUKUCONFIG) {
        //通过读酷客户端开打子文档方式
        mode = 'iframeDuKuSubDoc'
    } else {
        //子文档加载
        if (window.SUbCONFIGT) {
            mode = 'iframeSubDoc'
        }
        //读酷客户端加载
        if (window.DUKUCONFIG) {
            mode = 'iframeDuKu'
        }
        //客户端模式
        //通过零件加载
        if (window.CLIENTCONFIGT) {
            mode = 'iframeClient'
        }
        //秒秒学客户端加载
        if (window.MMXCONFIG) {
            mode = 'iframeMiaomiaoxue'
        }
    }
    return mode;
})()


//iframe嵌套配置
//1 新阅读
//2 子文档
//3 秒秒学
const iframeConf = {

    /**
     * 资源图片
     * @return {[type]} [description]
     */
    resources() {
        if (isIOS) {
            switch (iframeMode) {
                case 'iframeDuKu':
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return sourceUrl;
                case 'iframeDuKuSubDoc':
                    return sourceUrl;
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
                case 'iframeMiaomiaoxue':
                    return MMXCONFIGPath + '/content/gallery/';
            }
        }

        if (isAndroid) {
            switch (iframeMode) {
                case 'iframeDuKu':
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return '/android_asset/www/content/subdoc/' + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeDuKuSubDoc':
                    return window.DUKUCONFIG.path.replace('gallery', 'subdoc') + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
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
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return sourceUrl
                case 'iframeDuKuSubDoc':
                    return sourceUrl;
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
                case 'iframeMiaomiaoxue':
                    return MMXCONFIGPath + '/content/gallery/';
            }
        }

        if (isAndroid) {
            switch (iframeMode) {
                case 'iframeDuKu':
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return 'android.resource://#packagename#/raw/';
                case 'iframeDuKuSubDoc':
                    return window.DUKUCONFIG.path.replace('gallery', 'subdoc') + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
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
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return sourceUrl;
                case 'iframeDuKuSubDoc':
                    return sourceUrl;
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
                case 'iframeMiaomiaoxue':
                    return MMXCONFIGPath + '/content/gallery/';
            }
        }
        if (isAndroid) {
            switch (iframeMode) {
                case 'iframeDuKu':
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return '/android_asset/www/content/subdoc/' + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeDuKuSubDoc':
                    return window.DUKUCONFIG.path.replace('gallery', 'subdoc') + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
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
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    //www/content/subdoc/00c83e668a6b6bad7eda8eedbd2110ad/content/gallery/
                    return 'www/content/subdoc/' + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeDuKuSubDoc':
                    return window.DUKUCONFIG.path.replace('gallery', 'subdoc') + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
                case 'iframeMiaomiaoxue':
                    return MMXCONFIGPath + '/content/gallery/';
            }
        }

        if (isAndroid) {
            switch (iframeMode) {
                case 'iframeDuKu':
                    return window.DUKUCONFIG.path;
                case 'iframeSubDoc':
                    return 'www/content/subdoc/' + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeDuKuSubDoc':
                    return window.DUKUCONFIG.path.replace('gallery', 'subdoc') + window.SUbCONFIGT.path + '/content/gallery/';
                case 'iframeClient':
                    return window.CLIENTCONFIGT.path;
                case 'iframeMiaomiaoxue':
                    return MMXCONFIGPath + '/content/gallery/';
            }
        }
    }

}



export default iframeConf
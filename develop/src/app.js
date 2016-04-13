
import {init} from './init/index'


/**
 * 应用入口
 * @return {[type]} [description]
 */
Xut.app = function() {

    //更新版本号记录
    Xut.Version = 779;

    /**
     * 动态html文件挂载点
     * 用于content动态加载js文件
     * @type {Object}
     */
    window.HTMLCONFIG = {}

    /**
     * 2015.10.19新增
     * ibooks处理
     */
    var IBOOKSCONFIG = window.IBOOKSCONFIG;

    //如果是IBOOS模式处理
    //注入保持与数据库H5查询一致
    if (IBOOKSCONFIG && IBOOKSCONFIG.data) {
        _.each(IBOOKSCONFIG.data, function(data, tabName) {
                data.item = function(index) {
                    return this[index];
                }
            })
            //ios上的ibooks模式
            //直接修改改isBrowser模式
        Xut.plat.isBrowser = true;
        Xut.plat.isIOS = false;
    }

    //配置ibooks参数
    Xut.IBooks = {

        /**
         * 当前页面编号
         * @return {[type]} [description]
         */
        pageIndex: function() {
            if (IBOOKSCONFIG) {
                //当期页面索引1开始
                return IBOOKSCONFIG.pageIndex + 1;
            }
        }(),

        /**
         * 是否存在svg
         * @type {[type]}
         */
        existSvg: IBOOKSCONFIG ? IBOOKSCONFIG.existSvg : false,

        /**
         * 是否启动了ibooks模式
         * @return {[type]} [description]
         */
        Enabled: function() {
            return IBOOKSCONFIG ? true : false;
        }(),

        /**
         * 全部对象
         * @type {[type]}
         */
        CONFIG: IBOOKSCONFIG,

        /**
         * 运行期间
         * @return {[type]} [description]
         */
        runMode: function() {
            //确定为ibooks的运行状态
            //而非预编译状态
            if (IBOOKSCONFIG && !IBOOKSCONFIG.compiled) {
                return true;
            }
            return false;
        },
        /**
         * 编译期间
         * @return {[type]} [description]
         */
        compileMode: function() {
            //确定为ibooks的编译状态
            //而非预编译状态
            if (IBOOKSCONFIG && IBOOKSCONFIG.compiled) {
                return true;
            }
            return false;
        }
    }


    //修复ios 安卓浏览器不能自动播放音频的问题 
    //在加载时创建新的audio.video 用的时候更换
    Xut.fix = Xut.fix || {};

    //移动端浏览器平台
    if (Xut.plat.isBrowser && (Xut.plat.isIOS || Xut.plat.isAndroid)) {
        var fixaudio = function() {
            if (!Xut.fix.audio) {
                Xut.fix.audio = new Audio();
                Xut.fix.video = document.createElement("Video");
                document.removeEventListener('touchstart', fixaudio, false);
            }
        };
        document.addEventListener('touchstart', fixaudio, false);
    }


    init();
}
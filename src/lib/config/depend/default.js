/**
 * 数据配置
 */
export default {

    /**
     * 支持电子在在线阅读,向服务端取数据
     * 自定义配置地址即可'
     * @type {String}
     */
    onlineModeUrl: 'lib/data/database.php',

    /**
     * 2016.7.26
     * 读酷增加强制插件模式
     * [isPlugin description]
     * @type {Boolean}
     */
    isPlugin: window.DUKUCONFIG && Xut.plat.isIOS,

    /**
     * 数据库名
     * @type {[type]}
     */
    dbName: window.xxtmagzinedbname || 'magazine',

    /**
     * 存储模式
     * 0 APK应用本身
     * 1 外置SD卡
     */
    storageMode: 0,

    /**
     * 应用路径唯一标示
     * @type {[type]}
     */
    appId: null,

    /**
     * 资源路径
     * @type {[type]}
     */
    pathAddress: null

}

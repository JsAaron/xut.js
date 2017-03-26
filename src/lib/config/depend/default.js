/**
 * 数据配置
 */
export default {

  data: {
    /**
     * 数据库尺寸
     */
    dbSize: 1,

    /**
     * 应用路径唯一标示
     */
    appId: null,

    /**
     * 数据库名
     */
    dbName: window.xxtmagzinedbname || 'magazine',

    /**
     * 支持电子在在线阅读,向服务端取数据
     * 自定义配置地址即可'
     * @type {String}
     */
    onlineModeUrl: 'lib/data/database.php',

    /**
     * 资源路径
     * @type {[type]}
     */
    pathAddress: null
  },

  /**
   * 2016.7.26
   * 读酷增加强制插件模式
   * [isPlugin description]
   * @type {Boolean}
   */
  isPlugin: window.DUKUCONFIG && Xut.plat.isIOS
}

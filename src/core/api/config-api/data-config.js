////////////////////////
///   数据配置接口文件
////////////////////////

export default {

  /**
   * 应用novelId
   * @type {[type]}
   */
  novelId:null,

  /**
   * 应用页码索引
   * @type {[type]}
   */
  pageIndex:null,

  /**
   * 数据库尺寸
   */
  dbSize: 1,

  /**
   * 应用路径唯一标示
   */
  appId: null,

  /**
   * 默认图标高度
   */
  iconHeight: Xut.plat.isIphone ? 32 : 44,

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
}

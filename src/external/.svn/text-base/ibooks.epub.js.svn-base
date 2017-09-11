/**************************
 *
 *   epub新增加
 *   需要调用2次
 *   一次是因为打包的关系，全局加载
 *   二次是 实际epub模式加载
 *
 * *************************/

/**
 * 动态html文件挂载点
 * 用于content动态加载js文件
 * 目前暂时给epub使用，文本框
 * @type {Object}
 */
window.HTMLCONFIG = {}


/**
 *
 * 2015.10.19新增
 * ibooks处理
 * epub ibooks模式的配置文件
 * 这个是在index.html中会传入几个值
 *
 *   window.IBOOKSCONFIG = {
 *       compiled: true,
 *       pageIndex: 1,
 *       existSvg: true,
 *       screenSize: {
 *           "width": 718,
 *           "height": 958
 *       }
 *   }
 */
var IBOOKSCONFIG = window.IBOOKSCONFIG;

//如果是IBOOS模式处理
//注入保持与数据库H5查询一致
if(IBOOKSCONFIG && IBOOKSCONFIG.data) {
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
    if(IBOOKSCONFIG) {
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
    if(IBOOKSCONFIG && !IBOOKSCONFIG.compiled) {
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
    if(IBOOKSCONFIG && IBOOKSCONFIG.compiled) {
      return true;
    }
    return false;
  }
};
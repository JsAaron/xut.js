/**
 * 判断加载环境 是否嵌套iframe
 * 1 单独杂志
 * 2 读库客户端
 * 3 妙妙学客户端
 * 4 新阅读客户端
 * 5 子文档模式
 * ........
 *
 * GLOBALCONTEXT 插件全局调用接口
 * GLOBALIFRAME  是否iframe加载
 *
 *
 *提供给iframe内的配置文件
 *
 *  window.XXTIFRAME = {
 *       path: "sdcard/" + config.data.appId + "/content/gallery/",
 *       iframeDrop: function () {
 *            //iframe退出的处理方法
 *       }
 *   }
 *
 */
;
(function(CONFIG) {

  //上文环境
  //1 新阅读
  //2 子文档
  //3 本身
  //插件的上下文永远是GLOBALCONTEXT调用
  window.GLOBALCONTEXT = CONFIG.context; //全局上下文(兼容iframe父容器与本身执行环境)
  window.GLOBALIFRAME = CONFIG.iframeMode; //是否为iframe加载

  //读酷配置文件
  window.DUKUCONFIG = CONFIG.dukuConfig;
  //await
  //path
  //ifrmeDrop

  //嵌套子文档上下文
  window.SUbDOCCONTEXT = CONFIG.subContext;
  window.SUbCONFIGT = CONFIG.subConfig;

  //2014.11.26
  //新客户端模式Client
  //地址:url
  //ifrmeDrop
  //path
  //success
  window.CLIENTCONFIGT = CONFIG.clientConfig;

  //2015.3.11
  //秒秒学客户端配置
  window.MMXCONFIG = CONFIG.mmxConfig;

})(function() {

  //是否为iframe加载
  var iframeMode = false

  //最外层上下文
  var topContext = window

  //读库配置文件
  var dukuConfig

  //客户端配置文件
  var clientConfig

  //秒秒学客户端配置文件
  var mmxConfig

  //子容器上下文
  var subContext

  //子文档模式
  var subConfig


  //兼容ios处理
  //妙妙客户端版处理问题ios版
  try {
    if(top && top.audioHandler) {
      window.audioHandler = top.audioHandler
    }
  } catch(err) {}


  var match = {

    /**
     * 读库iframe加载
     */
    XXTIFRAME: function(context) {
      dukuConfig = context.XXTIFRAME
      topContext = context
      iframeMode = true
    },

    /**
     * 秒秒学在线客户端加载
     * @return {[type]} [description]
     */
    miaomiaoxue: function(context) {
      mmxConfig = context.miaomiaoxue
      topContext = context
      iframeMode = true
    },

    /**
     * 子文档加载
     */
    XXTSUbDOC: function(context) {
      if(!topContext) {
        topContext = context;
      }
      subContext = context;
      iframeMode = true;
      subConfig = context.XXTSUbDOC
    },

    /**
     * 客户端模式
     * 零件动态加载iframe
     */
    XXTClient: function(context) {
      clientConfig = context.XXTClient
      topContext = context;
      iframeMode = true;
    },

    /**
     * pc调试模式
     * @return {[type]} [description]
     */
    iframe: function() {
      if(!iframeMode) {
        iframeMode = true
      }
    }
  }


  /**
   * 匹配配置文件
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  var scopeMatch = function(context) {
    try {
      if(!context) return;
      'XXTIFRAME,miaomiaoxue,XXTSUbDOC,XXTClient,iframe'.split(',').forEach(function(name) {
        context[name] && match[name](context)
      })
    } catch(er) {}
  }

  //搜索2层作用域
  //1 top
  //2 parent
  scopeMatch(parent)
  //嵌套iframe
  if(parent != top) {
    scopeMatch(top)
  }

  return {
    context: topContext,
    iframeMode: iframeMode,
    subContext: subContext,
    dukuConfig: dukuConfig,
    mmxConfig: mmxConfig,
    clientConfig: clientConfig,
    subConfig: subConfig
  }
}());
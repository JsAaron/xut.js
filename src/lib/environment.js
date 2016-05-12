//===========判断加载环境 是否嵌套iframe
//
//   1 单独杂志
//   2 新阅读加载
//   3 子文档加载
//   4 客户端模式  add 2014.11.26 
//   
//   GLOBALCONTEXT 插件全局调用接口
//   GLOBALIFRAME  是否iframe加载
//
//
//   //提供给iframe内的配置文件
//   window.XXTIFRAME = {
//       path: "sdcard/" + config.appId + "/content/gallery/",
//       iframeDrop: function () {
//            //iframe退出的处理方法
//       }
//   }
		
//常量
;(function(top) {

	//上文环境
	//1 新阅读
	//2 子文档
	//3 本身
	//插件的上下文永远是GLOBALCONTEXT调用
	window.GLOBALCONTEXT = top.context;  //全局上下文(兼容iframe父容器与本身执行环境)
	window.GLOBALIFRAME  = top.iframeMode;   //是否为iframe加载

	//读酷配置文件
	window.DUKUCONFIG    = top.dukuConfig;
	//await
	//path
	//ifrmeDrop

	//嵌套子文档上下文
	window.SUbDOCCONTEXT = top.subContext;
	window.SUbCONFIGT    = top.subConfig;

	//2014.11.26
	//新客户端模式Client
	//地址:url
	//ifrmeDrop
	//path
	//success
	window.CLIENTCONFIGT = top.clientConfig;

	//2015.3.11
	//秒秒学客户端配置
	window.MMXCONFIG = top.mmxConfig;
 
})(function() {

	var iframeMode = false, //是否为iframe加载
		topGlobal, //最外层上下文
		dukuConfig, //读库配置文件
		clientConfig, //客户端配置文件
		mmxConfig, // 秒秒学客户端配置文件
		subContext, //子容器上下
		subConfig; //子文档模式


	//兼容ios处理
	//妙妙客户端版处理问题ios版
    if (top && top.audioHandler) {
        audioHandler = top.audioHandler;
    }


	function testPalt(context){
		try {
			//如果是读库iframe加载
			if (context && context.XXTIFRAME) {
				dukuConfig = context.XXTIFRAME; //取出配置配置文件
				topGlobal  = context;
				iframeMode = true;
			}

			//如果是子文档加载
			if (context && context.XXTSUbDOC) {
				if (!topGlobal) {
					topGlobal = context;
				}
				subContext = context;
				iframeMode = true;
				subConfig  = context.XXTSUbDOC; //取出配置配置文件
			}

			//如果是客户端模式
			//通过零件动态加载iframe
			if (context && context.XXTClient) {
				clientConfig = context.XXTClient; //取出配置配置文件
				topGlobal    = context;
				iframeMode   = true;
			}

			//pc调试模式
			if(!iframeMode && context.iframe){
				iframeMode = true;
			}

			//如果是秒秒学在线客户端加载
			if(context && context.miaomiaoxue){
				mmxConfig  = context.miaomiaoxue
				topGlobal  = context;
				iframeMode = true;
			}
		} catch (er) {

		}		
	}

	//搜索2层作用域
	//1 top
	//2 parent
	testPalt(parent)
	testPalt(top)

	return {
		context      : topGlobal || window,
		iframeMode   : iframeMode,
		subContext   : subContext,
		dukuConfig   : dukuConfig,
		mmxConfig    : mmxConfig,
		clientConfig : clientConfig,
		subConfig    : subConfig
	};
}());
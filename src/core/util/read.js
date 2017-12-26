////////////////////////
///  获取文件的内容
///  1 js
///  2 svg->js
///  3 IBooks
///  4 PHP请求 => svg
///  5 插件    => svg
///////////////////////

import { loadFile } from './loader/file'
import { config } from '../config/index'

/**
 * 随机Url地址
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function randomUrl(url) {
  /*启动了预览，就必须要要缓存*/
  if (config.launch.preload) {
    return url
  } else {
    return url + '?r=' + new Date().getTime()
  }
}


/**
 *  读取文件内容
 *  @return {[type]} [string]
 */
export function readFileContent(path, callback, type) {

  let paths
  let name
  let data
  let svgUrl

  /**
   * js脚本加载
   */
  function loadJs(fileUrl, fileName) {
    loadFile(randomUrl(fileUrl), function() {
      data = window.HTMLCONFIG[fileName];
      if (data) {
        callback(data)
        delete window.HTMLCONFIG[fileName];
      } else {
        Xut.$warn({
          type: 'util',
          content: 'js文件加载失败，文件名:' + path
        })
        callback('')
      }
    })
  }


  //con str
  //externalFile使用
  //如果是js动态文件
  //content的html结构
  if (type === "js") {
    paths = config.getSvgPath() + path;
    name = path.replace(".js", '')
    loadJs(paths, name)
    return
  }

  /**
   * 如果启动了跨域处理
   * crossDomain = true
   * 那么所有的svg文件就强制转化成js读取
   */
  if (config.launch.crossDomain || config.launch.convert === 'svg') {
    path = path.replace('.svg', '.js')
    name = path.replace(".js", '')
    svgUrl = config.getSvgPath() + path
    loadJs(svgUrl, name) //直接采用脚本加载
    return
  }


  /**
   * ibooks模式 单独处理svg转化策划给你js,加载js文件
   */
  if (Xut.IBooks.CONFIG) {
    //如果是.svg结尾
    //把svg替换成js
    if (/.svg$/.test(path)) {
      path = path.replace(".svg", '.js')
    }
    //全路径
    paths = config.getSvgPath().replace("svg", 'js') + path;
    //文件名
    name = path.replace(".js", '');
    //加载脚本
    loadFile(randomUrl(paths), function() {
      data = window.HTMLCONFIG[name] || window.IBOOKSCONFIG[name]
      if (data) {
        callback(data)
        delete window.HTMLCONFIG[name];
        delete window.IBOOKSCONFIG[name]
      } else {
        Xut.$warn({
          type: 'util',
          content: '编译:脚本加载失败，文件名:' + name
        })
        callback('');
      }
    })
    return
  }


  //svg文件
  //游览器模式 && 非强制插件模式
  if (Xut.plat.isBrowser && !config.isPlugin) {
    //默认的地址
    svgUrl = config.getSvgPath().replace("www/", "") + path

    //mini杂志的情况，不处理目录的www
    if (config.launch.resource) {
      svgUrl = config.getSvgPath() + path
    }

    $.ajax({
      type: 'get',
      dataType: 'html',
      url: randomUrl(svgUrl),
      success: function(svgContent) {
        callback(svgContent);
      },
      error: function(xhr, type) {
        Xut.$warn({
          type: 'util',
          content: 'svg文件解释出错，文件名:' + path
        })
        callback('');
      }
    })
    return
  }


  /**
   * 插件读取
   * 手机客户端模式
   */
  Xut.Plugin.ReadAssetsFile.readAssetsFileAction(config.getSvgPath() + path, function(svgContent) {
    callback(svgContent);
  }, function(err) {
    callback('')
  });

}

const path = require('path')
const resolve = path.resolve
const _ = require("underscore");
const root = resolve(__dirname)

/**
 * 公共配置
 */
const common = {
  //index入口
  index: './src/index.html',
  //执行入口
  entry: './src/lib/index.js',
  //生成名称
  devName: 'xxtppt.dev.js',
  distName: 'xxtppt.js',
  //目录
  srcDir: './src/',
  distDir: './dist/'
}

module.exports = {

  common: common,

  /**
   * 开发配置
   */
  dev: {

    /**
     * 浏览器访问端口
     */
    port: 8888,

    /**
     * 是否自动打开浏览器
     */
    openBrowser: false,

    /**
     * eslint配置
     * @type {Object}
     */
    eslint: {
      launch: true,
      //文件检测的目录
      includePath: path.resolve(__dirname, 'src/lib'),
    },

    /**
     * 路径配置
     * @type {[type]}
     */
    conf: _.extend(common, {
      index: path.resolve(__dirname, 'temp/index.html'),
      assetsRoot: path.resolve(__dirname, 'temp'),
      assetsPublicPath: '/',
      productionSourceMap: true
    })
  },

  /**
   * 真机调试环境
   * 每次修改都会打包一个完整的文件''
   * 这里填入目标地址er
   * e.g:d:/xxxx
   * @type {Object}
   */
  debug: {

    /*是否启动模式*/
    launch: false,

    /*
    打包模式有2种
    1 全部打包
    2 只打包rollup部分，提高打包速度
    参数： all / rollup
    rollup: 不处理外部js的引入部分，加快调试速度
     */
    packMode: 'all',

    /*是否压缩*/
    uglify: false,

    /*文件打包后拷贝的路径*/
    path: (() => {
      //win:D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
      //os:Users/mac/project/xcode/www/build
      if (process.platform === 'win32') {
        return 'D:\\192.168.1.113\\magazine-develop\\assets\\www\\build'
      } else {
        return '/Users/mac/project/svn/www-dev/template/test/lib'
      }
    })()

  },

  /**
   * 发布配置
   */
  build: {

    conf: _.extend(common),

    /**
     * 启动web服务测试
     * @type {Boolean}
     */
    server: true,

    /**
     * index中排除的文件
     * @type {Array}
     * Parameter is an array format
     */
    exclude: ['SQLResult.js', 'sqlResult.js', 'pixi.js', 'redux.js']

  },

  /**
   * 模板apk测试
   * @type {Object}
   */
  template: {

    /**
     * apk测试模板文件
     * @type {String}
     */
    rootPath: './apk/',

    /**
     * 数据库
     * @type {String}
     */
    sqlPath: './apk/content/SQLResult.js',

    /**
     * 解析后靠拷贝的路径
     * @type {String}
     */
    targetSqlPath: './apk/datacache/SQLResult.js'
  },

  /**
   * 远程调试
   * remoteRemote
   */
  remote: {

    port: 8001,

    /**
     * 监控文件打包
     * @type {[type]}
     */
    wacthFilesPath: 'src/lib/**/*.js'
  }
}

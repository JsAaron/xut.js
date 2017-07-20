const path = require('path')
const rootPath = process.cwd()
const util = require('./util')
const _ = require("underscore")

const aliases = require('./alias')
const resolve = (p) => {
  return path.join(rootPath, p)
}

/**
 * 公共配置
 */
const common = {
  entry: path.normalize(resolve('src/core/index')), //入口

  //生成名称
  devName: 'xxtppt.dev.js',
  productionName: 'xxtppt.js',

  //目录
  srcDirPath: resolve('src'),
  distDirPath: resolve('dist'),
  //template
  templateDirPath: resolve('template'),

  //rollup配置
  //dev debug / build 使用
  rollupDevFilePath: resolve('dist/rollup.dev.js')
}

/**
 * 开发配置
 */
const webpackConfig = {
  /**
   * 端口
   */
  port: 8888,

  /**
   * 是否自动打开浏览器
   */
  openBrowser: false,

  /**
   * eslint配置
   */
  eslint: {
    launch: true,
    //文件检测的目录
    includePath: path.resolve(__dirname, 'src'),
  },
  debug: {},
  assetsName: 'xut.js',
  assetsRootPath: resolve('/template/compile'), //临时编译文件
  assetsPublicPath: '/',


  //外加列表的所有文件
  externalFiles: require('../src/external/load.js'),
  /**
   * index中排除的文件
   * @type {Array}
   * Parameter is an array format
   */
  exclude: ['SQLResult.js', 'sqlResult.js', 'pixi.js', 'redux.js', 'debug.js']
}



const builds = {
  /**
   * 开发版
   * npm run dev
   */
  'webpack-full-dev': webpackConfig,

  /**
   * 真机调试环境
   * npm run dev:debug
   * 每次修改都会打包一个完整的文件''
   * 这里填入目标地址er
   * e.g:d:/xxxx
   * @type {Object}
   */
  'webpack-full-debug': function() {
    _.extend(webpackConfig.debug, {

      /*是否启动模式*/
      launch: true,

      /*debug文件名*/
      devName: 'xxtppt.dev.js',
      minName: 'xxtppt.min.js',

      /**
       * 打包模式有2种
       * 1 全部打包
       * 2 只打包rollup部分，提高打包速度
       * 参数： all / rollup
       * rollup: 不处理外部js的引入部分，加快调试速度
       */
      mode: 'all',

      /*是否压缩*/
      uglify: false,

      /*文件打包后拷贝的路径*/
      targetDirPath: (() => {
        //win:D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
        //os:Users/mac/project/xcode/www/build
        if (process.platform === 'win32') {
          return 'D:\\192.168.1.113\\magazine-develop\\assets\\www\\build'
        } else {
          return '/Users/mac/project/xcode/www/lib'
          // return '/Users/mac/project/svn/www-dev/template/test/lib'
        }
      })()
    })

    return webpackConfig
  },


  /**
   * 发布版本
   * @return {[type]} [description]
   */
  'compiler-full': function() {
    //version
    const data = util.readFile(resolve('src/core/index.js'))
    const version = data.match(/Xut.Version\s?=\s?\d*([.]?\d*)/ig)[0].split('=')[1].trim()
    webpackConfig.version = version
    webpackConfig.banner =
      '/*!\n' +
      ' * Xut.js v' + version + '\n' +
      ' * Release date '+ new Date().toLocaleDateString() +  '\n' +
      ' * (c) 2010-' + new Date().getFullYear() + ' @by Aaron\n' +
      ' * 仅供公司内部使用\n' +
      ' */\n'

    return webpackConfig
  }

}


module.exports = function(modeName) {
  let options
  if (typeof builds[modeName] === 'function') {
    options = builds[modeName]()
  } else {
    options = builds[modeName]
  }
  for (var key in common) {
    options[key] = common[key]
  }
  options.aliases = aliases
  return options
}

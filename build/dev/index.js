const fs = require('fs')
const http = require('http');
const path = require('path')
const cp = require('child_process');

const _ = require("underscore");
const open = require("open");
const watch = require('gulp-watch');
const express = require('express')
const webpack = require('webpack')
const fsextra = require('fs-extra')

const util = require('../util')
const execDebug = require('../debug/index')

//https://github.com/webpack/webpack-dev-middleware#usage
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpacHotMiddleware = require('webpack-hot-middleware')
const killOccupied = require('../kill.occupied')
const convert = require('../convert/index')
const app = express()

const buildName = process.argv[process.argv.length - 1] || 'webpack-full-dev'
const config = require('../config')(buildName)
const port = config.port

/**
 * 转化
 * 1 数据 db-json
 * 2 文件 svg-js
 */
convert(config.templateDirPath)

//清理temp目录
fsextra.removeSync(config.assetsRootPath)
fsextra.mkdirSync(config.assetsRootPath)

const webpackConfig = require('./webpack.config')(config)

/**
 *  eslint
 *  https://segmentfault.com/a/1190000008575829?utm_source=itdadao&utm_medium=referral
 **/
if (config.eslint.launch) {
  webpackConfig.module.rules.push({
    test: /\.js$/,
    enforce: "pre", //在babel-loader对源码进行编译前进行lint的检查
    include: config.eslint.includePath,
    exclude: /node_modules/,
    use: [{
      loader: "eslint-loader",
      options: {
        formatter: require("eslint-friendly-formatter")
      }
    }]
  })
}

const compiler = webpack(webpackConfig)

const devMiddleware = webpackDevMiddleware(compiler, {
  //The path where to bind the middleware to the server.
  //In most cases this equals the webpack configuration option output.publicPath
  publicPath: webpackConfig.output.publicPath,

  //Output options for the stats. See node.js API.
  //http://webpack.github.io/docs/node.js-api.html
  stats: {
    //With console colors
    colors: true,
    //add chunk information
    chunks: false
  }
})


//Webpack热重载连接服务器
//https://github.com/glenjamin/webpack-hot-middleware
//Add webpack-hot-middleware attached to the same compiler instance
const hotMiddleware = webpacHotMiddleware(compiler)

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  //https://github.com/ampedandwired/html-webpack-plugin
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.use('/src', express.static('src'));
app.use('/css', express.static('template/css'));
app.use('/images', express.static('template/images'));
app.use('/content', express.static('template/content'));


let first = true
watch(path.join(config.assetsRootPath, config.assetsName), () => {
  if (config.openBrowser && first) {
    open("http://localhost:" + port)
    first = false
  }
  if (config.debug.launch) {
    execDebug(config)
  }
})


killOccupied(port, () => {
  app.listen(port, (err) => {
    if (err) {
      util.log(err)
      return
    }
    util.log('Listening at http://localhost:' + port + '\n')
  })
})

const fs = require('fs')
const http = require('http');
const express = require('express')
const webpack = require('webpack')
const open = require("open");
const watch = require('gulp-watch');
const path = require('path')
const _ = require("underscore");
const fsextra = require('fs-extra')
const cp = require('child_process');
const utils = require('../utils')

//https://github.com/webpack/webpack-dev-middleware#usage
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpacHotMiddleware = require('webpack-hot-middleware')
const killOccupied = require('../kill.occupied')
const convert = require('../convert/index')

const app = express()
const config = require('../../config')
const port = process.env.PORT || config.dev.port

const devConfig = _.extend(config.dev.conf, {
  rollup: config.dev.conf.distDir + 'rollup.js'
})

/**
 * 转化
 * 1 数据 db-json
 * 2 文件 svg-js
 */
convert(devConfig.srcDir)

fsextra.removeSync(devConfig.assetsRoot)
fsextra.mkdirSync(devConfig.assetsRoot);

const webpackConfig = require('./webpack.dev.conf')


/*eslint
  https://segmentfault.com/a/1190000008575829?utm_source=itdadao&utm_medium=referral
*/
if (config.dev.eslint.launch) {
  webpackConfig.module.rules.push({
    test: /\.js$/,
    enforce: "pre", //在babel-loader对源码进行编译前进行lint的检查
    include: config.dev.eslint.includePath,
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

app.use('/lib', express.static('src/lib'));
app.use('/css', express.static('src/css'));
app.use('/images', express.static('src/images'));
app.use('/content', express.static('src/content'));


let first = true
let preChildRun = null

/*
如果packMode模式是rollup
那么优化第一次采用all的方式,必须先生成一次External文件
之后全用rollup
 */
let packMode = config.debug.packMode
if (config.debug.launch && config.debug.packMode === 'rollup') {
  packMode = 'all'
}

watch(devConfig.assetsRoot + '/app.js', () => {
  if (config.dev.openBrowser && first) {
    open("http://localhost:" + port)
    first = false
  }
  if (config.debug.launch) {
    utils.log("\nDebug Mode: Packed File", 'red')
    if (preChildRun) {
      preChildRun.kill()
      preChildRun = null
    }
    let child = cp.spawn('node', [
      'build/debug/index.js', [config.debug.path, packMode, config.debug.uglify]
    ])
    const start = (new Date().getSeconds())
    child.stdout.on('data', (data) => utils.log('\n' + data))
    child.stderr.on('data', (data) => utils.log('fail out：\n' + data));
    child.on('close', (code) => {
      packMode = config.debug.packMode
      utils.log(`Completion time：${(new Date().getSeconds()) - start}s`)
    });
    preChildRun = child
  }
})


killOccupied(port, () => {
  app.listen(port, (err) => {
    if (err) {
      utils.log(err)
      return
    }
    utils.log('Listening at http://localhost:' + port + '\n')
  })
})

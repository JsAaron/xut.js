const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const ora = require('ora')
const open = require("open");
const watch = require('gulp-watch');
const path = require('path')
const _ = require("underscore");
const fsextra = require('fs-extra')
const child_process = require('child_process');
//https://github.com/webpack/webpack-dev-middleware#usage
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpacHotMiddleware = require('webpack-hot-middleware')
const spinner = ora('Begin to pack , Please wait for\n')

let app = express()
let config = require('../../config')
let port = process.env.PORT || config.dev.port
let conf = _.extend(config.dev.conf, {
    rollup: config.dev.conf.tarDir + 'rollup.js'
});

//数据库
if (!fs.existsSync("./src/content/xxtebook.db")) {
    console.log('data not available!')
    return
}

spinner.start()

if (!fs.existsSync("./src/content/SQLResult.js")) {
    require('../sqlite/index').resolve()
}

fsextra.removeSync(conf.assetsRoot)
fsextra.mkdirSync(conf.assetsRoot);

let webpackConfig = require('./webpack.dev.conf')


/**
 * 启动代码测试
 * eslint
 * @param  {[type]} config.dev.eslint.launch [description]
 * @return {[type]}                          [description]
 */
if (config.dev.eslint.launch) {
    webpackConfig.module.preLoaders = [{
        test: /\.js$/,
        loader: 'eslint',
        include: config.dev.eslint.dir,
        exclude: /node_modules/
    }]

    // community formatter
    webpackConfig.eslint = {
        formatter: require("eslint-friendly-formatter")
    }
}

let compiler = webpack(webpackConfig)

let devMiddleware = webpackDevMiddleware(compiler, {
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
let hotMiddleware = webpacHotMiddleware(compiler)

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
    //https://github.com/ampedandwired/html-webpack-plugin
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
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
watch(conf.assetsRoot + '/app.js', () => {
    if (first) {
        spinner.stop()
        open("http://localhost:" + port)
        first = false
    }
    if (config.dev.test.launch) {
        console.log(
            '\n' +
            'watch file change.....await....:\n'
        )
        let child = child_process.spawn('node', ['build/dev/test.js', ['test=' + config.dev.test.dir]]);
        child.stdout.on('data', (data) => console.log('\n' + data))
        child.stderr.on('data', (data) => console.log('fail out：\n' + data));
        child.on('close', (code) => console.log('complete：' + code));
    }
})


module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})

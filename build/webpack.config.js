var path = require("path");
var config = require('./config')
var src = config.src
var lib = config.lib
var entry = config.entry
var moduleName = config.moduleName
var logError = config.logError
var banner = config.banner
var write = config.write






module.exports = {

    // watch: true,
    //页面入口
    entry: entry,
    //出口文件输出配置
    output: {
        path: src + 'dev/', //js位置
        filename: 'dev.js'
    },
    //source map 支持
    devtool: '#source-map',
    //加载器
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
}

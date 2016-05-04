var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

// 进入添加热重载相关代码块
// { app: [ './build/dev-client', './src/lib/app.js' ] }
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map'
    // plugins: [
    //     // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    //     new webpack.optimize.OccurenceOrderPlugin(),
    //     new webpack.HotModuleReplacementPlugin(),
    //     new webpack.NoErrorsPlugin(),
    //     // https://github.com/ampedandwired/html-webpack-plugin
    //     new HtmlWebpackPlugin({
    //         filename: 'index.html',
    //         template: 'index.html',
    //         inject: true
    //     })
    // ]
})

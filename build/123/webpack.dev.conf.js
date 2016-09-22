
var baseWebpackConfig = require('../webpack.base.conf')
var webpack = require('webpack')
var merge = require('webpack-merge')
var _ = require("underscore");

//https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
//https://www.npmjs.com/package/write-file-webpack-plugin
const WriteFilePlugin = require('write-file-webpack-plugin');

//刷新
baseWebpackConfig.entry = ['./build/dev/client'].concat(baseWebpackConfig.entry)

module.exports = merge(baseWebpackConfig, {
    devtool: '#cheap-source-map',
    plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html',
            inject: true
        }),

        new WriteFilePlugin()
    ]
})

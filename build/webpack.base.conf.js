var _ = require("underscore");
var config = require('../config')

/**
 * webpack
 * 配置
 */
module.exports = {
    entry: config.dev.conf.entry,
    output: {
        path: config.dev.conf.assetsRoot,
        publicPath: config.dev.conf.assetsPublicPath,
        filename: 'app.js'
    },
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


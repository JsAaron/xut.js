var _ = require("underscore");
var config = require('../config')


/**
 * webpack
 * http://mp.weixin.qq.com/s?__biz=MzI2NzExNTczMw==&mid=2653284910&idx=1&sn=77f0675205bcb2265745b377a2c331d5&scene=23&srcid=0624M0FTCcrykirL28I3psrz#rd
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


var path        = require('path')
var config      = require('../config')
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
    entry: {
        app: './src/lib/app.js'
    },
    output: {
        path: config.build.outputRoot,
        filename: '[name].js'
    },
    // resolve: {
    //     extensions: ['', '.js'],
    //     fallback: [path.join(__dirname, '../node_modules')],
    //     alias: {
    //         'src': path.resolve(__dirname, '../src'),
    //         'assets': path.resolve(__dirname, '../src/assets'),
    //         'components': path.resolve(__dirname, '../src/components')
    //     }
    // },
    // resolveLoader: {
    //     fallback: [path.join(__dirname, '../node_modules')]
    // },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint',
            include: projectRoot,
            exclude: /node_modules/
        }],
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }]
    }
}

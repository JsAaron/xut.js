var path = require('path')

module.exports = {
    build: {
        index: path.resolve(__dirname, 'dev/index.html'),
        assetsRoot: path.resolve(__dirname, 'dev') + '\\',
        assetsPublicPath: '/',
        productionSourceMap: true,
        src : './src/',
        entry: './src/lib/app.js'
    },
    dev: {
        port: 8080,
        proxyTable: {}
    }
}

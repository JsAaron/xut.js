var path = require('path')

module.exports = {
    build: {
        index: path.resolve(__dirname, 'dev/index.html'),
        assetsRoot: path.resolve(__dirname, 'dev'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true
    },
    dev: {
        port: 8080,
        proxyTable: {}
    }
}

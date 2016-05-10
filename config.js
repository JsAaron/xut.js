var path = require('path')

//   cd Users/project/svn/magazine-develop/assets/www
module.exports = {
    //每次修改都会打包一个完整的文件
    //这里填入目标地址
    //e.g:d:/xxxx
    debugout:'/Users/project/svn/magazine-develop-ios/www/lib',
    build: {
        index: path.resolve(__dirname, 'dev/index.html'),
        assetsRoot: path.resolve(__dirname, 'dev'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src   : './src/',
        dist  : './dist/',
        entry : './src/lib/app.js'
    },
    dev: {
        port: 8888,
        proxyTable: {}
    }
}

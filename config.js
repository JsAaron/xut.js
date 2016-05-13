var path = require('path')

//   cd Users/project/svn/magazine-develop/assets/www
module.exports = {
    //真机调试环境
    //每次修改都会打包一个完整的文件''
    //这里填入目标地址
    //e.g:d:/xxxx
    test: {
        launch: true,
        dist: '/Users/mac/project/xcode/www/build'
    },
    build: {
        index: path.resolve(__dirname, 'temp/index.html'),
        assetsRoot: path.resolve(__dirname, 'temp'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src: './src/',
        dist: './dist/',
        entry: './src/lib/app.js'
    },
    dev: {
        port: 8888,
        proxyTable: {}
    }
}
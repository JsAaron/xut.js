var path = require('path')

//   cd Users/project/svn/magazine-develop/assets/www
module.exports = {
    //真机调试环境
    //每次修改都会打包一个完整的文件''
    //这里填入目标地址
    //e.g:d:/xxxx
    test: {
        launch: true,
        //D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
        ///Users/mac/project/xcode/www/build
        dist: '/Users/mac/project/xcode/www/build'
    },
    build: {
        index: path.resolve(__dirname, 'temp/index.html'),
        assetsRoot: path.resolve(__dirname, 'temp'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src: './src/',
        entry: './src/lib/app.js',
        //源码生成位置
        dist: './dist/',
        test: './src/test/'
    },
    dev: {
        port: 8888,
        proxyTable: {}
    }
}
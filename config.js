var path = require('path')

//   cd Users/project/svn/magazine-develop/assets/www
module.exports = {

    /**
     * 开发配置
     */
    dev: {
        //localhost:88888
        port: 8888,
        proxyTable: {},
        //真机调试环境
        //每次修改都会打包一个完整的文件''
        //这里填入目标地址er
        //e.g:d:/xxxx
        debugger: {
            launch: false,
            //D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
            ///Users/mac/project/xcode/www/build
            dir: '/Users/mac/project/xcode/www/build'
        },
        //eslint测试目录
        //测试文件地址
        eslint: {
            launch: true,
            dir: path.resolve(__dirname, 'src/lib'),
        }
    }, 

    /**
     * 发布配置
     */
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
    }
} 
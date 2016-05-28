const path = require('path')
const resolve = path.resolve
const _ = require("underscore");

const root = resolve(__dirname)

/**
 * 公共配置
 */
const common = {
    //app.js 执行入口
    entry: './src/lib/app.js',
    //生成名称
    devName: 'xxtppt.dev.js',
    distName: 'xxtppt.js',
    //目录
    srcDir: './src/',
    tarDir: './dist/',
    testDir: './src/test/'
}

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
            launch: true,
            //D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
            ///Users/mac/project/xcode/www/build
            dir: '/Users/mac/project/xcode/www/build'
        },
        //eslint测试目录
        //测试文件地址
        eslint: {
            launch: true,
            //必须绝对路径
            dir: path.resolve(__dirname, 'src/lib'),
        },
        //路径配置
        conf: _.extend(common, {
            index: path.resolve(__dirname, 'temp/index.html'),
            assetsRoot: path.resolve(__dirname, 'temp'),
            assetsPublicPath: '/',
            productionSourceMap: true
        })
    },

    /**
     * 远程调试
     * remoteRemote
     */
    remote: {

    },

    /**
     * 发布配置
     */
    build: {
        conf: _.extend(common)
    }
}
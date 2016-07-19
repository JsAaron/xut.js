const path = require('path')
const resolve = path.resolve
const _ = require("underscore");

const root = resolve(__dirname)

/**
 * 公共配置
 */
const common = {
    //index入口
    index: './src/index.html',
    //执行入口
    entry: './src/lib/index.js',
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

    common: common,

    /**
     * 开发配置
     */
    dev: {

        /**
         * http端口
         * @type {Number}
         */
        port: 8888,

        /**
         * 真机调试环境
         * 每次修改都会打包一个完整的文件''
         * 这里填入目标地址er
         * e.g:d:/xxxx
         * @type {Object}
         */
        test: {
            launch: false,
            //win:D:\svn\magazine-develop\assets\www\epub\epub\dir\assets\www\lib
            //os:Users/mac/project/xcode/www/build
            dir: process.platform === 'win32' ? 'D:\\192.168.1.113\\magazine-develop\\assets\\www\\build' : '/Users/mac/project/xcode/www/build'
        },

        /**
         * eslint配置
         * @type {Object}
         */
        eslint: {
            launch: true,
            //必须绝对路径
            dir: path.resolve(__dirname, 'src/lib'),
        },

        /**
         * 路径配置
         * @type {[type]}
         */
        conf: _.extend(common, {
            index: path.resolve(__dirname, 'temp/index.html'),
            assetsRoot: path.resolve(__dirname, 'temp'),
            assetsPublicPath: '/',
            productionSourceMap: true
        })
    },


    /**
     * 发布配置
     */
    build: {

        conf: _.extend(common),

        /**
         * 启动web服务测试
         * @type {Boolean}
         */
        server: true,

        /**
         * index中排除的文件
         * @type {Array}
         * Parameter is an array format
         */
        exclude: ['SQLResult.js','pixi.js']

    },


    /**
     * 远程调试
     * remoteRemote
     */
    remote: {},
}

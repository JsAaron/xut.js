var gulp = require('gulp');
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')

//var replace = require('rollup-plugin-replace')
var watch = require('gulp-watch');
var notify = require('gulp-notify')
var webpack = require('webpack')

//www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = require('./config')
var src = config.src
var lib = config.lib
var entry = config.entry
var moduleName = config.moduleName
var logError = config.logError
var banner = config.banner
var write = config.write

//pack for dev 
var rolluppack = src + 'dev/dev.js'
var database = require('./sqlite/index')


var bablerollup = function(success, fail) {
    rollup.rollup({
            entry: entry,
            plugins: [
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            var result = bundle.generate({
                // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                format: 'umd',
                banner: banner,
                moduleName: moduleName
            })

            //写到src/build 用于调试
            return write(rolluppack, result.code)
        })
        .then(function() {
            // console.log('打包成功')
            success && success()
        })
        .catch(function() {
            // console.log('打包失败')
            fail && fail();
        })
}



var bablerwebpack = function(success, fail) {
    webpack({
        watch: true,
        //页面入口
        entry: entry,
        //出口文件输出配置
        output: {
            path: src + 'dev/', //js位置
            filename: 'dev.js'
        },
        //source map 支持
        devtool: '#source-map',
        //加载器
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
    }, function(err, stats) {
        if (err) {
            console.log('webpack打包失败')
        }
        success && success()
    });
}


var promise = new Promise(function(resolve, reject) {
    bablerwebpack(resolve, reject)
}).then(function() {
    return new Promise(function(resolve, reject) {
        database.resolve(resolve)
    })
}).then(function() {
    browserSync.init({
        server: src,
        index: 'horizontal-test.html',
        port: 3000,
        open: true,
        files: [rolluppack, "index.html", "horizontal-test.html"]
    });
})


watch(lib + '/**/*.js', function() {
    setTimeout(reload,500)
    // console.log(' \nwatch file change')
        // bablerwebpack()
});

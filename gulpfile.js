var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
//var replace = require('rollup-plugin-replace')
var watch = require('gulp-watch');

//www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = require('./config')
var src        = config.src
var lib        = config.lib
var entry      = config.entry
var moduleName = config.moduleName
var logError   = config.logError
var write      = config.write
var banner     = config.banner

//pack for dev 
var rolluppack = src + 'dev/dev.js'
var database = require('./sqlite/index')


gulp.task('database', function(callback) {
    database.resolve(callback)
})


gulp.task('server', function() {
    browserSync.init({
        server: src,
        index: 'index.html',
        port: 3000,
        open: true,
        files: [rolluppack, "index.html", "horizontal-test.html"]
    });
})


gulp.task('rollup', function() {
    rollup.rollup({
            entry: entry,
            plugins: [
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            //写到src/build 用于调试
            return write(rolluppack, bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: moduleName
            }).code)
        })
        .catch(logError)
})


//dev
gulp.task('dev', ['database', 'rollup', 'server'], function() {
    watch(lib + '/**/*.js', function() {
        gulp.run('rollup');
    });
})


//build
gulp.task('build', function() {
    require('./build/build')
})

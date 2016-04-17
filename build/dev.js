var gulp = require('gulp');
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
    //var replace = require('rollup-plugin-replace')
var watch = require('gulp-watch');

//www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config     = require('./config')
var src        = config.src
var lib        = config.lib
var entry      = config.entry
var moduleName = config.moduleName
var logError   = config.logError
var banner     = config.banner
var write      = config.write

//pack for dev 
var rolluppack = src + 'dev/dev.js'
var database = require('../sqlite/index')


var promise = new Promise(function(resolve, reject) {
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
        .then(resolve)
        .catch(logError)
}).then(function() {
    return new Promise(function(resolve, reject) {
        database.resolve(resolve)
    })
}).then(function() {
    browserSync.init({
        server: src,
        index: 'index.html',
        port: 3000,
        open: true,
        files: [rolluppack, "index.html", "horizontal-test.html"]
    });
})

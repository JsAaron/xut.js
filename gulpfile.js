var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
//var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var watch = require('gulp-watch');

//www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//发布
var builder = require('./build/build')

var src = './src/'
var lib = src + 'lib'
var entry = lib + '/app.js'
var moduleName = 'Aaron'

//pack for dev 
var rolluppack = src + 'dev/dev.js'
var database = require('./sqlite/index')

//dist
var dist = './dist/'
var output = dist + 'xxtppt.js'
var outputmin = dist + 'xxtppt.min.js'



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

function logError(e) {
    console.log(e)
}

var banner =
    '/*!\n' +
    ' * build.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Aaron\n' +
    ' * Released under the MIT License.\n' +
    ' */'


function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}


function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


function write(path, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, code, function(err) {
            if (err) return reject(err)
            console.log(blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}


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
    builder();
})

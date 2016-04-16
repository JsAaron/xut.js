var gulp    = require('gulp');
var fs      = require('fs')
var rollup  = require('rollup')
var babel   = require('rollup-plugin-babel')
//var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var  watch  = require('gulp-watch');

//http          ://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var root     = '.'
var src      = root + '/src'
var dest     = root
var packName = 'build'

//数据解析
var database = require(root + '/node/index')

/**
 * web server
 * @return {[type]}   [description]
 */
gulp.task('server', function() {
    browserSync.init({
        server: root,
        index: 'index.html',
        port: 3000,
        open: true,
        files: [root + "/build.js", root + "/index.html"] //监控变化
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

gulp.task('rollup-pack', function() {
    rollup.rollup({
            entry: src + '/app.js',
            plugins: [
                // replace({
                //     'process.env.NODE_ENV': "'development'"
                // }),
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            return write(dest + '/build/xxtppt.js', bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: 'xxtppt'
            }).code)
        })
        .catch(logError)
})

 

function write(dest, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(dest, code, function(err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}



function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


/**
 * node数据库
 * @param  {[type]} 
 * @return {[type]}
 */
gulp.task('database', function(callback) {
    database.resolve(callback)
})


 
/**
 * rollup打包
 */
gulp.task('develop', ['database','rollup-pack', 'server'], function() {
    watch(src + '/**/*.js', function () {
        gulp.run('rollup-pack');
    });
})



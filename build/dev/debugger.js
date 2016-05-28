const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const ora = require('ora')
const base = require('../rollup.base.config.js')
var config = require('../../config')

//是否debug模式
var debugout;
var args = process.argv[process.argv.length - 1]
var args = args.split('=')
if (args[0] == 'debug') {
    debugout = args[1]
}

var scriptUrl = []
var conf = _.extend(config.common, {
    rollup: config.common.tarDir + 'rollup.js',
    debug: debugout
});

var spinner = ora('Begin to pack , Please wait for\n')
spinner.start()


/**
 * 合并index引入的js
 * @return {[type]}   [description]
 */
gulp.task('mergescript', function(cb) {
    gulp.src(scriptUrl)
        .pipe(concat(conf.devName))
        .on('error', function(err) {
            console.log('Less Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest(conf.tarDir))
        .on('end', cb)
});

/**
 * 合成最终发布的xxtppt
 * @return {[type]}   [description]
 */
gulp.task('mergeall', ['mergescript'], function(cb) {
    //合成xxtppt.js
    scriptUrl.push(conf.rollup)
    gulp.src(scriptUrl)
        .pipe(concat(conf.distName))
        .on('error', function(err) {
            console.log('Less Error!', err.message);
            this.end();
        })
        // .pipe(uglify())
        .pipe(gulp.dest(conf.tarDir))
        .on('end', cb)
});


/**
 * 打包任务
 * @return {[type]}   [description]
 */
gulp.task('pack', ['mergeall'], function() {
    //复制dist到lib/build
    try {
        fsextra.copySync('dist', conf.debug)
        console.log("copySync dist to " + conf.debug + " success!")
    } catch (err) {
        console.error(err)
    }
    spinner.stop()
});



base(conf).then(function(paths) {
    scriptUrl = paths
    gulp.run('pack')
})
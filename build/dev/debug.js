const gulp = require('gulp');
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat')
const ora = require('ora')
const base = require('../rollup.base.conf.js')
const config = require('../../config')

//debug路径
var debugDir;
var args = process.argv[process.argv.length - 1]
var args = args.split('=')
if (args[0] == 'debug') {
    debugDir = args[1]
}

var scriptUrl = []
var conf = _.extend(config.common, {
    rollup: config.common.tarDir + 'rollup.js',
    debugDir: debugDir
});


/**
 * 合并index引入的js
 * @return {[type]}   [description]
 */
gulp.task('mergescript', (cb) => {
    gulp.src(scriptUrl)
        .pipe(concat(conf.devName))
        .on('error', (err) => {
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
gulp.task('mergeall', (cb) => {
    //合成xxtppt.js
    scriptUrl.push(conf.rollup)
    gulp.src(scriptUrl)
        .pipe(concat(conf.distName))
        .on('error', (err) => {
            console.log('Less Error!', err.message);
            this.end();
        })
        // .pipe(uglify())
        .pipe(gulp.dest(conf.tarDir))
        .on('end', cb)
});


/**
 * 复制dist到lib/build
 * @return {[type]} [description]
 */
var copy = () => {
    try {
        //删除多余的rollup.js
        fsextra.removeSync(conf.rollup)
            //复制目录文件
        fsextra.copySync(conf.tarDir, conf.debugDir)
        console.log("copy file dir to " + conf.debugDir + " success!")
    } catch (err) {
        console.error(err)
    }
}

/**
 * 合并压缩xxtppt.js
 * @param  {[type]}   scriptUrl [description]
 * @param  {Function} cb        [description]
 * @return {[type]}             [description]
 */
var mergeuglify = (scriptUrl, cb) => {
    //合成xxtppt.js
    scriptUrl.push(conf.rollup)
    gulp.src(scriptUrl)
        .pipe(concat(conf.distName))
        .on('error', (err) => {
            console.log('Less Error!', err.message);
            this.end();
        })
        .pipe(uglify())
        .pipe(gulp.dest(conf.tarDir))
        .on('end', cb)
}


base(conf).then((paths) => {
    mergeuglify(paths, copy)
})

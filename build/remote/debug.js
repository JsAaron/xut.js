const browserSync = require("browser-sync");
const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const open = require("open")
const httpServer = require('http-server')
const fsextra = require('fs-extra')
const cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');
// var uglify = require('uglify-js')
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const ora = require('ora')

const base = require('../rollup.base.config.js')
const config = require('../../config')

var conf = _.extend(config.common, {
    rollup: config.common.tarDir + 'rollup.js'
});

var topack = function() {
    base(conf).then(function() {
        return new Promise(function(resolve, reject) {
            //css
            gulp.src('src/css/*.css')
                .pipe(cleanCSS({
                    compatibility: 'ie8'
                }))
                .pipe(gulp.dest(conf.tarDir))
                .pipe(gulp.dest(conf.testDir))
                .on('end', resolve)
        })
    }).then(function(paths) {
        //合成xxtppt.js
        paths.push(conf.rollup)
        gulp.src(paths)
            .pipe(concat(conf.devName))
            .on('error', function(err) {
                console.log('Less Error!', err.message);
                this.end();
            })
            //dev
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            //min
            .pipe(uglify())
            .pipe(rename(conf.tarDirName))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            .on('end', function() {
                fs.unlinkSync(conf.rollup)
                resolve && resolve()
            })
    });
}

topack()

browserSync({
    server: {
        //指定服务器启动根目录
        baseDir: "./src",
        index: "test.html"
    }
});
//监听任何文件变化，实时刷新页面
watch(conf.testDir + '/xxtppt.js', function() {
    // alert(111)
})
const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const fsextra = require('fs-extra')
const cleanCSS = require('gulp-clean-css');
//var replace = require('rollup-plugin-replace')
const express = require('express');
// var uglify = require('uglify-js')
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const ora = require('ora')
const _ = require("underscore");
const browserSync = require("browser-sync");
const base = require('../rollup.base.conf.js')

var config = require('../../config')

var app = express();
var conf = _.extend(config.build.conf, {
    rollup: config.build.conf.tarDir + 'rollup.js'
});

var spinner = ora('Begin to pack , Please wait for\n')
spinner.start()

console.log(
    '压缩js  => rollup and gulp\n' +
    '压缩css => gulp-uglify\n'
)


base(conf).then((scriptUrl) => {
    return new Promise((resolve, reject) => {
        //合成xxtppt.js
        scriptUrl.push(conf.rollup)
        gulp.src(scriptUrl)
            .pipe(concat(conf.devName))
            .on('error', (err) => {
                console.log('Less Error!', err.message);
                this.end();
            })
            //dev
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            //min
            .pipe(uglify())
            .pipe(rename(conf.distName))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            .on('end', () => {
                fs.unlinkSync(conf.rollup)
                resolve && resolve()
            })
    })
}, () => spinner.stop()).then(() => {
    return new Promise((resolve, reject) => {
        //css
        gulp.src('src/css/*.css')
            .pipe(cleanCSS({
                compatibility: 'ie8'
            }))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            .on('end', resolve)
    })
}).then(function() {
    var complete = () => {
        spinner.stop()
        browserSync({
            port: 3000,
            server: {
                //指定服务器启动根目录
                baseDir: "./src",
                index: "test.html"
            },
            open: true
        });
    }

    //数据库
    if (!fs.existsSync("./src/content/xxtebook.db")) {
        console.log("Can't test Because the xxtebook does not exist")
        spinner.stop()
        return
    }

    if (!fs.existsSync("./src/content/SQLResult.js")) {
        console.log("Can't test Because the SQLResult does not exist")
        spinner.stop()
        return
    }

    //数据库
    fs.exists("./src/content/SQLResult.js", (result) => {
        if (!result) {
            require('./sqlite/index').resolve(complete)
            return;
        }
        complete()
    });
})

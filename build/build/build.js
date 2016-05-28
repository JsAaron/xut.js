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
const base = require('../rollup.base.config.js')

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


base(conf).then(function() {
    return new Promise(function combine(resolve, reject) {
        fs.readFile('./src/index.html', "utf8", function(error, data) {
            if (error) throw error;
            var paths = []
            var path;
            var cwdPath = escape(process.cwd())
            var scripts = data.match(/<script.*?>.*?<\/script>/ig);

            scripts.forEach(function(val) {
                val = val.match(/src="(.*?.js)/);
                if (val && val.length) {
                    path = val[1]

                    //有效src
                    if (/^lib/.test(path)) {
                        paths.push(conf.srcDir + path)
                    }
                }
            })

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
                .pipe(rename(conf.distName))
                .pipe(gulp.dest(conf.tarDir))
                .pipe(gulp.dest(conf.tarDir))
                .pipe(gulp.dest(conf.testDir))
                .on('end', function() {
                    fs.unlinkSync(conf.rollup)
                    resolve && resolve()
                })

        });
    })
}).then(function() {
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
}).then(function() {
    var complete = function() {
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
    fs.exists("./src/content/SQLResult.js", function(result) {
        if (!result) {
            require('./sqlite/index').resolve(complete)
            return;
        }
        complete()
    });
})
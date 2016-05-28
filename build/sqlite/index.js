const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const open = require("open")
const httpServer = require('http-server')
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

var base = require('../base.config.js')
var config = require('../../config')

var app = express();
var conf = _.extend(config.build.conf, {
    rollup: config.build.conf.tarDir + 'rollup.js'
});

base()



//清空目录
fsextra.emptyDirSync(conf.tarDir)
fsextra.emptyDirSync(conf.testDir)

var getSize = function(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}
var blue = function(str) {
    return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}
var write = function(path, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, code, function(err) {
            if (err) return reject(err)
            console.log('write: ' + blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}


console.log(
    '压缩js  => rollup and gulp\n' +
    '压缩css => gulp-uglify\n'
)


var spinner = ora('Begin to pack , Please wait for\n')
spinner.start()


new Promise(function(resolve, reject) {
    rollup.rollup({
            entry: conf.entry,
            plugins: [
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {

            //创建目录,如果不存在
            if (!fs.existsSync(conf.tarDir)) {
                fs.mkdirSync(conf.tarDir);
                console.log(conf.tarDir + '目录创建成功');
            }

            var code = bundle.generate({
                format: 'umd',
                moduleName: 'Aaron'
            }).code

            return write(conf.rollup, code)
        })
        .then(resolve)
        .catch(function() {
            console.log('错误')
        })
}).then(function() {
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
        var port = 3000
        var host = '0.0.0.0'
        var server = httpServer.createServer({
            root: './src/'
        })
        server.listen(port, host, function() {
            console.log('served prot:' + port)
            open("http://localhost:" + port + "/test.html");
        });
        spinner.stop()
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
var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var open = require("open")
var httpServer = require('http-server')
var fsextra = require('fs-extra')

//var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var express = require('express');
var app = express();

// var uglify = require('uglify-js')
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat')
var ora = require('ora')

var config = require('../config')

//output
var output = config.build.dist

//打包文件
var rollupjs = output + 'rollup.js'

//是否debug模式
var debugout;
var args = process.argv[process.argv.length - 1]
var args = args.split('=')
if (args[0] == 'debug') {
    debugout = args[1]
}


//发布路径
//dist 对外使用
//test 对内测试
var buildPath = {
    devName: 'xxtppt.dev.js',
    distName: 'xxtppt.js',
    dist: config.build.dist,
    test: config.build.src + "build/",
    //调试目录
    debug: debugout
}

//delete this existing files
var delAssets = function(path) {
    var dev = path + buildPath.devName
    var dist = path + buildPath.distName

    ;
    [dev, dist].forEach(function(file) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
    })
}
delAssets(buildPath.dist)
delAssets(buildPath.test)


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


var spinner = ora('Begin to pack , Please wait for\n')
spinner.start()


new Promise(function(resolve, reject) {
        rollup.rollup({
                entry: config.build.entry,
                plugins: [
                    babel({
                        "presets": ["es2015-rollup"]
                    })
                ]
            })
            .then(function(bundle) {
                if (!fs.existsSync(output)) {
                    fs.mkdirSync(output);
                    console.log(output + '目录创建成功');
                }
                var code = bundle.generate({
                    format: 'umd',
                    moduleName: 'Aaron'
                }).code

                return write(rollupjs, code)
            })
            .then(resolve)
            .catch(function() {
                console.log('错误')
            })
    })
    .then(function() {

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
                        paths.push(config.build.src + path)
                    }
                }
            })

            //degbug模式
            //生成
            gulp.src(paths)
                .pipe(concat('framework.js'))
                .on('error', function(err) {
                    console.log('Less Error!', err.message);
                    this.end();
                })
                .pipe(gulp.dest(buildPath.dist))
                .on('end', function() {

                    //合成xxtppt.js
                    paths.push(rollupjs)
                    gulp.src(paths)
                        .pipe(concat('xxtppt.js'))
                        .on('error', function(err) {
                            console.log('Less Error!', err.message);
                            this.end();
                        })
                        .pipe(gulp.dest(buildPath.dist))
                        .on('end', function() {

                            //复制dist到lib/build
                            try {
                                fsextra.copySync('dist', buildPath.debug)
                                console.log("copySync dist to " + buildPath.debug + " success!")
                            } catch (err) {
                                console.error(err)
                            }

                            spinner.stop()
                        })

                })

        });

    })

var gulp = require('gulp');
var fs         = require('fs')
var rollup     = require('rollup')
var babel      = require('rollup-plugin-babel')
var open       = require("open");
var httpServer = require('http-server')

//var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var express = require('express');
var app = express();

// var uglify = require('uglify-js')
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat')

var config = require('../config')

//output
var output = config.build.assetsRoot

//打包文件
var rollupjs = output + 'rollup.js'


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
                            paths.push(config.build.src + path)
                        }
                    }
                })

                paths.push(rollupjs)

                gulp.src(paths)
                    .pipe(concat('xxtppt.dev.js'))
                    .on('error', function(err) {
                        console.log('Less Error!', err.message);
                        this.end();
                    })
                    // .pipe(gulp.dest(output))
                    // .pipe(gulp.dest(config.src + '/dev/'))
                    .pipe(uglify())
                    .pipe(rename("xxtppt.min.js"))
                    .pipe(gulp.dest(output))
                    .pipe(gulp.dest(config.build.assetsRoot))
                    .pipe(gulp.dest(config.build.src + "/build"))
                    .on('end', function() {
                        fs.unlinkSync(rollupjs)
                        resolve && resolve()
                    })

            });
        })
    })
    .then(function() {
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




/**
 * 替换所有反斜杠为斜杠
 * @return {[type]} [description]
 */
var escape = function(str) {
    var strs = new Array();
    var a = str;
    strs = a.split("");
    for (var i = 0; i < strs.length; i++) {
        a = a.replace("\\", "/")
    }
    return a;
}


function combine1(resolve, reject) {
    fs.readFile('./src/index.html', "utf8", function(error, data) {
        if (error) throw error;
        var paths = []
        var path;
        var cwdPath = escape(process.cwd())
        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        fs.writeFileSync(dependJs, '')
        scripts.forEach(function(val) {
            val = val.match(/src="(.*?.js)/);
            if (val && val.length) {
                path = val[1]

                //有效src
                if (/^lib/.test(path)) {
                    // console.log(fs.readFileSync(path))
                    fs.appendFileSync(dependJs, fs.readFileSync(src + path))
                }
            }
        })
        resolve && resolve()
    });
}



//打包
function command(callback) {
    fs.readFile('./index.html', "utf8", function(error, data) {
        if (error) throw error;
        var arr = []
        var path;
        var cwdPath = escape(process.cwd())

        var command = []
        command.push('cd ' + cwdPath + '/lib')
        command.push('\n')
        command.push('java -jar ..\\build\\compiler.jar ')

        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        scripts.forEach(function(val) {
            val = val.match(/lib.*?.js/);
            if (val && val.length) {
                path = cwdPath + "/" + val[0]
                command.push(path + ' ')
            }
        })

        command.push('--js_output_file=..\\build\\_file\\xxtppt.js')
        command.push('\n')
        command.push('cd ' + cwdPath + '/build')
        command.push('\n')
        command.push('Pause')

        command = command.join('');

        fs.writeFile('build/xxtppt.bat', command, function(err) {
            console('youxi!');
        });

    })
}

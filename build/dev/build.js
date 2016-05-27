var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var fsextra = require('fs-extra')

var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat')
var ora = require('ora')

var config = require('../../config')


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
    rollup: config.build.dist + 'rollup.js',
    devName: 'xxtppt.dev.js',
    distName: 'xxtppt.js',
    dist: config.build.dist,
    test: config.build.test,
    //调试目录
    debug: debugout
}

//清空目录
fsextra.emptyDirSync(buildPath.dist)
fsextra.emptyDirSync(buildPath.test)


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

                if (!fs.existsSync(buildPath.dist)) {
                    fs.mkdirSync(buildPath.dist);
                    console.log(buildPath.dist + '目录创建成功');
                }

                var code = bundle.generate({
                    format: 'umd',
                    moduleName: 'Aaron'
                }).code

                return write(buildPath.rollup, code)
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
                .pipe(concat(buildPath.devName))
                .on('error', function(err) {
                    console.log('Less Error!', err.message);
                    this.end();
                })
                .pipe(gulp.dest(buildPath.dist))
                .on('end', function() {

                    //合成xxtppt.js
                    paths.push(buildPath.rollup)
                    gulp.src(paths)
                        .pipe(concat(buildPath.distName))
                        .on('error', function(err) {
                            console.log('Less Error!', err.message);
                            this.end();
                        })
                        // .pipe(uglify())
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
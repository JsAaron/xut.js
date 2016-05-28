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

var config = require('../../config')
    //是否debug模式
var debugout;
var args = process.argv[process.argv.length - 1]
var args = args.split('=')
if (args[0] == 'debug') {
    debugout = args[1]
}

var conf = _.extend(config.common, {
    rollup: config.common.tarDir + 'rollup.js',
    debug: debugout
});


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
                        paths.push(conf.srcDir + path)
                    }
                }
            })

            //degbug模式
            //生成
            gulp.src(paths)
                .pipe(concat(conf.devName))
                .on('error', function(err) {
                    console.log('Less Error!', err.message);
                    this.end();
                })
                .pipe(gulp.dest(conf.tarDir))
                .on('end', function() {

                    //合成xxtppt.js
                    paths.push(conf.rollup)
                    gulp.src(paths)
                        .pipe(concat(conf.distName))
                        .on('error', function(err) {
                            console.log('Less Error!', err.message);
                            this.end();
                        })
                        // .pipe(uglify())
                        .pipe(gulp.dest(conf.tarDir))
                        .on('end', function() {

                            //复制dist到lib/build
                            try {
                                fsextra.copySync('dist', conf.debug)
                                console.log("copySync dist to " + conf.debug + " success!")
                            } catch (err) {
                                console.error(err)
                            }

                            spinner.stop()
                        })

                })

        });

    })
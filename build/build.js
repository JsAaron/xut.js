var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
    //var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var uglify = require('uglify-js')
var concat = require('gulp-concat')
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;



var config = require('./config')
var src = config.src
var lib = config.lib
var entry = config.entry
var moduleName = config.moduleName
var logError = config.logError
var write = config.write
var banner = config.banner

//dist
var dist = './dist/'
var output = dist + 'xxtppt.min.js'

var es2015Js = dist + 'es2015.js'
var es2015min = dist + 'es2015.min.js'
var combineJs = dist + 'combine.js'



function combine(resolve, reject) {
    fs.readFile('./src/index.html', "utf8", function(error, data) {
        if (error) throw error;
        var way = []
        var path;
        var cwdPath = escape(process.cwd())
        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        fs.writeFileSync(combineJs, '')
        scripts.forEach(function(val) {
            val = val.match(/src="(.*?.js)/);
            if (val && val.length) {
                path = val[1]
                    //有效src
                if (/^lib/.test(path)) {
                    way.push(src + path)
                }
            }
        })

        way.push(es2015Js)

        gulp.src(way)
            .pipe(concat('xxtppt.dev.js'))
            .on('error', function(err) {
                console.log('Less Error!', err.message);
                this.end();
            })
            .pipe(gulp.dest(dist))
            .pipe(gulp.dest(config.src + '/dev/'))
    });
}



var promise = new Promise(function(resolve, reject) {
    rollup.rollup({
            entry: entry,
            plugins: [
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {

            var code = bundle.generate({
                // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                format: 'umd',
                moduleName: moduleName
            }).code

            return write(es2015Js, code)

            var minified = banner + '\n' + uglify.minify(code, {
                fromString: true,
                output: {
                    ascii_only: true
                }
            }).code

            //写到src/build 用于调试
            return write(es2015min, minified)
        })
        .then(resolve)
        .catch(function(){
            console.log('错误')
            logrror()
        })
}).then(function() {
    new Promise(combine)
}).then(function() {
    browserSync.init({
        server : src,
        index  : 'test.html',
        port   : 4000,
        open   : true
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
        var way = []
        var path;
        var cwdPath = escape(process.cwd())
        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        fs.writeFileSync(combineJs, '')
        scripts.forEach(function(val) {
            val = val.match(/src="(.*?.js)/);
            if (val && val.length) {
                path = val[1]

                //有效src
                if (/^lib/.test(path)) {
                    // console.log(fs.readFileSync(path))
                    fs.appendFileSync(combineJs, fs.readFileSync(src + path))
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

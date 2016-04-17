var gulp = require('gulp');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
    //var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;
var watch = require('gulp-watch');
var uglify = require('uglify-js')
var concat = require('gulp-concat')
    //http          ://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var src = './src'
var entry = src + '/app.js'

var dest = './dest/'
var moduleName = 'Aaron'
var output = dest + 'xxtppt.js'
var outputMin = dest + 'xxtppt.min.js'

var database = require( './sqlite/index')


gulp.task('database', function(callback) {
    database.resolve(callback)
})


gulp.task('server', function() {
    browserSync.init({
        server: './',
        index: 'horizontal-test.html',
        port: 3000,
        open: true,
        files: [output, "./horizontal-test.html", "./horizontal-test.html"]
    });
})

function logError(e) {
    console.log(e)
}

var banner =
    '/*!\n' +
    ' * build.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Aaron\n' +
    ' * Released under the MIT License.\n' +
    ' */'


function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}


function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


function write(path, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, code, function(err) {
            if (err) return reject(err)
            console.log(blue(path) + ' ' + getSize(code))
            resolve()
        })
    })
}


gulp.task('rollup', function() {
    rollup.rollup({
            entry: entry,
            plugins: [
                // replace({
                //     'process.env.NODE_ENV': "'development'"
                // }),
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            return write(output, bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: moduleName
            }).code)
        })
        .catch(logError)
})


gulp.task('dev', ['database', 'rollup', 'server'], function() {
    watch(src + '/**/*.js', function() {
        gulp.run('rollup');
    });
})


gulp.task('build', function() {
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
                format: 'umd',
                moduleName: moduleName
            }).code
            var minified = banner + '\n' + uglify.minify(code, {
                fromString: true,
                output: {
                    ascii_only: true
                }
            }).code
            return write(outputMin, minified)
        }).then(function(bundle) {
            console.log(123)
        }).catch(logError)
})


gulp.task('concat', function() {

    fs.readFile('./index.html', "utf8", function(error, data) {
        if (error) throw error;
        var arr = []
        var path;
        var cwdPath = escape(process.cwd())
        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        scripts.forEach(function(val) {
            val = val.match(/src="(.*?.js)/);
            if (val && val.length) {
                path = val[1]
                    //有效src
                if (/^src|build/.test(path)) {
                    arr.push(val[1])
                }
            }

        })

        gulp.src(arr)
            .pipe(concat('xxtppt.min.js'))
            .pipe(gulp.dest('./build'))

    });

});


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


//打包
gulp.task('pack-command', function(callback) {
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

    });
})

gulp.task('pack', function(callback) {
    fs.readFile('./index.html', "utf8", function(error, data) {
        if (error) throw error;
        var arr = []
        var path;
        var data
        var cwdPath = escape(process.cwd())

        fs.writeFileSync('xxtppt.js', '')

        var scripts = data.match(/<script.*?>.*?<\/script>/ig);
        scripts.forEach(function(val) {
            val = val.match(/lib.*?.js/);
            if (val && val.length) {
                path = cwdPath + "/" + val[0]
                fs.appendFileSync('xxtppt.js', fs.readFileSync(path))
            }
        })

    });
})

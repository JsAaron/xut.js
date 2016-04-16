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

var root = '.'
var src = root + '/src'
var dest = root
var packName = 'build'

var database = require(root + '/node/index')

gulp.task('server', function() {
    browserSync.init({
        server: root,
        index: 'horizontal-test.html',
        port: 3000,
        open: true,
        files: [root + "/build/xxtppt.js", root + "/horizontal-test.html", root + "/horizontal-test.html"]
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


function write(dest, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(dest, code, function(err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}


gulp.task('rollup-pack', function() {
    rollup.rollup({
            entry: src + '/app.js',
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
            return write(dest + '/build/xxtppt.js', bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: 'xxtppt'
            }).code)
        })
        .catch(logError)
})





function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}



function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

gulp.task('database', function(callback) {
    database.resolve(callback)
})


gulp.task('develop', ['database', 'rollup-pack', 'server'], function() {
    watch(src + '/**/*.js', function() {
        gulp.run('rollup-pack');
    });
})


gulp.task('build', function() {
    rollup.rollup({
            entry: src + '/app.js',
            plugins: [
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            var code = bundle.generate({
                format: 'umd',
                moduleName: 'Aaron'
            }).code
            var minified = banner + '\n' + uglify.minify(code, {
                fromString: true,
                output: {
                    ascii_only: true
                }
            }).code
            return write(dest + '/build/xxtppt.js', minified)
        }).then(function(bundle) {
            console.log(123)
        })
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

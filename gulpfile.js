var gulp = require('gulp')

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//CommonJs
var gulpBrowserify = require('gulp-browserify');

//webpack
var gulpWebpack = require('gulp-webpack');

//===================================
//  配置文件
//===================================
var src = "./develop";
var dest = "./release";
var config = {
    localserver: {
        host: 'localhost',
        port: '8888'
    },
    sass: {
        src: src + "/sass/*.{sass,scss}",
        dest: dest
    },
    script: {
        allsrc: src + '/lib/*.js',
        src: src + '/lib/app.js',
        dest: dest,
        name: 'pwBox.js'
    },
    html: {
        dest: dest + "/*.html"
    }
}


//=====================================
//  webpack打包
//=====================================

gulp.task("gulpWebpack", function(callback) {
    var bulid = config.script.name.replace("js", 'build.js')
    return gulp.src(config.script.src)
        .pipe(gulpWebpack({
            entry: {
                app: config.script.src
            },
            output: {
                filename: config.script.name,
            }
        }))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.script.dest))
        .pipe(reload({
            stream: true
        }));
});



//===================================
//  web服务
//===================================

// web服务 Server + watching scss/html files
gulp.task('web-server', ['gulpWebpack'], function() {
    browserSync.init({
        server: dest
    });
    gulp.watch(config.script.allsrc, ['gulpWebpack']);
    gulp.watch(config.html.dest).on('change', reload);
});

gulp.task('watch', function() {
    gulp.run('web-server');
});

gulp.task('default', ['watch'])

var gulp = require('gulp');
var webpack = require('gulp-webpack');
var path = require('path');
var notify = require('gulp-notify');
//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//config file
var src = './develop/';
var dest = './release/';
var config = {
    script: {
        watch: src + '*.js',
        src: src + 'app.js',
        dest: dest,
        name: 'bundle.js'
    },
    html: {
        watch: dest + '*.html'
    }
}


//error prompt
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: '编译错误',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
};


// Webpack packaging
var webpackConfig = require('./webpack.config')(config);
gulp.task('scripts', function() {
    return gulp.src(config.script.src)
        .pipe(webpack(webpackConfig))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.script.dest))
        .pipe(reload({
            stream: true
        }));
});


//===================================
//  web server
//===================================


// web服务 Server + watching scss/html files
gulp.task('web-server', ['scripts'], function() {
    browserSync.init({
        server: {
            baseDir: dest
        }
    });
    gulp.watch(config.script.watch, ['scripts']);
    gulp.watch(config.html.watch).on('change', reload);
});


gulp.task('default', ['web-server'])

var gulp    = require('gulp');
var webpack = require('webpack');
var path    = require('path');
var notify  = require('gulp-notify');
//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//config file
var src = './develop/';
var dest = './release/';
var config = {
    webServer: {
        server    : dest,
        index     : "index.html",
        port      : 3000,
        logLevel  : "debug",
        logPrefix : "Aaron",
        files     : [dest + "/*.js", dest + "/*.html"]
    },
    script: {
        watch : src + '*.js',
        entry : src + 'app.js',
        dest  : dest,
        name  : 'bundle.js'
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
    webpack(webpackConfig, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
});


//===================================
//  web server
//===================================


// web服务 Server + watching scss/html files
gulp.task('web-server', function() {
    browserSync.init(config.webServer);
});

gulp.task('watch', ["scripts",'web-server'], function() {
    // gulp.watch(config.script.watch, ['scripts']);
    gulp.watch(config.html.watch).on('change', reload);
})

gulp.task('default', ['watch'])

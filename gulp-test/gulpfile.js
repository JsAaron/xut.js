var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
//将一系列的 stream 合并成一个
var combiner = require('stream-combiner2');
var uglify = require('gulp-uglify');

//stream-combiner2测试
gulp.task('test', function() {
    var combined = combiner.obj([
        gulp.src('bootstrap/js/*.js'),
        uglify(),
        gulp.dest('public/bootstrap')
    ]);
    // 任何在上面的 stream 中发生的错误，都不会抛出，
    // 而是会被监听器捕获
    combined.on('error', console.error.bind(console));
    return combined;
});

// 注册任务
gulp.task('webserver', function() {
    gulp.src('./') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch', function() {
    gulp.watch('*.html', ['html']) // 监听根目录下所有.html文件
});


gulp.task('sass', function() {
    gulp.src('style/sass/*.sass')
        .pipe(gulp.dest('style/css/'))
})



// 默认任务
gulp.task('default', ['webserver', 'watch']);

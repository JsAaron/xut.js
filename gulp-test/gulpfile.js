var gulp = require('gulp');
var sass = require('gulp-sass');
//即时重整
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
//自动加前缀
var autoprefixer = require('gulp-autoprefixer');
//压缩css
var minifycss = require('gulp-minify-css');
//图片快取，只有更改过得图片会进行压缩
var cache = require('gulp-cache');
//更动通知
var notify = require('gulp-notify');
//JSHint 错误
var jshint = require('gulp-jshint');
//将一系列的 stream 合并成一个
var combiner = require('stream-combiner2');
// 丑化(Uglify)
var uglify = require('gulp-uglify');
// 合并JS
var concat = require('gulp-concat');
//改名
var rename = require('gulp-rename');


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

// 编译sass
gulp.task('sass', function() {
    return gulp.src('style/sass/index.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('style/css'))
        // .pipe(notify({
        //     message: 'Styles task complete'
        // }));
});




// 默认任务
gulp.task('default', ['webserver', 'watch']);

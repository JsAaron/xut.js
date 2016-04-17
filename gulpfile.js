var gulp = require('gulp');

//dev
gulp.task('dev', function() {
    require('./build/dev')
})

//build
gulp.task('build', function() {
    require('./build/build')
})


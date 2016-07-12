const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const csspath = './src/css/*.css'

module.exports = (conf) => {
    return new Promise((resolve, reject) => {
        gulp.src(csspath)
            .pipe(cleanCSS({
                compatibility: 'ie8'
            }))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            .on('error', (err) => {
                console.log('【css】compile complete error')
                reject()
            })
            .on('end', () => {
                console.log('【css】compile complete')
                resolve()
            })
    })
}

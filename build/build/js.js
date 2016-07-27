const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const fs = require('fs')

module.exports = (conf, scriptUrl, stop) => {
    return new Promise((resolve, reject) => {
        //合成xxtppt.js
        scriptUrl.push(conf.rollup)
        gulp.src(scriptUrl)
            .pipe(concat(conf.devName))
            .on('error', (err) => {
                console.log('concat Error!', err.message);
                this.end();
            })
            //dev
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            //min
            .pipe(uglify())
            .on('error', (err) => {
                console.log('error Error!', err);
                stop()
            })
            .pipe(rename(conf.distName))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.tarDir))
            .pipe(gulp.dest(conf.testDir))
            .on('end', (err) => {
                console.log(
                    '【' + conf.devName + ' and ' + conf.distName + '】compile complete'
                )
                fs.unlinkSync(conf.rollup)
                resolve && resolve()
            })
    })
}

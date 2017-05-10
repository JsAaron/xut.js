const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const fs = require('fs')
const utils = require('../utils')

module.exports = (conf, scriptUrl) => {
  return new Promise((resolve, reject) => {
    //合成xxtppt.js
    scriptUrl.push(conf.rollup)
    gulp.src(scriptUrl)
      .pipe(concat(conf.devName))
      .on('error', (err) => {
        utils.log('concat Error!' + err.message, 'error');
        this.end();
      })
      //dev
      .pipe(gulp.dest(conf.distDir))
      //min
      .pipe(uglify())
      .on('error', (err) => {
        utils.log('uglify Error!' + err.message, 'error');
        console.log(err)
      })
      .pipe(rename(conf.distName))
      .pipe(gulp.dest(conf.distDir))
      .on('end', (err) => {
        utils.log(`【${conf.devName}、${conf.distName}】compile complete`, 'debug')
        fs.unlinkSync(conf.rollup)
        resolve && resolve()
      })
  })
}

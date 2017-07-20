const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const fs = require('fs')
const util = require('../util')

module.exports = (config, scriptUrls) => {
  return new Promise((resolve, reject) => {
    //合成xxtppt.js
    scriptUrls.push(config.rollupDevFilePath)
    gulp.src(scriptUrls)
      .pipe(concat(config.devName))
      .on('error', (err) => {
        util.log('concat Error!' + err.message, 'error');
        this.end();
      })
      //dev
      .pipe(gulp.dest(config.distDirPath))
      //min
      .pipe(uglify())
      .on('error', (err) => {
        util.log('uglify Error!' + err.message, 'error');
        console.log(err)
      })
      .pipe(rename(config.distName))
      .pipe(gulp.dest(config.distDirPath))
      .on('end', (err) => {
        util.log(`【${config.devName}、${config.distName}】compile complete`, 'debug')
        fs.unlinkSync(config.rollupDevFilePath)
        resolve && resolve()
      })
  })
}

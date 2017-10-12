const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const tap = require('gulp-tap');
const fs = require('fs')
const util = require('../util')

module.exports = async function compileJs(config, mergeUrls) {
  //合成xxtppt.js
  mergeUrls.push(config.rollupDevFilePath)
  gulp.src(mergeUrls)
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
    .pipe(rename(config.productionName))
    .pipe(tap((file, t) => {
      //增加版本头部
      file.contents = Buffer.concat([
        new Buffer(config.banner),
        file.contents
      ]);
    }))
    .pipe(gulp.dest(config.distDirPath))
    .pipe(gulp.dest(config.uploadJsPath))
    .on('end', async(err) => {
      util.log(`【${config.devName}、${config.productionName}】compile complete`, 'debug')
      fs.unlinkSync(config.rollupDevFilePath)
      await Promise.resolve()
    })
}

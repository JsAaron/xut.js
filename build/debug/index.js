/*************
  同步调试代码
***************/
const gulp = require('gulp');
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat')
const rollupBase = require('../rollup.base.conf.js')
const config = require('../../config')
const getExternalNames = require('../external.script')
const utils = require('../utils')

let args = process.argv[process.argv.length - 1]
args = args.split(',')
const debugConfig = _.extend(config.common, {
  rollup: config.common.distDir + 'rollup.dev.js',
  exclude: config.build.exclude,
  tragetDir: args[0],
  packMode: args[1],
  uglify: args[2]
});

/*压缩*/
const uglifyFile = function (filePath, fileName, cb) {
  gulp.src(filePath)
    .pipe(uglify())
    .pipe(concat(fileName))
    .pipe(gulp.dest(debugConfig.distDir))
    .on('end', cb)
}

/*拷贝*/
const copy = function () {
  const distDir = debugConfig.distDir
  const tragetDir = debugConfig.tragetDir
  try {
    fsextra.copySync(distDir, tragetDir)
    utils.log("Copy file successfully: " + distDir + ' to ' + tragetDir, 'red')
  } catch (err) {
    utils.log(err)
  }
}

/*合并外部文件*/
const buildExternal = function (fileNames) {
  return new Promise((resolve, reject) => {
    const externalName = 'external.js'
    gulp.src(fileNames)
      .pipe(concat(externalName))
      .on('error', (err) => {
        console.log('Less Error!', err.message);
        this.end();
      })
      .pipe(gulp.dest(debugConfig.distDir))
      .on('end', function () {
        resolve(externalName)
      })
  })
}

/*合并整包*/
const mergeuglify = function (externalName) {
  return new Promise((resolve, reject) => {
    console.log("Merge file")
    if (debugConfig.uglify === 'true') {
      gulp.src([debugConfig.distDir + externalName, debugConfig.rollup])
        .pipe(concat('xxtppt.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(debugConfig.distDir))
        .on('end', resolve)
    } else {
      gulp.src([debugConfig.distDir + externalName, debugConfig.rollup])
        .pipe(concat('xxtppt.dev.js'))
        .pipe(gulp.dest(debugConfig.distDir))
        .on('end', resolve)
    }
  })
}

rollupBase(debugConfig)
  .then(() => {
    /*只需要打包rollup模式,加快打包速度*/
    if (debugConfig.packMode === 'rollup') {
      if (debugConfig.uglify === 'true') {
        uglifyFile(debugConfig.rollup, 'rollup.min.js', copy)
      } else {
        copy()
      }
    }
  })
  .then(() => {
    /*支持全包*/
    if (debugConfig.packMode === 'all') {
      getExternalNames(debugConfig.srcDir, debugConfig.exclude).then(names => {
        buildExternal(names)
          .then(mergeuglify)
          .then(copy)
      })
    }
  })

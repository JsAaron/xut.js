/*************
  同步调试代码
***************/
const gulp = require('gulp');
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat')
const rollupBase = require('../rollup.base.conf.js')
const compileExternal = require('../external.script')

const util = require('../util')

/*压缩*/
const uglifyFile = function(filePath, fileName, cb) {
  gulp.src(filePath)
    .pipe(uglify())
    .pipe(concat(fileName))
    .pipe(gulp.dest(config.distDirPath))
    .on('end', cb)
}

/*拷贝*/
const copy = function(config) {
  const distDir = config.distDirPath
  const tragetDir = config.debug.targetDirPath
  try {
    fsextra.copySync(distDir, tragetDir)
    util.log("Copy file successfully: " + distDir + ' to ' + tragetDir, 'red')
  } catch (err) {
    util.log(err)
  }
}

/*合并整包*/
const mergeuglify = function(config, externalName) {
  return new Promise((resolve, reject) => {
    console.log("Merge file")

    function merge() {
      return gulp.src([util.joinPath(config.distDirPath, externalName), config.rollupDevFilePath])
    }
    if (config.debug.uglify === 'true') {
      merge()
        .pipe(concat(config.debug.minName))
        .pipe(uglify())
        .pipe(gulp.dest(config.distDirPath))
        .on('end', resolve)
    } else {
      merge()
        .pipe(concat(config.debug.devName))
        .pipe(gulp.dest(config.distDirPath))
        .on('end', resolve)
    }
  })
}


/**
 * 合并外部文件
 */
function buildExternal(distDirPath, fileNames) {
  return new Promise((resolve, reject) => {
    const externalName = 'external.js'
    gulp.src(fileNames)
      .pipe(concat(externalName))
      .on('error', (err) => {
        console.log('Less Error!', err.message);
        this.end();
      })
      .pipe(gulp.dest(distDirPath))
      .on('end', function() {
        resolve(externalName)
      })
  })
}

module.exports = (config) => {
  util.log("\nDebug Mode: Packed File", 'red')
  rollupBase({
      entry: config.entry,
      aliases: config.aliases,
      distDirPath: config.distDirPath,
      rollupDevFilePath: config.rollupDevFilePath
    }, config.debug.mode === 'rollup' ? true : false) //如果只是打包rollup不清理
    .then(function() {
      /*只需要打包rollup模式,加快打包速度*/
      if (config.debug.mode === 'rollup') {
        if (config.debug.uglify === 'true') {
          uglifyFile(config.rollupDevFilePath, config.debug.minName, () => copy(config))
        } else {
          copy(config)
        }
      }
    })
    .then(function() {
      /*支持全包*/
      if (config.debug.mode === 'all') {
        compileExternal({
          exclude: config.exclude,
          basePath: config.basePath,
          externalFiles: config.externalFiles
        }).then(names => {
          buildExternal(config.distDirPath, names)
            .then(function(externalName) {
              return mergeuglify(config, externalName)
            })
            .then(() => copy(config))
        })
      }
    })

}

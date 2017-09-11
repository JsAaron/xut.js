/*************
  同步调试代码
***************/
const gulp = require('gulp');
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat')
const compileRollup = require('../rollup.base.conf.js')
const compileExternal = require('../external.script')
const util = require('../util')

/**
 * 压缩
 */
function uglifyFile(filePath, fileName, cb) {
  gulp.src(filePath)
    .pipe(uglify())
    .pipe(concat(fileName))
    .pipe(gulp.dest(config.distDirPath))
    .on('end', cb)
}

/**
 * 拷贝
 */
function copy(config) {
  const distDir = config.distDirPath
  const tragetDir = config.debug.targetDirPath
  try {
    fsextra.copySync(distDir, tragetDir)
    util.log("Copy file successfully: " + distDir + ' to ' + tragetDir, 'red')
  } catch (err) {
    util.log(err)
  }
}

/**
 * 合并整包
 */
function mergeuglify(config, externalName) {
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
function mergeExternal(distDirPath, fileNames) {
  return new Promise((resolve) => {
    const externalName = 'external.js'
    gulp.src(fileNames)
      .pipe(concat(externalName))
      .on('error', (err) => {
        console.log('Less Error!', err.message);
        this.end();
      })
      .pipe(gulp.dest(distDirPath))
      .on('end', () => {
        resolve(externalName)
      })
  });
}

module.exports = async(config) => {
  util.log("\nDebug Mode: Packed File", 'red')

  await compileRollup({
    entry: config.entry,
    aliases: config.aliases,
    distDirPath: config.distDirPath,
    rollupDevFilePath: config.rollupDevFilePath
  }, config.debug.mode === 'onlyRollup' ? true : false) //如果只是打包rollup不清理

  //只需要打包rollup模式,加快打包速度
  if (config.debug.mode === 'onlyRollup') {
    if (config.debug.uglify === 'true') {
      uglifyFile(config.rollupDevFilePath, config.debug.minName, () => copy(config))
    } else {
      copy(config)
    }
  }

  //支持全包
  if (config.debug.mode === 'all') {
    const scriptUrls = await compileExternal({
      exclude: config.exclude,
      basePath: config.basePath,
      externalFiles: config.externalFiles
    })
    const externalName = await mergeExternal(config.distDirPath, scriptUrls)
    await mergeuglify(config, externalName)
    await copy(config)
  }

}

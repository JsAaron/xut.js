const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const fs = require('fs')
const _ = require("underscore")
const fsextra = require('fs-extra')
const config = require('../config')
const conf = config.build.conf

const rootPath = conf.srcDir + 'content/'
const contentFiles = fs.readdirSync(rootPath)

/**
 * 编译文件的j's
 * traverse：是不是子节点: 默认递归
 */
const compilecJs = function(srcPath, callback, traverse = true) {

  console.log('start compile: ' + srcPath)

  let minPath = srcPath + '.min';
  //copy all files
  fsextra.copySync(srcPath, minPath);

  //如果递归全部
  //否则不扫描子路径
  let scanPath = traverse ? minPath + '/**/*.js' : minPath + '/*.js'

  //replace js
  gulp.src(scanPath)
    .pipe(uglify())
    .pipe(gulp.dest(minPath))
    .on('error', (err) => {
      console.log('concat Error!', err.message);
      this.end();
    })
    .on('end', (err) => {
      console.log('compile complete: ' + minPath)
      callback && callback()
    })
}


const eachFile = function(src) {
  const compile = []
  _.each(fs.readdirSync(src), file => {
    let filePath = src + file
    let stat = fs.lstatSync(filePath);
    //是目录
    if (stat.isDirectory()) {
      let widgetPath = filePath + '/widget'
      let exists = fs.existsSync(widgetPath)
      if (exists) {
        let widgetFiles = fs.readdirSync(widgetPath)
        _.each(widgetFiles, file => {
          //is widget files
          if (/^\d+$/ig.test(file)) {
            compile.push(callback => {
              compilecJs(widgetPath + '/' + file, callback)
            })
          }
        })
      }
    }
  })

  function startCompile() {
    if (compile && !compile.length) {
      return
    }
    let pop = compile.pop()
    pop(() => startCompile())
  }

  startCompile()
}


//指定编译
//206 81
//contentName widgetName 是否递归
let hasWidgetSerial = process.argv[process.argv.length - 1]
if (hasWidgetSerial) {
  let hasValue
  if (hasValue = hasWidgetSerial.match(/(\d+)-(\d+)/)) {
    let contentName = hasValue[1]
    let widgetName = hasValue[2]
    let path = rootPath + contentName + '/widget/' + widgetName
    compilecJs(path, function() {}, false)
    return
  }
}

//全部编辑
eachFile(rootPath)

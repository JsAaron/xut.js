const gulp = require('gulp');
const fsextra = require('fs-extra')
const _ = require("underscore");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat')
const base = require('../rollup.base.conf.js')
const config = require('../../config')
const getSrcipt = require('../external.script')
const utils = require('../utils')

let debugDir, args, scriptUrl, conf

args = process.argv[process.argv.length - 1]
args = args.split('=')
if (args[0] == 'debug') {
  debugDir = args[1]
}

scriptUrl = []
conf = _.extend(config.common, {
  rollup: config.common.tarDir + 'rollup.js',
  exclude: config.build.exclude,
  debugDir: debugDir
});


gulp.task('mergescript', (cb) => {
  gulp.src(scriptUrl)
    .pipe(concat(conf.devName))
    .on('error', (err) => {
      console.log('Less Error!', err.message);
      this.end();
    })
    .pipe(gulp.dest(conf.tarDir))
    .on('end', cb)
});


gulp.task('mergeall', (cb) => {
  //合成xxtppt.js
  scriptUrl.push(conf.rollup)
  gulp.src(scriptUrl)
    .pipe(concat(conf.distName))
    .on('error', (err) => {
      console.log('Less Error!', err.message);
      this.end();
    })
    .pipe(uglify())
    .pipe(gulp.dest(conf.tarDir))
    .on('end', cb)
});


const copy = () => {
  try {
    // fsextra.removeSync(conf.rollup)
    // fsextra.copySync(conf.tarDir, conf.debugDir)
    console.log("copy files successfully: " + conf.debugDir)
  } catch (err) {
    console.error(err)
  }
}


const mergeuglify = (scriptUrl, cb) => {
  scriptUrl.push(conf.rollup)
  console.log("【merge files】")
  gulp.src(scriptUrl)
    .pipe(concat(conf.distName))
    .on('error', (err) => {
      console.log('Less Error!', err.message);
      this.end();
    })
    .pipe(uglify())
    .pipe(gulp.dest(conf.debugDir))
    .on('error', (err) => {
      console.log('Less Error!', err.message);
      this.end();
    })
    .on('end', () => {
      utils.log("write: " + conf.debugDir + '/' + conf.distName, 'red')
    })
}

base(conf, true)
  .then(() => {
    return getSrcipt(conf)
  })
  .then((scriptUrl) => {
    mergeuglify(scriptUrl)
  })

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat')
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const csspath = './src/css/**/*.css'
const utils = require('../utils')


function createFile(fileName, path, conf, resolve, reject) {
    gulp.src(path)
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(concat(fileName + '.dev.css'))
        .pipe(gulp.dest(conf.tarDir))
        .pipe(gulp.dest(conf.testDir))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename(fileName + '.css'))
        .pipe(gulp.dest(conf.tarDir))
        .pipe(gulp.dest(conf.testDir))
        .pipe(gulp.dest('./template/test/css'))
        .on('error', (err) => {
            utils.log('【css】compile complete error', 'debug')
            reject()
        })
        .on('end', () => {
            utils.log('【css ' + fileName + '】compile complete', 'debug')
            resolve()
        })
}

module.exports = (conf) => {
    return new Promise((resolve, reject) => {
        let sucCount = 2
        let failCount = 2
        let success = function() {
            if (sucCount === 1) {
                resolve()
                return
            }
            sucCount--
        }
        let fail = function() {
            if (failCount === 1) {
                reject()
                return
            }
            failCount--
        }
        createFile('xxtppt', [csspath, '!./src/css/font.css'], conf, success, fail)
        createFile('font', ['./src/css/font.css'], conf, success, fail)
    })
}

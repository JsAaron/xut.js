const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const fsextra = require('fs-extra')
const express = require('express');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const ora = require('ora')
const _ = require("underscore");

const base = require('../rollup.base.conf')
const readsrcipt = require('./script')
const compilercss = require('./css')
const startserver = require('./server')


let config = require('../../config')

const app = express();
let conf = _.extend(config.build.conf, {
    rollup: config.build.conf.tarDir + 'rollup.js',
    exclude: config.build.exclude,
    server: config.build.server
});

console.log(conf)
const spinner = ora('Begin to pack , Please wait for\n')
spinner.start()
const stop = () => {
    spinner.stop()
}

base(conf, stop)
    .then(() => {
        return readsrcipt(conf)
    }, stop)
    .then((scriptUrl) => {
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
    }, stop)
    .then(() => {
        return compilercss(conf)
    }, stop)
    .then(() => {
        return startserver(conf)
    }, stop)
    .then(stop, stop)

const browserSync = require("browser-sync");
const gulp = require('gulp');
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const open = require("open")
const fsextra = require('fs-extra')
const cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');
// var uglify = require('uglify-js')
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const ora = require('ora')


browserSync({
    server: {
        //指定服务器启动根目录
        baseDir: "./src",
        index: "test.iframe.html"
    },
    port: 8000,
    open: 'local'
});
//监听任何文件变化，实时刷新页面
watch('src/test/xxtppt.js', function() {
    // alert(111)
})

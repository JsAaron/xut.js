const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const concat = require('gulp-concat')
const fs = require('fs')
const _ = require("underscore")
const fsextra = require('fs-extra')
const config = require('../../config')
const conf = config.build.conf

const rootPath = conf.srcDir + 'content/'
const contentFiles = fs.readdirSync(rootPath)

const writeFile = (filename, content) => {
    fs.writeFileSync(filename, content, {
        encoding: 'utf8',
        flag: 'w+'
    })
}


const eachFile = function(src) {
    const compile = []
    _.each(fs.readdirSync(src), function(file) {
        let filePath = src + file
        let stat = fs.lstatSync(filePath);
        //是目录
        if (stat.isDirectory()) {
            let widgetPath = filePath + '/widget'
            let exists = fs.existsSync(widgetPath)
            if (exists) {
                let widgetFiles = fs.readdirSync(widgetPath)
                _.each(widgetFiles, function(file) {
                    //is widget files
                    if (/^\d+$/ig.test(file)) {
                        compile.push(function(callback) {
                            let srcPath = widgetPath + '/' + file
                            let minPath = widgetPath + '/' + file + '.min'
                            //copy all files
                            fsextra.copySync(srcPath, minPath)
                            //replace js
                            gulp.src(minPath + '/**/*.js')
                                .pipe(uglify())
                                .pipe(gulp.dest(minPath))
                                .on('error', (err) => {
                                    console.log('concat Error!', err.message);
                                    this.end();
                                })
                                .on('end', (err) => {
                                    console.log(
                                        '【' + minPath + '】compile complete'
                                    )
                                    callback && callback()
                                })
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
        pop(function() {
            startCompile()
        })
    }

    startCompile()
}

eachFile(rootPath)

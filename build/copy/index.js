const fs = require("fs")
const path = require('path');
const fsextra = require('fs-extra')
const cp = require('child_process')
const _ = require("underscore");
const createRE = require('./filter')
const filterRE = createRE()

//./build/.config.js
//./build/dev/test.js
//build/dev/webpack.dev.conf.js
const segmentation = new RegExp("[.]?\\w+([.]?\\w*)*", "ig")
const excludeRE = new RegExp("epub|安装说明|.git|node_modules|README", "ig")

// console.log(
//     '【Regular filter】\n' +
//     filterRE +
//     '\n'
// )

const copy = function(src, dist) {
    console.log('dist: ' + dist)
    let count = 0
    let files = fs.readdirSync(dist);
    for (file of files) {
        if (!excludeRE.test(file)) {
            fsextra.removeSync(dist + file)
        }
    }
    let ls = (ff) => {
        var files = fs.readdirSync(ff);
        for (fn in files) {
            var rootPath = ff + path.sep
            var filename = rootPath + files[fn]
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory() == true) {
                ls(filename)
            } else {
                if (!filterRE.test(rootPath)) {
                    ++count
                    fsextra.copySync(filename, dist + filename)
                }
            }
        }
    }
    ls(src)
}

copy('.', '/Users/mac/project/git/es6-magazine/')
copy('.', '/Users/mac/project/svn/server/magazine-develop/assets/www/')

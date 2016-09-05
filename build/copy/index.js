const fs = require("fs")
const path = require('path');
const fsextra = require('fs-extra')
const cp = require('child_process')
const _ = require("underscore");
const createRE = require('./filter')

const src = '.'
const dists = [
    '/Users/mac/project/git/es6-magazine/',
    '/Users/mac/project/svn/server/magazine-develop/assets/www/'
]

const filterRE = createRE()

//./build/.config.js
//./build/dev/test.js
//build/dev/webpack.dev.conf.js
const segmentation = new RegExp("[.]?\\w+([.]?\\w*)*", "ig")
const excludeRE = new RegExp(".git|.svn|node_modules|README.md|README.gif", "ig")

console.log(
    '【Regular filter】\n' +
    filterRE +
    '\n'
)


const del = (dist) => {
    var files = fs.readdirSync(dist);
    for (file of files) {
        if (!excludeRE.test(file)) {
            fsextra.removeSync(dist + file)
        }
    }
    console.log('del: ' + dist)
}

const ls = (src, dist) => {
    var files = fs.readdirSync(src);
    for (fn in files) {
        var rootPath = src + path.sep
        var filename = rootPath + files[fn]
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory() == true) {
            ls(filename,dist)
        } else {
            if (!filterRE.test(rootPath)) {
                 fsextra.copySync(filename, dist + filename)
            }
        }
    }
}


dists.forEach((dist) => {
    del(dist)
    ls(src, dist)
    console.log('copy: ' + dist)
})



const fs = require("fs")
const path = require('path');
const fsextra = require('fs-extra')
const _ = require("underscore");
const createRE = require('./filter')
const getAllFiles = require('./getfiles')

const hash = () => {
    return Object.create(null)
}
const src = '.'
const dist = process.platform === 'win32' ?
    'd:\\git\\magazine-develop\\' :
    '/Users/mac/project/git/es6-magazine/'

const filterRE = createRE()

//./build/.config.js
//./build/dev/test.js
//build/dev/webpack.dev.conf.js
const segmentation = new RegExp("[.]?\\w+([.]?\\w*)*", "ig")

console.log(filterRE)
console.log('\n')

function ls(ff) {
    var files = fs.readdirSync(ff);
    for (fn in files) {
        var rootPath = ff + path.sep
        var filename = rootPath + files[fn]
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory() == true) {
            ls(filename);
        } else {
            if (!filterRE.test(filename)) {
                fsextra.copySync(filename, dist + filename)
            }
        }
    }
}
ls('.');

console.log('【fsextra is complete】')

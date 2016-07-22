const fs = require("fs")
const path = require('path');
const fsextra = require('fs-extra')
const _ = require("underscore");
const createRE = require('./filter')

const hash = () => {
    return Object.create(null)
}
const src = '.'
const dist = '/Users/mac/project/git/es6-magazine/'

const filterRE = createRE()

//./build/.config.js
//./build/dev/test.js
//build/dev/webpack.dev.conf.js
const segmentation = new RegExp("[.]?\\w+([.]?\\w*)*", "ig")

console.log(
    '【Regular filter】\n' +
    filterRE +
    '\n'
)

let count = 0

const ls = (ff) => {
    var files = fs.readdirSync(ff);
    for (fn in files) {
        var rootPath = ff + path.sep
        var filename = rootPath + files[fn]
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory() == true) {
            ls(filename);
        } else {
            if (!filterRE.test(rootPath)) {
                ++count
                fsextra.copySync(filename, dist + filename)
            }
        }
    }
}
ls('.');

console.log('\n【fsextra is complete, Copy \x1b[1m\x1b[34m' + count + '\x1b[39m\x1b[22m files】\n')





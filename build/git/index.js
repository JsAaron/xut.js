const fs = require("fs")
const fsextra = require('fs-extra')
const _ = require("underscore");
const excludeRE = require('./exclude')

const hash = () => {
    return Object.create(null)
}
const src = './'
const dist = '/Users/mac/project/git/es6-magazine/'

const matchRE = excludeRE()
    // const recursion = matchRE.index


// var count = 0
// var fileCollect = hash()

// function parse(path) {
//     var express = matchRE.express[count++]
//     var matchkey = Object.keys(express)[0]
//     var matchVal = express[matchkey]
//     var files = fs.readdirSync(path)
//     while (files.length) {
//         var filename = files.pop()
//         if (!matchVal.test(filename)) {
//             parse(path + '/' + filename)
//         }
//     }
// }


// parse(src, fileCollect)


console.log('【fsextra is starting】')
var files = fs.readdirSync(src)
while (files.length) {
    var filename = files.pop()
    var express = matchRE.express[0]
    var matchkey = Object.keys(express)[0]
    var matchVal = express[matchkey]
    if (!matchVal.test(filename)) {
        fsextra.copySync(src + filename, dist + filename)
    }
}

console.log('【fsextra is complete】')

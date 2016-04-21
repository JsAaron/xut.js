var fs = require('fs')
var src = './src/'
var lib = src + 'lib'
var entry = lib + '/app.js'
var moduleName = 'Aaron'
var version = process.env.VERSION;


var banner =
    '/*!\n' +
    ' * build.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Aaron\n' +
    ' * Released under the MIT License.\n' +
    ' */'


function escape(str) {
    var strs = new Array();
    var a = str;
    strs = a.split("");
    for (var i = 0; i < strs.length; i++) {
        a = a.replace("\\", "/")
    }
    return a;
}


function logError(e) {
    console.log(e)
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}


function blue(str) {
    return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}


function write(path, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, code, function(err) {
            if (err) return reject(err)
            console.log('write: ' + blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}


/**
 * 替换所有反斜杠为斜杠
 * @return {[type]} [description]
 */
module.exports.escape = escape

module.exports.src = src
module.exports.lib = lib
module.exports.entry = entry
module.exports.moduleName = moduleName
module.exports.version = version

module.exports.logError = logError
module.exports.log = logError
module.exports.write = write
module.exports.banner = banner

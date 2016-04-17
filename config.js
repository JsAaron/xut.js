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


function logError(e) {
    console.log(e)
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}


function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
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


module.exports.src = src
module.exports.lib = lib
module.exports.entry = entry
module.exports.moduleName = moduleName
module.exports.version = version

module.exports.logError = logError
module.exports.write = logError
module.exports.banner = banner

const fs = require('fs');
const _ = require("underscore")
const fsextra = require('fs-extra')
const watch = require('gulp-watch');

const sqlite = require('./sqlite/index')
const utils = require('./utils')

const GALLERY = 'gallery'
const WIDGET = 'widget'
const DBNAME = 'xxtebook.db'


const get = function(paths, callback) {
    if (!paths.length) {
        utils.log(`\nconvert a json SQLResult.js\n`)
        callback()
        return
    }
    let path = paths.shift()
    if (!fs.existsSync(path + '/SQLResult.js')) {
        utils.log('【SQLResult.js not available!】')
        sqlite.resolve(path, path + '/' + DBNAME, function() {
            utils.log(`解析数据: ${path + '/' + DBNAME}`)
            get(paths, callback)
        })
    } else {
        get(paths, callback)
    }
}


const getPaths = function(path) {
    const files = fs.readdirSync(path)
    const arr = []
    const parse = []
    _.each(files, file => {
        var stat = fs.lstatSync(path + file);
        if (stat.isDirectory()) {
            if (file == GALLERY || file == WIDGET) {} else {
                parse.push(path + file)
            }
        } else {
            if (file === DBNAME) {
                parse.push(path)
            }
        }
    })
    return parse
}


const monitor = (path) => {
    let paths = path + '**/*.db'
    watch(paths, {
        events: ['add', 'change']
    }, (name) => {
        utils.log(`${name} is change`)
        get(getPaths(path), function() {
            utils.log(`${name} is complete`)
        })
    })
}



module.exports = (root) => {
    const path = root + 'content/'
    get(getPaths(path), function() {
        monitor(path)
    })
}

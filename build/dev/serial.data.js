const sqlite = require('../sqlite/index')
const fs = require('fs');
const _ = require("underscore")
const fsextra = require('fs-extra')
const watch = require('gulp-watch');

const GALLERY = 'gallery'
const WIDGET = 'widget'
const DBNAME = 'xxtebook.db'



const get = function(paths, callback) {
    if (!paths.length) {
        console.log(`数据解析完毕`)
        callback()
        return
    }
    let path = paths.shift()
    if (!fs.existsSync(path + '/SQLResult.js')) {
        console.log('【SQLResult.js not available!】')
        sqlite.resolve(path, path + '/' + DBNAME, function() {
            console.log(`解析数据: ${path + '/' + DBNAME}`)
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
        console.log(`${name} is change`)
        get(getPaths(path), function() {
            console.log(`${name} is complete`)
        })
    })
}



module.exports = (conf) => {
    const path = conf.srcDir + 'content/'
    get(getPaths(path), function() {
        monitor(path)
    })
}

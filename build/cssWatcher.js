const fs = require('fs');
const watch = require('gulp-watch');
const utils = require('./utils')
var querystring = require('querystring');
const monitor = (path, cb) => {
    let paths = path + "*.css"
    watch(paths, {
        events: ['add', 'change']
    }, (name) => {
        var result = querystring.stringify(name, '*', '$');
        var regResult = result.match(/(css%5C).+(\.css)/)
        var str1 = regResult[0];
        var str2 = regResult[1];
        var cssName = str1.substring(str2.length)
        paths = path + cssName;
        utils.log(`${paths} has changed`)
        cb()
    })
}



module.exports = (root, cb) => {
    const path = root + 'css/'
    monitor(path, cb)
}

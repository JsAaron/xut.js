var webpack = require('webpack')

//www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var webpackconfig = require('./webpack.config')

var config     = require('./config')
var src        = config.src
var lib        = config.lib
var entry      = config.entry
var moduleName = config.moduleName
var logError   = config.logError
var banner     = config.banner
var write      = config.write

//pack for dev 
var rolluppack = src + 'dev/dev.js'
var database   = require('./sqlite/index')


var bable = function(success, fail) {
    var compiler = webpack(webpackconfig);
    compiler.watch({
        // aggregateTimeout: 200, 
        // poll: true 
    }, function(err, stats) {
        if (err) {
            console.log('打包失败')
            fail && fail()
            return
        }
        success && success()
        success = null;
    });

}
  
var promise = new Promise(function(resolve, reject) {
    bable(resolve, reject)
}).then(function() {
    return new Promise(function(resolve, reject) {
        database.resolve(resolve)
    })
}).then(function() {
    browserSync.init({
        server: src,
        index: 'horizontal-test.html',
        port: 3000,
        open: true,
        files: [rolluppack, "index.html", "horizontal-test.html"]
    });
})


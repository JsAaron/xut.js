const browserSync = require("browser-sync");
const config = require('../../config')
const build = require('../build/build')

const noop = function() {}

build(noop).then((conf) => {
    browserSync({
        port: config.remote.port || 3000,
        server: {
            baseDir: "./src",
            index: "test.iframe.html"
        },
        open: true
    });
}, noop)

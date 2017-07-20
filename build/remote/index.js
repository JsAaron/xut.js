const bs = require("browser-sync");
const watch = require('gulp-watch');
const config = require('../config')
const build = require('../build/build')

const noop = function() {}
const wacthFilesPath = config.remote.wacthFilesPath


build(noop).then((conf) => {
  bs({
    port: config.remote.port || 3000,
    server: {
      baseDir: "./src",
      index: "test.iframe.html"
    },
    open: true
  })

  watch(wacthFilesPath, function() {
    build(noop).then(bs.reload)
  })

}, noop)

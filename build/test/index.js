const killOccupied = require('../kill.occupied')
const fsextra = require('fs-extra')
const browserSync = require("browser-sync");
const prot = 8000
const watch = require('gulp-watch');
const buildName = process.argv[process.argv.length - 1]

killOccupied(prot, () => {
  let baseDir = 'www'
  if (buildName) {
    baseDir = buildName
  }
  const bs = browserSync({
    port: prot,
    server: {
      baseDir: `./test/${baseDir}`,
      index: "index.html"
    },
    open: true
  })

  watch(['test/**/*.js', 'test/**/*.css', 'test/**/*.html'], {
    events: ['add', 'change', 'unlink ']
  }, (name) => {
    bs.reload();
  })
})

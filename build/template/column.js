const killOccupied = require('../kill.occupied')
const fsextra = require('fs-extra')
const browserSync = require("browser-sync");


const prot = 8000

killOccupied(prot, () => {
  browserSync({
    port: prot,
    server: {
      baseDir: 'template/column',
      index: "index.html"
    },
    open: true
  })
})

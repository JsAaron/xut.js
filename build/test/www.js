const killOccupied = require('../kill.occupied')
const fsextra = require('fs-extra')
const browserSync = require("browser-sync");
const convertSVG = require('../convert.svg')
const serialData = require('../serial.data')

const prot = 8000

killOccupied(prot, () => {

    fsextra.copySync('dist/xxtppt.js', 'template/www/lib/xxtppt.js')
    fsextra.copySync('dist/version.js', 'template/www/lib/version.js')
    fsextra.copySync('dist/xxtppt.css', 'template/www/css/xxtppt.css')

    browserSync({
        port: prot,
        server: {
            baseDir: 'template/www',
            index: "index.html"
        },
        open: true
    })
})

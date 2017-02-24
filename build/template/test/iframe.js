const killOccupied = require('../kill.occupied')
const fsextra = require('fs-extra')
const browserSync = require("browser-sync");
const convertSVG = require('../convert.svg')
const serialData = require('../serial.data')

const prot = 8000

killOccupied(prot, () => {

    browserSync({
        port: prot,
        server: {
            baseDir: 'template/iframe',
            index: "test.html"
        },
        open: true
    })
})

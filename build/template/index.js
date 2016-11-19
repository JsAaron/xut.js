
const killOccupied = require('../kill.occupied')
const browserSync = require("browser-sync");
const convertSVG = require('../convert.svg')
const serialData = require('../serial.data')

const prot = 8000
const rootPath = './apk/'

killOccupied(prot, () => {

	convertSVG(rootPath)
	serialData(rootPath)

    browserSync({
        port: prot,
        server: {
            baseDir: rootPath,
            index: "index.html"
        },
        open: true
    })
})

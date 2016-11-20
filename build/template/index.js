const killOccupied = require('../kill.occupied')
const fsextra = require('fs-extra')
const browserSync = require("browser-sync");
const convertSVG = require('../convert.svg')
const serialData = require('../serial.data')

const prot = 8000
const rootPath = './apk/'
const sqlPath = rootPath + 'content/SQLResult.js'
const targetSqlPath =  rootPath + 'datacache/SQLResult.js'

killOccupied(prot, () => {

    convertSVG(rootPath)
    serialData(rootPath)

    fsextra.copySync(sqlPath, targetSqlPath)

    browserSync({
        port: prot,
        server: {
            baseDir: rootPath,
            index: "index.html"
        },
        open: true
    })
})

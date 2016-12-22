const fs = require('fs')
const utils = require('../utils')
const readFile = (path) => {
    return fs.readFileSync(path, {
        flag: 'r+',
        encoding: 'utf8'
    })
}

const writeFile = (filename, content) => {
    fs.writeFileSync(filename, content, {
        encoding: 'utf8',
        flag: 'w+'
    })
}

module.exports = (conf) => {
    return new Promise((resolve, reject) => {
        let rpath = conf.tarDir + conf.devName
        let wpath = conf.tarDir + 'version.js'
        let data = readFile(rpath)
        let vs = data.match(/Xut.Version\s?=\s?\d*([.]?\d*)/ig)[0].split('=')[1].trim()
        utils.log(`【create Xut.Version = ${vs}】`, 'debug')
        writeFile(wpath, vs)
        writeFile('./template/test/lib/version.js', vs)
        resolve && resolve()
    })
}

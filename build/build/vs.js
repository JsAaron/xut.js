const fs = require('fs')

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
        let vs = data.match(/Xut.Version\s?=\s?(\d)+/ig)[0].match(/\d+/ig)[0]
        writeFile(wpath, vs)
        resolve && resolve()
    })
}

const fs = require('fs')
const util = require('../util')

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

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    const rPath = util.joinPath(config.distDirPath, config.devName)
    const wPath = util.joinPath(config.distDirPath, 'version.js')
    const data = readFile(rPath)
    const vs = data.match(/Xut.Version\s?=\s?\d*([.]?\d*)/ig)[0].split('=')[1].trim()
    util.log(`【create Xut.Version = ${vs}】`, 'debug')
    writeFile(wPath, vs)
    resolve && resolve()
  })
}

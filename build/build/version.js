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
    let version = config.version
    if (!version) {
      let rPath = util.joinPath(config.distDirPath, config.devName)
      let data = readFile(rPath)
      let version = data.match(/Xut.Version\s?=\s?\d*([.]?\d*)/ig)[0].split('=')[1].trim()
    }
    const wirtePath = util.joinPath(config.distDirPath, 'version.js')
    util.log(`【create Xut.Version = ${config.version}】`, 'debug')
    writeFile(wirtePath, config.version)
    resolve && resolve()
  })
}

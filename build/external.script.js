const fs = require('fs')
const path = require('path')
const util = require('./util')

module.exports = ({
  exclude,
  basePath,
  externalFiles,
}) => {
  return new Promise((resolve, reject) => {
    let paths = []
    let len = exclude.length
    if (len) {
      exclude = exclude.join(',')
      exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
    }
    externalFiles.jsName.forEach((path) => {
      if (!exclude.test(path)) {
        paths.push(util.joinPath(basePath, path))
      }
    })
    util.log(`external file：${paths.length}`, 'debug')
    resolve(paths)
  })
}

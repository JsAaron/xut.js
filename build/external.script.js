const fs = require('fs')
const path = require('path')
const util = require('./util')

module.exports = ({
  exclude,
  externalFiles,
  templateDirPath
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
        paths.push(util.joinPath(templateDirPath, path))
      }
    })
    util.log(`external file：${paths.length}`, 'debug')
    resolve(paths)
  })
}

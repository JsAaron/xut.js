const fs = require('fs')
const path = require('path')
const util = require('./util')

module.exports = async function compileExternal({
  exclude,
  basePath,
  externalFiles,
}) {
  let paths = []
  if (exclude.length) {
    exclude = exclude.join(',')
    exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
  }
  externalFiles.jsName.forEach((path) => {
    if (!exclude.test(path)) {
      paths.push(util.joinPath(basePath, path))
    }
  })
  util.log(`external file：${paths.length}`, 'debug')
  return await paths;
}

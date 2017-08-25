const fs = require('fs')
const path = require('path')
const util = require('./util')

async function compileExternal({
  exclude,
  basePath,
  externalFiles,
}) {
  const paths = []
  const len = exclude.length
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

  return await Promise.resolve(paths)
}


module.exports = compileExternal

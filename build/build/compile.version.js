const util = require('../util')
const fsextra = require('fs-extra')

module.exports = async function compileVersion(config) {
  const version = config.version || util.getVersion(config.distDirPath, config.devName)
  util.log(`【create Xut.Version = ${version}】`, 'debug')
  util.writeFile(util.joinPath(config.distDirPath, 'version.js'), config.version)
  fsextra.copySync(config.distDirPath + '/version.js', config.uploadJsPath + '/version.js')
}

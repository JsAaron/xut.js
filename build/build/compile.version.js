const util = require('../util')

module.exports = async function compileVersion(config) {
  let version = config.version
  if (!version) {
    version = util.getVersion(config.distDirPath, config.devName)
  }
  const wirtePath = util.joinPath(config.distDirPath, 'version.js')
  util.log(`【create Xut.Version = ${config.version}】`, 'debug')
  util.writeFile(wirtePath, config.version)
}

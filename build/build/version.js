const util = require('../util')

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    let version = config.version
    if (!version) {
      version = util.getVersion(config.distDirPath, config.devName)
    }
    const wirtePath = util.joinPath(config.distDirPath, 'version.js')
    util.log(`【create Xut.Version = ${config.version}】`, 'debug')
    util.writeFile(wirtePath, config.version)
    resolve && resolve()
  })
}

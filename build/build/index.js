const rollup = require('../rollup.base.conf')

const compileExternal = require('../external.script')
const compileJs = require('./compile.js')
const compileCSS = require('./compile.css')
const buildVersion = require('./version')

const buildName = process.argv[process.argv.length - 1] || 'webpack-full-dev'
const config = require('../config')(buildName)

rollup({
    entry: config.entry,
    aliases:config.aliases,
    distDirPath: config.distDirPath,
    rollupDevFilePath: config.rollupDevFilePath
  })
  .then(() => {
    return compileExternal({
      exclude: config.exclude,
      templateDirPath: config.templateDirPath,
      externalFiles: config.externalFiles
    })
  })
  .then((scriptUrls) => {
    return compileJs(config, scriptUrls)
  })
  .then(() => {
    return buildVersion(config)
  })
  .then(() => {
    return compileCSS(config)
  })

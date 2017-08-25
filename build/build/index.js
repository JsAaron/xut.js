const compileRollup = require('../rollup.base.conf')

const compileExternal = require('../external.script')
const compileJs = require('./compile.js')
const compileCSS = require('./compile.css')
const compileVersion = require('./compile.version')
const buildName = process.argv[process.argv.length - 1] || 'webpack-full-dev'
const config = require('../config')(buildName)


async function compileRelease() {

  await compileRollup({
    entry: config.entry,
    banner: config.banner,
    aliases: config.aliases,
    distDirPath: config.distDirPath,
    rollupDevFilePath: config.rollupDevFilePath
  })

  const scriptUrls = await compileExternal({
    exclude: config.exclude,
    basePath: config.basePath,
    externalFiles: config.externalFiles
  })

  await compileJs(config, scriptUrls)
  await compileCSS(config)
  await compileVersion(config)
}

compileRelease()


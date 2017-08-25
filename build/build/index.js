const compileRollup = require('../rollup.base.conf')
const compileExternal = require('../external.script')
const compileJs = require('./compile.js')
const compileCSS = require('./compile.css')
const compileVersion = require('./compile.version')
const buildName = process.argv[process.argv.length - 1] || 'webpack-full-dev'
const config = require('../config')(buildName);

(async() => {
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

  const jsPromise = compileJs(config, scriptUrls)
  const cssPromise = compileCSS(config)
  const versionPromise = compileVersion(config)
  await jsPromise
  await cssPromise
  await versionPromise
})();

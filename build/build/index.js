const rollup = require('../rollup.base.conf')
const getScript = require('../external.script')
const compilerCSS = require('./compiler.css')
const compilerJs = require('./compiler.js')
const version = require('./version')
const _ = require("underscore");
const config = require('../../config')

const buildConfig = _.extend(config.build.conf, {
  rollup: config.build.conf.distDir + 'rollup.dev.js',
  exclude: config.build.exclude,
  server: config.build.server
})

rollup(buildConfig)
  .then(() => {
    return getScript(buildConfig.srcDir, buildConfig.exclude)
  })
  .then((scriptUrl) => {
    return compilerJs(buildConfig, scriptUrl)
  })
  .then(() => {
    return version(buildConfig)
  })
  .then(() => {
    return compilerCSS(buildConfig)
  })

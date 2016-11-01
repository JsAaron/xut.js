const rollup = require('../rollup.base.conf')
const getScript = require('../external')
const compilerCSS = require('./compiler.css')
const compilerJs = require('./compiler.js')
const version = require('./version')
const webServer = require('./test.server')
const _ = require("underscore");
const config = require('../../config')

const conf = _.extend(config.build.conf, {
    rollup: config.build.conf.tarDir + 'rollup.js',
    exclude: config.build.exclude,
    server: config.build.server
})

rollup(conf)
    .then(() => {
        return getScript(conf)
    })
    .then((scriptUrl) => {
        return compilerJs(conf, scriptUrl)
    })
    .then(() => {
        return version(conf)
    })
    .then(() => {
        return compilerCSS(conf)
    })
    .then(() => {
        webServer(conf)
    })

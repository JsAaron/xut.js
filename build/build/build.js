const ora = require('ora')
const base = require('../rollup.base.conf')
const getScript = require('../external')
const compilerCSS = require('./compiler.css')
const compilerJs = require('./compiler.js')
const version = require('./version')
const _ = require("underscore");
const config = require('../../config')

const conf = _.extend(config.build.conf, {
    rollup  : config.build.conf.tarDir + 'rollup.js',
    exclude : config.build.exclude,
    server  : config.build.server
});


module.exports = (stop) => {
    return new Promise((resolve, reject) => {
        base(conf, stop)
            .then(() => {
                return getScript(conf)
            }, stop)
            .then((scriptUrl) => {
                return compilerJs(conf, scriptUrl, stop)
            }, stop)
            .then(() => {
                return version(conf)
            }, stop)
            .then(() => {
                return compilerCSS(conf)
            }, stop)
            .then(() => {
                return resolve(conf)
            }, stop)
    })
}

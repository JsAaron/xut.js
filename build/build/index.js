const ora = require('ora')
const _ = require("underscore");
const base = require('../rollup.base.conf')
const readsrcipt = require('../script')
const compilercss = require('./css')
const compilerjs = require('./js')
const startserver = require('./server')
const vs = require('./vs')
const config = require('../../config')

const conf = _.extend(config.build.conf, {
    rollup: config.build.conf.tarDir + 'rollup.js',
    exclude: config.build.exclude,
    server: config.build.server
});

const spinner = ora('Begin to pack , Please wait for\n')
spinner.start()
const stop = () => {
    spinner.stop()
}

base(conf, stop)
    .then(() => {
        return readsrcipt(conf)
    }, stop)
    .then((scriptUrl) => {
        return compilerjs(conf, scriptUrl, stop)
    }, stop)
    .then(() => {
        return vs(conf)
    }, stop)
    .then(() => {
        return compilercss(conf)
    }, stop)
    .then(() => {
        return startserver(conf)
    }, stop)
    .then(stop, stop)

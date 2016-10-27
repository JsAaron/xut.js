const build = require('./build')
const startserver = require('./test.server')
const ora = require('ora')

const spinner = ora('Begin to pack , Please wait for\n')
// spinner.start()
const stop = () => {
    // spinner.stop()
}

build(stop).then((conf) => {
    startserver(conf).then(() => stop, () => stop)
}, stop)

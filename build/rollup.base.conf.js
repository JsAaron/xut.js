const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const fsextra = require('fs-extra')

const getSize = (code) => {
    return (code.length / 1024).toFixed(2) + 'kb'
}
const blue = (str) => {
    return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}
const write = (path, code) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, code, (err) => {
            if (err) return reject(err)
            console.log('write: ' + blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}

module.exports = (conf, fail) => {

    fsextra.emptyDirSync(conf.tarDir)
    fsextra.emptyDirSync(conf.testDir)

    console.log('【Delete the directory, the path is:' + conf.tarDir + ' and ' + conf.testDir + '】')

    return new Promise((resolve, reject) => {
        let config = {
            entry: conf.entry,
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    "presets": ["es2015-rollup"]
                })
            ]
        }
        rollup.rollup(config).then((bundle) => {
                var code
                if (!fs.existsSync(conf.tarDir)) {
                    fs.mkdirSync(conf.tarDir);
                    console.log(conf.tarDir + '目录创建成功');
                }
                code = bundle.generate({
                    format: 'umd'
                }).code
                return write(conf.rollup, code)
            }).then(() => {
                resolve()
            })
            .catch((err) => {
                console.log('错误', err)
                fail()
            })
    })
}

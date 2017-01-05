const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const fsextra = require('fs-extra')
const utils = require('./utils')

module.exports = (conf) => {

    fsextra.emptyDirSync(conf.tarDir)
    conf.testDir && fsextra.emptyDirSync(conf.testDir)

    utils.log(`
delete the directory:
${conf.tarDir}
${conf.testDir}
`, 'prompt')

    return new Promise((resolve, reject) => {

        utils.log('【compile rollup】', 'debug')

        rollup.rollup({
                entry: conf.entry,
                plugins: [
                    babel({
                        babelrc: false,
                        exclude: 'node_modules/**',
                        "presets": [
                            [
                                "es2015", {
                                    "modules": false
                                }
                            ]
                        ],
                        "plugins": [
                            "external-helpers"
                        ]
                    }),
                    replace({
                        exclude: 'node_modules/**',
                        'process.env.NODE_ENV': JSON.stringify('production')
                    })
                ]
            }).then((bundle) => {
                var code
                if (!fs.existsSync(conf.tarDir)) {
                    fs.mkdirSync(conf.tarDir);
                    utils.log(conf.tarDir + '目录创建成功', 'info');
                }
                code = bundle.generate({
                    format: 'umd',
                    moduleName: 'Aaron'
                }).code
                return utils.write(conf.rollup, code)
            }).then(() => {
                resolve()
            })
            .catch((err) => {
                utils.log('错误：' + err, 'error')
                reject()
            })
    })
}

const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const eslint = require('rollup-plugin-eslint')
const fsextra = require('fs-extra')
const utils = require('./utils')

module.exports = (conf, fail) => {

    fsextra.emptyDirSync(conf.tarDir)
    fsextra.emptyDirSync(conf.testDir)

    console.log('【Delete the directory, the path is:' + conf.tarDir + ' and ' + conf.testDir + '】')

    return new Promise((resolve, reject) => {

        rollup.rollup({
                entry: conf.entry,
                plugins: [
                    babel({
                        exclude: 'node_modules/**',
                        "presets": ["es2015-rollup"]
                    })
                ]
            }).then((bundle) => {
                var code
                if (!fs.existsSync(conf.tarDir)) {
                    fs.mkdirSync(conf.tarDir);
                    console.log(conf.tarDir + '目录创建成功');
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
                console.log('错误：' + err)
                fail()
            })
    })
}

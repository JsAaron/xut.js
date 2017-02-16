const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const fsextra = require('fs-extra')
const utils = require('./utils')
const flow = require('rollup-plugin-flow');

const excludeRE = new RegExp(".git|epub|.svn|node_modules|README.md|README|README.gif|安装说明.docx", "ig")
const del = (dist) => {
  var files = fs.readdirSync(dist);
  for (file of files) {
    if (!excludeRE.test(file)) {
      fsextra.removeSync(dist + file)
    }
  }
  console.log('del: ' + dist)
}

module.exports = (conf, skipClean) => {

  //跳过清理
  if (!skipClean) {
    fsextra.emptyDirSync(conf.tarDir)
    utils.log(`delete the directory : ${conf.tarDir}`, 'prompt')
  }

  return new Promise((resolve, reject) => {

    utils.log('【compile rollup】', 'debug')

    rollup.rollup({
        entry: conf.entry,
        plugins: [
          flow(),
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

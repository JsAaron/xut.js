const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const alias = require('rollup-plugin-alias')
const buble = require('rollup-plugin-buble')
const fsextra = require('fs-extra')
const util = require('./util')
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
//config
module.exports = ({
  entry,
  banner,
  aliases,
  distDirPath,
  rollupDevFilePath,
}, skipCleanDir) => {
  //跳过清理
  if (!skipCleanDir) {
    fsextra.emptyDirSync(distDirPath)
    util.log(`delete the directory : ${distDirPath}`, 'prompt')
  }
  return new Promise((resolve, reject) => {
    util.log('Compiling Rollup Pack', 'debug')
    rollup.rollup({
        entry: entry,
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
          }),
          alias(aliases)
        ]
      }).then((bundle) => {
        if (!fs.existsSync(distDirPath)) {
          fs.mkdirSync(distDirPath);
          util.log(distDirPath + '目录创建成功', 'info');
        }
        const code = bundle.generate({
          format: 'umd',
          moduleName: 'Aaron'
        }).code

        return util.write(rollupDevFilePath, code)

      }).then(() => {
        resolve()
      })
      .catch((err) => {
        util.log('错误：' + err, 'error')
        reject()
      })
  })
}

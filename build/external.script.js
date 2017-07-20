const fs = require('fs')
const path = require('path')
const util = require('./util')

module.exports = ({
  exclude,
  externalFiles,
  templateDirPath
}) => {

  return new Promise((resolve, reject) => {

    /**
     * 通过load.js直接导出
     */
    if (externalFiles.jsName) {
      let paths = []
      let len = exclude.length
      if (len) {
        exclude = exclude.join(',')
        exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
      }
      externalFiles.jsName.forEach((path) => {
        if (!exclude.test(path)) {
          paths.push(util.joinPath(templateDirPath, path))
        }
      })
      util.log(`external file：${paths.length}`, 'debug')
      resolve(paths)
    } else {
      /**
       * 读取index文件
       */
      // fs.readFile(index, "utf8", (error, data) => {
      //   if (error) throw error;
      //   var path, paths, cwdPath, scripts, len
      //   len = exclude.length
      //   paths = []
      //   cwdPath = escape(process.cwd())
      //   scripts = data.match(/<script.*?>.*?<\/script>/ig);
      //   if (len = exclude.length) {
      //     exclude = exclude.join(',')
      //     exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
      //   }
      //   scripts.forEach((val) => {
      //     val = val.match(/src="(.*?.js)/);
      //     if (val && val.length) {
      //       path = val[1]
      //       if (!exclude.test(path)) {
      //         paths.push(srcDirPath + path)
      //       }
      //     }
      //   })
      //   util.log(`【external file：${scripts.length}】`, 'debug')
      //   resolve(paths)
      // })
    }

  })
}

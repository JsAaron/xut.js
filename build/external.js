const fs = require('fs')
const index = './src/index.html'

const getImportExternal = require('../src/lib/import.external.js')

module.exports = (conf) => {
    let srcDir, exclude
    srcDir = conf.srcDir
    exclude = conf.exclude
    return new Promise((resolve, reject) => {
        /**
         * 文件定义
         * @param  {[type]} getImportExternal [description]
         * @return {[type]}                   [description]
         */
        if (getImportExternal) {
            let paths = []
            let len = exclude.length
            if (len) {
                exclude = exclude.join(',')
                exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
            }
            getImportExternal.forEach((path) => {
                if (!exclude.test(path)) {
                    paths.push(srcDir + path)
                }
            })
            console.log(
                `【The introduction of external js :${paths.length}个`
            )

            resolve(paths)
        } else {
            /**
             * 读取index文件
             * @param  {[type]} index   [description]
             * @param  {[type]} "utf8"  [description]
             * @param  {[type]} (error, data)         [description]
             * @return {[type]}         [description]
             */
            fs.readFile(index, "utf8", (error, data) => {
                if (error) throw error;
                var path, paths, cwdPath, scripts, len
                len = exclude.length
                paths = []
                cwdPath = escape(process.cwd())
                scripts = data.match(/<script.*?>.*?<\/script>/ig);
                if (len = exclude.length) {
                    exclude = exclude.join(',')
                    exclude = new RegExp('(' + exclude.replace(/,/g, '|') + ')')
                }
                scripts.forEach((val) => {
                    val = val.match(/src="(.*?.js)/);
                    if (val && val.length) {
                        path = val[1]
                        if (!exclude.test(path)) {
                            paths.push(srcDir + path)
                        }
                    }
                })
                console.log(
                    `【The introduction of external js :${scripts.length}个`
                )

                resolve(paths)
            })
        }

    })
}

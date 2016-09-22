const fs = require('fs')
const index = './src/index.html'

module.exports = (conf) => {
    let srcDir, exclude
    srcDir = conf.srcDir
    exclude = conf.exclude
    return new Promise((resolve, reject) => {
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
                `【The introduction of external js :${scripts.length}】\n
                 【Rule out :${len}】\n
                 【The remaining :${paths.length}个】\n`
            )
            resolve(paths)
        })

    })
}

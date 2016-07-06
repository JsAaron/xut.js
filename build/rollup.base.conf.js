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


/**
 * @param  {[type]} srcDir [description]
 * @param  {[type]} url    [description]
 * @return {[type]}        [description]
 */
let readsrcipt = (srcDir, url) => {
    url = url || './src/index.html'
    return new Promise((resolve, reject) => {
        fs.readFile(url, "utf8", (error, data) => {
            if (error) throw error;
            var paths = []
            var path;
            var cwdPath = escape(process.cwd())
            var scripts = data.match(/<script.*?>.*?<\/script>/ig);
            scripts.forEach((val) => {
                val = val.match(/src="(.*?.js)/);
                if (val && val.length) {
                    path = val[1]
                    if (/^lib/.test(path)) {
                        paths.push(srcDir + path)
                    }
                }
            })

            resolve(paths)
        });
    })
}



module.exports = (conf) => {

    fsextra.emptyDirSync(conf.tarDir)
    fsextra.emptyDirSync(conf.testDir)

    console.log('Delete the directory, the path is:\n ' + conf.tarDir + ' \n ' + conf.testDir + '\n')

    return new Promise((resolve, reject) => {
        let plugins
        let config = {
            entry: conf.entry
        }
        plugins = [
            babel({
                exclude: 'node_modules/**',
                "presets": ["es2015-rollup"]
            })
        ]
        config.plugins = plugins

        rollup.rollup(config).then((bundle) => {
                //创建目录,如果不存在
                if (!fs.existsSync(conf.tarDir)) {
                    fs.mkdirSync(conf.tarDir);
                    console.log(conf.tarDir + '目录创建成功');
                }
                var code = bundle.generate({
                    format: 'umd'
                }).code
                return write(conf.rollup, code)
            }).then(() => {
                return readsrcipt(conf.srcDir)
            })
            .then((scriptUrl) => {
                resolve && resolve(scriptUrl)
            })
            .catch((err) => {
                console.log('错误', err)
                    // reject()
            })
    })
}

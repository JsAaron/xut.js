const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const fsextra = require('fs-extra')

const getSize = function(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

const blue = function(str) {
    return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}

const write = function(path, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, code, function(err) {
            if (err) return reject(err)
            console.log('write: ' + blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}


/**
 * 读出所有的index中的script路径
 * @param  {[type]} srcDir [description]
 * @param  {[type]} url    [description]
 * @return {[type]}        [description]
 */
var readsrcipt = function(srcDir, url) {
    url = url || './src/index.html'
    return new Promise(function combine(resolve, reject) {
        fs.readFile(url, "utf8", function(error, data) {
            if (error) throw error;
            var paths = []
            var path;
            var cwdPath = escape(process.cwd())
            var scripts = data.match(/<script.*?>.*?<\/script>/ig);
            scripts.forEach(function(val) {
                val = val.match(/src="(.*?.js)/);
                if (val && val.length) {
                    path = val[1]

                    //有效src
                    if (/^lib/.test(path)) {
                        paths.push(srcDir + path)
                    }
                }
            })
            resolve(paths)
        });
    })
}



/**
 * rollup合并
 */
module.exports = function(conf) {

    //清空目录
    fsextra.emptyDirSync(conf.tarDir)
    fsextra.emptyDirSync(conf.testDir)

    console.log('Delete the directory, the path is:\n ' + conf.tarDir + ' \n ' + conf.testDir + '\n')

    return new Promise(function(resolve, reject) {
        rollup.rollup({
                entry: conf.entry,
                plugins: [
                    babel({
                        "presets": ["es2015-rollup"]
                    })
                ]
            }).then(function(bundle) {
                //创建目录,如果不存在
                if (!fs.existsSync(conf.tarDir)) {
                    fs.mkdirSync(conf.tarDir);
                    console.log(conf.tarDir + '目录创建成功');
                }
                var code = bundle.generate({
                    format: 'umd',
                    moduleName: 'Aaron'
                }).code
                return write(conf.rollup, code)
            }).then(function() {
                return readsrcipt(conf.srcDir)
            })
            .then(function(scriptUrl) {
                resolve && resolve(scriptUrl)
            })
            .catch(function() {
                console.log('错误')
            })
    })
}
const fs = require('fs')

const getSize = (code) => {
    return (code.length / 1024).toFixed(2) + 'kb'
}


const blue = (str) => {
    return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}


exports.write = (path, code) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, code, (err) => {
            if (err) return reject(err)
            console.log('write: ' + blue(path) + ' ' + getSize(code))
            resolve(code)
        })
    })
}

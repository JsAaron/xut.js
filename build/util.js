const fs = require('fs')
const path = require('path')
const colors = require('colors');

/**
bold
italic
underline
inverse
yellow
cyan
white
magenta
green
red
grey
blue
rainbow
zebra
random
 */

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
});


const getSize = (code) => {
  return (code.length / 1024).toFixed(2) + 'kb'
}


const blue = (str) => {
  return '\x1b[1m\x1b[34m' + escape(process.cwd()) + str + '\x1b[39m\x1b[22m'
}

exports.log = (str, code) => {
  if (code) {
    console.log(str[code])
  } else {
    console.log(str)
  }
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


exports.writeFile = (filename, content) => {
  fs.writeFileSync(filename, content, {
    encoding: 'utf8',
    flag: 'w+'
  })
}


function readFile(path) {
  return fs.readFileSync(path, {
    flag: 'r+',
    encoding: 'utf8'
  })
}

exports.readFile = readFile


exports.joinPath = function(base, fileName) {
  return path.join(base, fileName)
}


/**
 * 获取版本
 * @return {[type]} [description]
 */
exports.getVersion = function(filePath) {
  let data = readFile(filePath)
  return data.match(/Xut.Version\s?=\s?\d*([.]?\d*)/ig)[0].split('=')[1].trim()
}

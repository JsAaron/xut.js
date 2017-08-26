/**
 * content下的svg转化成js
 * 1.方便跨域操作
 * 2.不需要发送ajax请求
 */
const stats = []
const fs = require("fs")
const _ = require("underscore")
const util = require('../util')


const readFile = (path) => {
  let data = fs.readFileSync(path, {
    // flag: 'r+',
    encoding: 'utf8'
  })
  return data
}


const writeFile = (filename, content) => {
  fs.writeFileSync(filename, content, {
    encoding: 'utf8',
    flag: 'w+'
  })
}


/**
 * 转化svg为js
 */
function convertFile(path) {

  /*如果已经转化过了*/
  let convertedPath = path + '/converted.txt'
  let exists = fs.existsSync(convertedPath)
  if (exists) {
    let data = readFile(convertedPath)
    if (data) {
      // util.log(`conver svg:${data} --- ${path}`, 'info')
      return
    }
  }

  // util.log(`start convert svg --- ${path}`, 'cyan')

  let files = fs.readdirSync(path)

  if (!files.length) {
    // util.log(`empty file --- ${path}`, 'error')
    return
  }

  /*获取有效的svg文件*/
  let svgfiles = [];
  _.each(files, function(url, index) {
    if (/.svg$/i.test(url)) {
      svgfiles.push(url)
    }
  })


  if (!svgfiles.length) {
    // util.log(`empty svg file --- ${path}`, 'cyan')
    return
  }

  /**
   * 开始转化
   */
  let total = svgfiles.length
  let count = total - 1
  let filename
  let data
  let str
  let handle

  while (count >= 0) {
    filename = svgfiles[count]
    readPath = path + '/' + filename;
    data = readFile(readPath)

    filename = filename.replace('.svg', '')
    str = 'window.HTMLCONFIG[\'' + filename + '\']=' + JSON.stringify(data)

    handle = writeFile(path + '/' + filename + '.js', str)
    if (handle) {
      util.log(`convert svg failure`)
      return
    } else {
      util.log(`converted svg is ${readPath}`)
    }

    if (!count) {
      util.log(`convert ${total} files`)
      writeFile(convertedPath, total)
      return
    }
    count--
  }
}


/**
 * 递归检测有资源的目录
 * 必须要是gallery目录
 * 包含
 * 1 content gallery
 * 2 widget gallery
 */
function scanDir(path) {
  _.each(fs.readdirSync(path), function(file) {
    const stat = fs.lstatSync(path + file);
    //如果是目录
    if (stat.isDirectory()) {
      if (file === 'gallery') {
        convertFile(path + file)
      } else {
        scanDir(path + file + '/')
      }
    }
  })
}


module.exports = function(path) {
  scanDir(path)
}

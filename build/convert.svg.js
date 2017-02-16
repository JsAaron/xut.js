const fs = require("fs")
const _ = require("underscore")
const stats = []
const utils = require('./utils')

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


const convert = function(path) {
  let filename
  let readPath
  let str
  let data
  let handle
  let svgfiles
  let total
  let count

  let convertedPath = path + '/converted.txt'
  let exists = fs.existsSync(convertedPath)
  if (exists) {
    data = readFile(convertedPath)
    if (data) {
      utils.log(`【${path}，cache:${data} SVG, 】`, 'data')
      return
    }
  }

  svgfiles = [];
  files = fs.readdirSync(path)

  if (!files.length) {
    utils.log('【No SVG files】')
    return
  }

  _.each(files, function(url, index) {
    if (/.svg$/i.test(url)) {
      svgfiles.push(url);
    }
  })

  total = svgfiles.length
  count = total - 1

  while (count >= 0) {
    filename = svgfiles[count]
    readPath = path + '/' + filename;
    data = readFile(readPath)

    filename = filename.replace('.svg', '')
    str = 'window.HTMLCONFIG[\'' + filename + '\']=' + JSON.stringify(data)

    handle = writeFile(path + '/' + filename + '.js', str)
    if (handle) {
      utils.log('【Convert SVG failure】')
      return
    } else {
      utils.log(`【converted SVG is ${readPath}`)
    }

    if (!count) {
      utils.log(`【converted: ${total} SVG】`)
      writeFile(convertedPath, total)
      return
    }
    count--
  }
}


module.exports = function(src) {
  var path = src + 'content/'
  var files = fs.readdirSync(path)
  _.each(files, function(file) {
    var stat = fs.lstatSync(path + file);
    if (stat.isDirectory()) {
      //root目录下有gallery
      if (file == 'gallery' || file == 'widget') {
        convert(path + file)
      } else {
        convert(path + file + '/gallery')
      }
    }
  })
  return
}

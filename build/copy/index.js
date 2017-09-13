const fs = require("fs")
const path = require('path');
const fsextra = require('fs-extra')
const cp = require('child_process')
const _ = require("underscore");
const createRE = require('./filter')

const src = '.'

//复制文件目录
const dists = [
  '/Users/Aaron/project/git/xut.js/'
  // '/Users/Aaron/project/svn/server/magazine-develop/www/'
]

const filterRE = createRE()

//./build/.config.js
//./build/dev/test.js
//build/dev/webpack.dev.conf.js
const excludeDel = new RegExp(".git|epub|.svn|README.md|README|README.gif|安装说明.docx", "i")
const excludeCopy = new RegExp("^./test|^./template/content|^./template/compile|^./node_modules|^./.svn|^./release/|^./temp/|/.svn/", "i")

console.log(
  '【Regular filter】\n' +
  filterRE +
  '\n'
)

const del = (dist) => {
  var files = fs.readdirSync(dist);
  for (file of files) {
    if (!excludeDel.test(file)) {
      fsextra.removeSync(dist + file)
    }
  }
  console.log('del: ' + dist)
}
console.log(excludeCopy)
const copy = (src, dist) => {
  var files = fs.readdirSync(src);
  for (fn in files) {
    var rootPath = src + path.sep
    var filename = rootPath + files[fn]
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory() == true) {
      copy(filename, dist)
    } else {

      if (!excludeCopy.test(rootPath)) {
        fsextra.copySync(filename, dist + filename)
      } else {
        // console.log(src)
      }
    }
  }
}


dists.forEach((dist) => {
  del(dist)
  copy(src, dist)
  console.log('copy: ' + dist)
})

/**
 * db数据转化成json格式
 */
const fs = require('fs');
const fsextra = require('fs-extra')
const _ = require("underscore")
const sqlite = require('./sqlite/index')
const utils = require('../utils')

/*数据库**/
const GALLERY = 'gallery'
const WIDGET = 'widget'
const DBNAME = 'xxtebook.db'

/**
 * 获取数据库文件的目录
 * 1 根目录
 * 2 子目录
 * 根目录第一层就有可能存在
 * gallery/widget/xxtebook.db
 */
const getDirPaths = function(path) {
  const files = fs.readdirSync(path)
  const arr = []
  const dirs = []
  _.each(files, file => {
    var stat = fs.lstatSync(path + file);
    if (stat.isDirectory()) {
      if (file == GALLERY || file == WIDGET) {} else {
        /*子目录*/
        dirs.push(path + file)
      }
    } else {
      if (file === DBNAME) {
        /*根目录*/
        dirs.push(path)
      }
    }
  })
  return dirs
}


/**
 * 创建json数据
 */
const createJsonData = function(listPath) {
  if (!listPath.length) {
    return
  }
  let path = listPath.shift()

  /*如果转化的文件不存在*/
  if (!fs.existsSync(path + '/SQLResult.js')) {
    sqlite.resolve(path, path + '/' + DBNAME, function() {
      utils.log(`create json data: ${path + '/SQLResult.js'}`)
      createJsonData(listPath)
    })
  } else {
    createJsonData(listPath)
  }
}


module.exports = (rootPath) => {
  createJsonData(getDirPaths(rootPath))
}

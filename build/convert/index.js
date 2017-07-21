const watch = require('gulp-watch');
const util = require('../util')
const svg = require('./svg')
const json = require('./json')

/**
 * 观察数据改变
 * 更新josn与svg
 */
const watchChange = (rootPath) => {
  watch([rootPath + '**/*.db', rootPath + '**/SQLResult.js'], {
    events: ['add', 'change', 'unlink ']
  }, (name) => {
    svg(rootPath)
    json(rootPath)
    util.log(`resources change`, 'red')
  })
}


module.exports = (templateDirPath) => {
  const rootPath = templateDirPath + '/content/'
  svg(rootPath)
  json(rootPath)
  util.log(`build resources`, 'red')
  // watchChange(rootPath)
}

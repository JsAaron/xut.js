const watch = require('gulp-watch');
const utils = require('../utils')
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
    utils.log(`resources change`, 'red')
    svg(rootPath)
    json(rootPath)
  })
}


module.exports = (srcDir) => {
  const rootPath = srcDir + 'content/'
  svg(rootPath)
  json(rootPath)
  // watchChange(rootPath)
}

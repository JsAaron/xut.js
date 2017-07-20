const path = require('path')

module.exports = {
  preload: path.resolve(__dirname, '../src/preload'),
  core: path.resolve(__dirname, '../src/core')
}

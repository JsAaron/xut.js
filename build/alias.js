const path = require('path')

//fix: support windows 10 system
//rollup-plugin-alias
//https://github.com/ICELI/rollup-plugin-alias/commit/f04f2b0213e861df3622a9415ef566959dc836ea
module.exports = {
  preload: path.resolve(__dirname, '../src/preload'),
  core: path.resolve(__dirname, '../src/core')
}

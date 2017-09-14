const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

//fix: support windows 10 system
//rollup-plugin-alias
//https://github.com/ICELI/rollup-plugin-alias/commit/f04f2b0213e861df3622a9415ef566959dc836ea
module.exports = {
  core: resolve('src/core'),
  preload: resolve('src/preload'),
  repair: resolve('src/repair'),
  database: resolve('src/database')
}

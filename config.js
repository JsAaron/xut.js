var path = require('path')



module.exports = {
  build: {
    index               : path.resolve(__dirname, 'src/index.html'),
    outputRoot          : path.resolve(__dirname, 'dist'),
    productionSourceMap : true
  },
  dev: {
    port: 8080,
    proxyTable: {}
  }
}

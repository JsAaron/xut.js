const webpack = require('webpack')
const merge = require('webpack-merge')
const util = require('../util')

//https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
//https://www.npmjs.com/package/write-file-webpack-plugin
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = function(config) {

  const baseConfig = {
    entry: ['./build/dev/client', config.entry],
    output: {
      path: config.assetsRootPath,
      publicPath: config.assetsPublicPath,
      filename: config.assetsName
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }]
    },
    resolve: {
      alias: config.aliases
    }
  }

  return merge(baseConfig, {
    devtool: 'cheap-source-map',
    plugins: [
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      // new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),

      //https://segmentfault.com/a/1190000008590102
      new HtmlWebpackPlugin({
        filename: util.joinPath(config.assetsRootPath, 'index.html'),
        template: util.joinPath(config.templateDirPath, 'index.html'),
        inject: 'head',
        hash: true
      }),

      new WriteFilePlugin()
    ]
  })
}

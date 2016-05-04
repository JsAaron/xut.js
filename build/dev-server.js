var path          = require('path')
var express       = require('express')
var webpack       = require('webpack')
var config        = require('../config')
var webpackConfig = require('./webpack.dev.conf')

//默认端口
var port = process.env.PORT || config.dev.port


var app = express()
var compiler = webpack(webpackConfig)


var devMiddleware = require('webpack-dev-middleware')

console.log()
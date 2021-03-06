/*
 * @Author: jiapeng.Zheng
 * @Date: 2018-12-29 14:05:04
 * @LastEditors: jiapeng.Zheng
 * @LastEditTime: 2019-12-04 12:26:29
 * @Description: 开发环境构建
 */
var fs = require('fs')
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var WebpackBuildNotifierPlugin = require('webpack-build-notifier')
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new WebpackBuildNotifierPlugin({
      logo: path.resolve('./src/assets/images/logo.png'),
      suppressSuccess: true
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname, './service-worker-dev.js'), 'utf-8')}</script>` // index.ejs <%=htmlWebpackPlugin.options.serviceWorkerLoader%>
    }),
    new FriendlyErrorsPlugin()
  ]
})

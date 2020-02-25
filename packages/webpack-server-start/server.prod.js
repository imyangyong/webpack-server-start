/**
 * @file 将打包好的文件，本地执行
 */
var express = require('express');
var utils = require('./common/utils');
var path = require('path');
var fs = require('fs');
var bird = require('bird-proxy-middleware');
var webpack = require('webpack');
var app = express();

/**
 * method description.
 * @param {Object} webpackConfig.
 * @param {Object} entry 入口.
 * @param {Number} port 监听端口.
 * @param {String} birdPath bird路径.
 */
module.exports = function(webpackConfig, entry, port, birdPath) {
  webpackConfig = webpackConfig || {};
  webpackConfig.mode = 'production';
  webpackConfig.entry = entry.entry;
  delete webpackConfig.output.publicPathForDevServer;
  var compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      utils.log(['error: 构建失败.', err, err.stack]);
      return;
    }
  
    utils.log(['info: 构建成功.']);
  
    if (fs.existsSync(utils.matchPath(entry.template.prod))) {
      fs.writeFileSync(webpackConfig.output.path + '/index.html', fs.readFileSync(utils.matchPath(entry.template.prod)).toString())
    }
    
    app.use('/', express.static(webpackConfig.output.path));
    if (birdPath) {
      var birdFilePath = utils.matchPath(birdPath);
      if (fs.existsSync(birdFilePath)) {
        app.all('*', bird(birdFilePath));
      }
    }
  
    port = port || 8110;
    app.listen(port, function (err) {
      if (err) {
        utils.log(['error: 启动服务器失败.', err, err.stack]);
        return;
      }
    
      utils.log(['info: 构建后脚本的测试服务器已启动, 请访问: http://localhost:' + port]);
    });
  })
  
}


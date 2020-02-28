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
 * @param {String} dirPath The directory path which the build package place.
 * @param {Number} port 监听端口.
 * @param {String} birdPath bird路径.
 */
module.exports = function(dirPath, port, birdPath) {
  dirPath = utils.matchPath(dirPath, true);
  
  
  app.use('/', express.static(dirPath));
  
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
    
      utils.log(['info: 构建后脚本的测试服务器已启动, 请访问: http://localhost:' + port + '/pages']);
    });
  
}


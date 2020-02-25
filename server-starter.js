/**
 * @file 用于启动 开发服务器
 */

var webpack = require('webpack');
var express = require('express');

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var fs = require('fs');
var _ = require('lodash');
var utils = require('./common/utils');

/**
 * 启动 dev server (webpack, 共享项目 check 等)
 *
 * @param {Object} opts 必要参数
 * @return {HttpServer} express 服务器
 */
var serverStarter = function (opts, entries, port) {
  
  /**
   * opts: {}
   *  lifeCycle: {}
   *      $LIFE_CYCLE_STEP_CALLBACK: function(app, context)
   */
  opts = opts || {};
  opts.lifeCycle = opts.lifeCycle || {};
  
  var app = express();
  
  var defaultLog = function (message) {
    utils.logs(['info: ' + message]);
  };
  
  utils.log(['', '[Detected entries for webpack]'.magenta + ':']);
  utils.log(['', entries]);
  
  if (opts.lifeCycle.generateHtml) {
    opts.lifeCycle.generateHtml(app, {});
  }
  
  // 启动 webpack 解析器
  // 得到 webpack 的config之后, 通过计算得到entry列表
  var webpackConfig = opts.lifeCycle.getWebpackConfig();
  var publicPathForDevServer = webpackConfig.output.publicPathForDevServer;
  delete webpackConfig.output.publicPathForDevServer;
  
  var compiler = webpack(webpackConfig);
  
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    stats: {
      colors: true
    },
    quiet: true,
    // writeToDisk: true,
    log: defaultLog,
    publicPath: publicPathForDevServer
  }));
  
  // 如果要在IE下调试, 将以下Hot middleware注释掉
  // app.use(webpackHotMiddleware(compiler, {
  //   log: defaultLog,
  //   path: '/__webpack_hmr',
  //   heartbeat: 10 * 1000,
  // }));
  
  if (opts.lifeCycle.loadDevServerLogic) {
    opts.lifeCycle.loadDevServerLogic(app, {});
  }
  
  var httpServer = require('http').createServer(app);
  var starter = function () {
    httpServer.listen(opts.port, function (err) {
      if (err) {
        utils.logs(['error: ' + err]);
      } else {
        utils.logs(['info: Server run on http://localhost:' + opts.port]);
      }
    });
  };
  starter();
  return httpServer;
};

module.exports = serverStarter;

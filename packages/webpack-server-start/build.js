/**
 * @file build
 */
var webpack = require('webpack');
var utils = require('./common/utils');
var templateReplacer = require('./common/template-replacer')
var fs = require('fs');

var _ = require('lodash');

var del = require('delete');
var cp = require('copy-dir');

module.exports = function (webpackConfig, entries) {
  webpackConfig.mode = 'production';
  
  // 清除 prod 内容
  del.sync(webpackConfig.output.path);
  utils.ensurePath(webpackConfig.output.path);
  utils.ensurePath(webpackConfig.output.path + '/pages');
  
  // 根据 entry 配置以及 build-plan 产生 entries
  var finalEntries = {};
  _.each(entries, function (entryConfig, entryKey) {
    var entryScriptPath = utils.matchPath(entryConfig.entry);
    finalEntries[entryKey] = entryScriptPath;
  });
  webpackConfig.entry = finalEntries;
  
  
  // 产生 entry html 入口文件
  var buildTime = utils.getBuildTime();
  _.each(entries, function (entryConfig, entryKey) {
    if (!entryConfig.template.prod) {
      throw new Error('没有找到相对应的 template : ' + entryKey + ' @ ' + 'prod');
    }
    
    var templateHtml = fs.readFileSync(utils.matchPath(entryConfig.template.prod)).toString();
    
    var htmlContent = templateReplacer()
      .setContent(templateHtml)
      .applyDataAndReturn({
        buildTime: buildTime,
      });
    
    fs.writeFileSync(webpackConfig.output.path + '/pages/' + entryKey + '.html', htmlContent);
  });
  
  // 手动移动用户自定义文件
  if (webpackConfig.output.extraDirPath) {
    for (var dirPath in webpackConfig.output.extraDirPath) {
      utils.ensurePath(webpackConfig.output.path + '/' + dirPath);
      var originPath = utils.matchPath(webpackConfig.output.extraDirPath[dirPath], true);
      cp.sync(originPath, webpackConfig.output.path + '/' + dirPath)
    }
    delete webpackConfig.output.extraDirPath;
  }
  
  
  // 构建
  var compiler = webpack(webpackConfig);
  compiler.run(function (err, stats) {
    if (err) {
      utils.log(['error: 遇到构建错误.', ex, ex.stack]);
      return;
    }
    
    fs.writeFileSync(process.cwd() + '/prod-build.txt', stats);
    
    utils.log(['info: 构建完成!']);
  });
};

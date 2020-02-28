var express = require('express');
var serverStarter = require('./server-starter');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var {ensurePath,  matchPath } = require('./common/utils');
var cp = require('copy-dir');
var bird = require('bird-proxy-middleware');

var entries = [];

var getEntryContent = function (entry) {
  return 'require(\'' + entry + '\')';
};

var TEMPLATE_NO_ENTRY = require('./common/server-consts').TEMPLATE_NO_ENTRY;

var serverUtils = {
  wrapResponse: function (data, status) {
    status = status || 'success';
    
    return {
      status,
      data
    };
  },
  
  toggleEntries: function (targetEntries) {
    var hash = {};
    
    for (var pageName in entries) {
      var pageConfig = entries[pageName];
      hash[pageName] = pageConfig;
    }
    
    targetEntries.forEach(function (entry) {
      if (entry.disabled) {
        return;
      }
      
      var entryConfig = hash[entry.id];
      if (entryConfig.turnedOn !== entry.checked) {
        var pageEntryPath = path.resolve(__dirname, './temp-entries/' + entry.id + '.js');
        
        if (entry.checked) {
          fs.writeFileSync(pageEntryPath, getEntryContent(matchPath(entryConfig.entry)));
        } else {
          fs.writeFileSync(pageEntryPath, TEMPLATE_NO_ENTRY);
        }
        entryConfig.turnedOn = entry.checked;
      }
      
    });
  }
};

module.exports = function (webpackConfig, entriesInject, port, birdPath) {
  entries = entriesInject;
  serverStarter({
    port: port || 5678,
    lifeCycle: {
      
      getWebpackConfig: function () {
        var webpackEntries = {};
        
        for (var pageName in entries) {
          var pageConfig = entries[pageName];
          var pageEntryPath = path.resolve(__dirname, './temp-entries/' + pageName + '.js');
          
          // tips: TEMPLATE_NO_ENTRY 即为 turnedOn = false 的状态
          if (!fs.existsSync(pageEntryPath)) {
            fs.writeFileSync(pageEntryPath, TEMPLATE_NO_ENTRY);
            pageConfig.turnedOn = false;
          } else {
            var currentContent = '';
            if (fs.existsSync(pageEntryPath)) {
              currentContent = fs.readFileSync(pageEntryPath).toString();
            }
            if (currentContent !== TEMPLATE_NO_ENTRY && currentContent !== getEntryContent(matchPath(pageConfig.entry))) {
              fs.writeFileSync(pageEntryPath, getEntryContent(matchPath(pageConfig.entry)));
              pageConfig.turnedOn = true;
            } else if (currentContent === TEMPLATE_NO_ENTRY) {
              pageConfig.turnedOn = false;
            } else {
              pageConfig.turnedOn = false;
            }
          }
          
          webpackEntries[pageName] = pageEntryPath;
        }
        
        webpackConfig.entry = webpackEntries;
        webpackConfig.mode = 'development';
        return webpackConfig;
      },
      
      /**
       * 访问任意entry时, 根据entry生成 html
       * 如果没有配置该 entry, 则会考虑返回 no-entry 的页面
       *
       * @param app
       * @param context
       */
      generateHtml: function (app, context) {
        app.all('/pages/:pageName', function (req, res) {
          
          // page name = the page name with .html
          // console.log('@debug, pageName', req.params)
          
          var pageName = (req.params.pageName ? req.params.pageName.split('.') : ['', ''])[0];
          if (pageName) {
            if (entries[pageName]) {
              
              var templateHtml = fs.readFileSync(matchPath(entries[pageName].template.dev)).toString();
              
              res.send(templateHtml);
            } else {
              res.redirect('/_thread_/pages/_thread_.html');
            }
          } else {
            res.redirect('/_thread_/pages/_thread_.html');
          }
        });
        
        // app.all('/_/matriks/entries', function (req, res) {
        //     res.send('hello world')
        // })
      },
      
      /**
       * 加载特殊的 开发服务器的 逻辑处理
       */
      loadDevServerLogic: function (app, context) {
        app.all('/', function (req, res) {
          res.redirect('/pages/_thread_.html');
        });
        app.use('/_/matriks/*', bodyParser.json());
        
        app.all('/_/matriks/api/all-entries', function (req, res) {
          res.send(serverUtils.wrapResponse(entries));
        });
        
        app.all('/_/matriks/api/toggle-entries', function (req, res) {
          serverUtils.toggleEntries(req.body.entries);
          res.send(serverUtils.wrapResponse());
        });
        
        app.all('/_/matriks/api/toggle-entry', function (req, res) {
          var pageConfigObject = req.body.pageConfigObject;
          if (pageConfigObject) {
            _.each(pageConfigObject, function (pageConfig, pageName) {
              if (entries[pageName]) {
                var pageEntryPath = path.resolve('./temp-entries/' + pageName + '.js');
                ;
                
                if (pageConfig.turnOn) {
                  fs.writeFileSync(pageEntryPath, getEntryContent(matchPath(pageConfig.entry)));
                } else {
                  fs.writeFileSync(pageEntryPath, TEMPLATE_NO_ENTRY);
                }
              } else {
                utils.logs(['error: 入口模块未找到 ' + pageName]);
              }
            });
          }
          
        });
        
        app.use('/_thread_', express.static(path.resolve(__dirname, './Page/Thread/dist')));
  
        // extra directory which will be listened
        if (webpackConfig.output.extraDirPath) {
          for (var dirPath in webpackConfig.output.extraDirPath) {
            ensurePath(matchPath(webpackConfig.output.extraDirPath[dirPath], true));
            app.use('/' + dirPath, express.static(matchPath(webpackConfig.output.extraDirPath[dirPath], true)));
          }
          delete webpackConfig.output.extraDirPath;
        }
  
        if (birdPath) {
          var birdFilePath = matchPath(birdPath);
          if (fs.existsSync(birdFilePath)) {
            app.all('*', bird(birdFilePath));
          }
        }
      }
    }
  }, entriesInject)
}

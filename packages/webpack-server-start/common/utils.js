/**
 * @file utils
 */
var npath = require('path')
var fs = require('fs')
var colors = require('colors')
var _ = require('lodash')

var utils = {
  p: function (path) {
    return npath.resolve(path);
  },
  
  punix: function (path) {
    return utils.p(path).replace('\/', '/');
  },
  
  ensurePath: function (path) {
    if (!fs.existsSync(path)) {
      utils.ensurePath(npath.dirname(path))
      fs.mkdirSync(path);
    }
  },
  ensureLocalFileFromExample: function (path, examplePath) {
    examplePath = examplePath || path + '.example'
    
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, fs.readFileSync(examplePath));
    }
  },
  
  writeJSON: function (path, obj) {
    fs.writeFileSync(path, JSON.stringify(obj, null, 3));
  },
  readJSON: function (path) {
    var content = fs.readFileSync(path).toString()
    try {
      return JSON.parse(content);
    } catch (ex) {
      return {};
    }
  },
  
  // promise related
  newPromise: function () {
    return new Promise(function (resolve) {resolve()});
  },
  
  getBuildTime: function () {
    var now = new Date();
    return '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes();
  },
  
  ensureGitignore: function (gitignorePath, rules) {
    gitignorePath = utils.p(gitignorePath);
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '# rules added by enuserGitignore\n' + rules.join('\n'));
    } else {
      var content = fs.readFileSync(gitignorePath).toString()
      var lineHash = {}
      
      var lines = content.split('\n')
      lines.map(function (line) {
        lineHash[line] = 1;
      })
      
      var ruleAdded = false
      rules.map(function (rule) {
        if (!lineHash[rule]) {
          if (!ruleAdded) {
            lines.push('# rules added by enuserGitignore\n');
          }
          ruleAdded = true
          lines.push(rule);
        }
      })
      
      if (ruleAdded) {
        fs.writeFileSync(gitignorePath, lines.join('\n'));
      }
    }
  },
  
  log: function (logEntry) {
    var logFuncs = {
      error: function (message, rest) {
        console.error.bind(console, '[ERROR] '.red + message).apply(console, rest);
      },
      info: function (message, rest) {
        console.info.bind(console, '[INFO] '.green + message).apply(console, rest);
      },
      hint: function (message, rest) {
        console.info.bind(console, ('[HINT] ' + message).blue).apply(console, rest);
      },
      warn: function (message, rest) {
        console.warn.bind(console, '[WARNING] '.yellow + message).apply(console, rest);
      },
      debug: function (message, rest) {
        console.log.bind(console, ('[DEBUG] ' + message).cyan).apply(console, rest);
      },
      default: function (message, rest) {
        console.log.bind(console, message).apply(console, rest);
      }
    }
    
    if (typeof logEntry === 'string') {
      var typeAndMessage = logEntry
      logEntry = [];
    } else {
      var typeAndMessage = logEntry.shift();
    }
    var parts = typeAndMessage.split(':'), type = 'default', message
    if (parts.length === 1) {
      message = parts[0];
    } else if (!logFuncs[parts[0]]) {
      message = typeAndMessage;
    } else {
      type = parts.shift()
      message = parts.join(':');
    }
    
    logFuncs[type](message, logEntry);
  },
  
  /**
   *
   * @param logs: []
   *  $index: string
   *
   *  格式如下
   *
   *  TYPE: message
   *
   *  TYPE 可能是以下的某个值:
   *
   *  error, info, hint, warn, debug
   *
   *  如果没有指定 TYPE, 则全量白色输出
   *
   * 如果 logs 非 [], 那么 logs() 会将所有的arguments转成 [], 并重新运行 logs()
   */
  logs: function (logs) {
    logs.map(function (logEntry) {
      utils.log(logEntry);
    });
  },
  
  /**
   * 向上一直寻找特定的符合 `found(path)` 条件的路径, 成功则返回 path
   * 如果最后到根目录都失败, 则返回 null
   *
   * @param path
   * @param found
   * @returns {*}
   */
  traceUpPath: function (path, found) {
    var dirname = utils.p(path + '/../')
    if (found(path)) {
      return path
    } else if (dirname == path) {
      return null
    } else {
      return utils.traceUpPath(dirname, found)
    }
  },
  
  warningOnUnknownSubCommand(commander) {
    commander.arguments('*')
      .action(function(otherCommand) {
        utils.log(['error: ' + otherCommand + ' 不是一个可运行的命令, 请使用 -h 查看命令用法.'])
      });
  },
  
  warningOnNoSubCommand(commander) {
    if (commander.args.length === 0) {
      utils.log(['error: 没有指定子命令. 请使用 -h 查看命令用法.']);
    }
  },
  
  matchPath (filePath, isDir) {
    var fileFolder = npath.dirname(module.parent.parent.parent.parent.filename);
    if (filePath.substr(0, 1) == '.') {
      filePath = npath.resolve(fileFolder, filePath);
    } else {
      filePath = npath.resolve(filePath);
    }
    
    if (!isDir && !/[\.js|\.html]$/.exec(filePath)) {
      filePath += '.js'
    }
    
    return filePath;
  }
}

module.exports = utils;


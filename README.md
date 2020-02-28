<h1 align="center" style="margin: 30px 0 35px;">Webpack Server Start</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/webpack-server-start"><img alt="npm" src="https://img.shields.io/npm/v/webpack-server-start"></a>
</p>

🐦 **webpack-based 【development server】 && 【build】 && 【prodcution server】**

# 安装

```bash
npm install webpack-server-start --save--dev
```

<span id='development server'></span>
# development server

### 1. 业务入口配置

entries.demo.js
```javascript
// 可配置多个入口
var entries = {
  'index': {
     entry: './src/app.js',
     template: {
       dev: './dev.html',
       prod: './prod.html'
     }
  },
  'index2': {
     entry: './src/app2.js',
     template: {
       dev: './dev.html',
       prod: './prod.html'
     }
  },
}
```

### 2. webpack配置

webpack.config.dev.js
```javascript
module.exports = {
  // entry: '', here is useless, entry will be replace by 入口配置的entry
  output: {
    publicPathForDevServer: '/dev/', // /dev will be as the development root path

    extraPath: {
      'image': './image', // this can be use '../image/xxx.png'
    }   
    // ...
  },
  // other webpack common config...
}
```

### 3. 开发服务器启动

```javascript
var webpackConfig = require('./webpack.config.dev.js');
var entries = require('./entries.demo.js');
var devServer = require('webpack-server-start').devServer;

/**
 * @param {Object} webpackConfig Webpack config.
 * @param {Object} entries 入口配置.
 * @param {Number} port 服务器监听的端口号, 默认5678.
 * @param {String} birdPath Bird代理中间件，文件路径.
 */
devServer(webpackConfig, entries);
```

# build

### 1. 入口配置

与 [dev server entires](#development-server) 相同规则

### 2. webpack配置

webpack.config.prod.js
```javascript
var path = require('path');
module.exports = {
  // entry: '', here is useless, entry will be replace by 入口配置的entry
  output: {
    // for production
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',    

    extraPath: {
      'image': './image', // this can be use '../image/xxx.png'
    }   
    // ...
  },
  // other webpack common config...
}
```

### 3. build 开始
```javascript
var webpackConfig = require('./webpack.config.prod.js');
var entries = require('./entries.demo.js');
var build = require('webpack-server-start').build;

/**
 * @param {Object} webpackConfig Webpack config.
 * @param {Object} entries 入口配置.
 */
build(webpackConfig, entries);
```

# production server

启动构建后的项目

```javascript
var prodServer = require('webpack-server-start').prodServer;

/**
 * @param {String} dirPath Can be either absolute or releative path.
 * @param {Number} port 服务器监听的端口号, 默认8110.
 * @param {String} birdPath Bird代理中间件，文件路径.
 */
prodServer('./dist');
```

# 补充说明

关于上文中提到的 bird 代理中间件, 可参考 [bird 使用文档](https://github.com/AngusYang9/bird-proxy-middleware) 。

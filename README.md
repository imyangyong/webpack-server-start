<h1 align="center" style="margin: 30px 0 35px;">Webpack Server Start</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/webpack-server-start"><img alt="npm" src="https://img.shields.io/npm/v/webpack-server-start"></a>
</p>

🐦 **webpack-based development && prodcution server**

# 安装

```bash
npm install webpack-server-start --save--dev
```

# 一、入口配置 entries

可设置多个 SPA 应用的模块入口

```javascript
// demo
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

# 二、webpack config

```javascript
module.exports = {
  // entry: '', here is useless, entry will be replace by 模块入口配置的entry
  output: {
    // for production
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',

    // for development
    publicPathForDevServer: '/dev/',
    // ...
  },
  // ...
}
```

# 开发服务器启动

```javascript
var webpackConfig = require('./webpack.config.js');
var entries = require('./entries.js');
var devServer = require('webpack-server-start').devServer;

/**
 * @param {Object} webpackConfig Webpack config.
 * @param {Object} entries 入口配置.
 * @param {Number} port 服务器监听的端口号.
 * @param {String} birdPath Bird代理中间件，文件路径.
 */
devServer(webpackConfig, entries, 5678);
```

# 生产环境服务器启动

```javascript
var webpackConfig = require('./webpack.config.js');
var entries = require('./entries.js');
var prodServer = require('webpack-server-start').prodServer;

/**
 * @param {Object} webpackConfig Webpack config.
 * @param {Object} entry 入口配置, 注意⚠️这里应用需要打包的入口模块.
 * @param {Number} port 服务器监听的端口号.
 * @param {String} birdPath Bird代理中间件，文件路径.
 */
prodServer(webpackConfig, entries['index'], 8110);
```

# 补充说明

关于上文中提到的 bird 代理中间件, 可参考 [bird 使用文档](https://github.com/AngusYang9/bird-proxy-middleware) 。

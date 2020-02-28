var devServer = require('./server.dev');
var prodServer = require('./server.prod');
var build = require('./build');

module.exports = {
  devServer,
  prodServer,
  build
}

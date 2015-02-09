var _ = require('lodash');
var plugins = require('./plugins/plugins');

function Neo() {
  var _neo = this;
  console.log('new neo');

  /*
  * Bind methods
  * */
  //_neo.util = _.bind(_neo.util, _neo);

   /*
   * Private
   * */
  _neo._plugins = [];
  _neo._app = {};
  _neo._pods = [];
  _neo._global = {};

  /*
  * Public
  * */
  _neo.appPath = process.cwd();
  //_neo.config = require('./config/config')(_neo);

  var plugins = require('./plugins/plugins')(_neo);

  plugins.load();

}

Neo.prototype.util = require('./util/util');

Neo.prototype.jackIn = require('./server/jackin');


module.exports = Neo;

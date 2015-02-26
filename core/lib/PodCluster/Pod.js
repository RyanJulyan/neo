/**
 * Created by Gloo on 2015-02-24.
 */
'use strict';

function Pod(options) {
  var _this = this;
  options = options || {};

  _this.name = options.name;
  _this.base = options.base;
  _this.webpack = options.webpack;
  _this.isRoot = options.isRoot;

  /*
   _this.RouteComponent = options.Routes;
   _this.stores = options.stores;
   */

}

module.exports = Pod;

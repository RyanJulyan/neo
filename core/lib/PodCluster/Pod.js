/**
 * Created by Gloo on 2015-02-24.
 */
'use strict';

var _ = require('highland');

function Pod(options) {
  var _this = this;
  options = options || {};
  _this = _this || {};

  _.extend(options, _this);

}

module.exports = Pod;

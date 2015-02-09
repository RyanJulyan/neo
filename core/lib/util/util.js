var $_ = require('highland');
var _ = require('lodash');
var nodePath = require('path');

/*
* Isomorphic utils
* */
_.extend(module.exports, $_);
_.extend(module.exports, _);

/*
* Node utils
* */
_.extend(module.exports, nodePath);


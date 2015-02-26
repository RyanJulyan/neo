/**
 * Created by Gloo on 2015-02-24.
 */
var express = require('express');
var bootable = require('bootable');

var server = bootable(express());

server.phase(require('../phases/init-neo'));
server.phase(require('../phases/init-pods'));

server.boot(function(err) {
  if (err) { throw err; }
  server.listen(3000);
});

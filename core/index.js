var linkPackage = require("link-package");
linkPackage();

var Neo = require('./lib/core');

module.exports = new Neo();

module.exports.Neo = Neo;

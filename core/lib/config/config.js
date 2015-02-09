'use strict';

var config = function (neo) {
  console.log(neo);
var _defaultConfig = {
    pods: {
      root: 'anderson',
      active: []
    },
    client: {
      bundle: {
        js: {
          entry: 'client.js',
          folder: 'scripts',
          file: '',
          common: 'common.js'
        },
        css: {
          entry: '',
          folder: 'styles',
          file: ''
        },
        assets: {
          prefix: '../',
          images: {
            folder: 'images',
            prefix: 'images/'
          },
          fonts: {
            folder: 'fonts'
          }
        }
      }
    },
    server: {
      port: 3000
    },
    webpack: require('./webpack')
  };
  var _config = neo.util._.merge(_defaultConfig, {});

  return _config;
};

module.exports = config;

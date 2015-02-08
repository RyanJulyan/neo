'use strict';

var linkPackage = require("link-package");

var arc = (function () {

  linkPackage();
// or if you want to link a subfolder
  linkPackage("arc");

  return {
    environment: {
      root: process.env.PWD
    },
    pods: {
      root: 'anderson'
    },
    root: {
      src: './src',
      build: './build',
      dist: './dist'
    },
    bundle: {
      js: {
        entry: 'client.js',
        folder: 'scripts',
        file: '',
        common: 'common.js'
      },
      css: {
        entry: './src/routes',
        folder: 'styles',
        file: ''
      },
      assets: {
        prefix: '../',
        images: {
          folder: 'images',
          prefix: 'images/',
          manifest: './src/routes/manifest.handlebars.images.json'
        },
        fonts: {
          folder: 'fonts'
        }
      },
      vendor: {
        js: {
          folder: 'scripts',
          file: 'vendors.js'
        },
        css: {
          folder: 'styles',
          file: 'vendors.css'
        }
      }
    },
    browserSync: {
      port: 3000,
      index: 'propertylayout.html'
    }
  }
})();

module.exports = arc;

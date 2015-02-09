'use strict';

/*var gulp = require('gulp');
require('./gulp/gulpfile');*/

module.exports = function jackIn(configOverride, cb) {
  var neo = this;
  console.log('jack in dir', __dirname);
  console.log('jack in', neo);
/*  console.log('jack in gulp tasks', gulp.tasks);
  if (gulp.tasks) {
    gulp.start('default');
  }*/
  cb();

};

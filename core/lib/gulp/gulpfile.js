/**
 * Created by Gloo on 2015-02-08.
 */
var gulp = require('gulp');
var tap = require('gulp-tap');
var _ = require('lodash');



gulp.task('default', function(){
  console.log('gulp');
  return gulp.src('./')
  .pipe(tap(function(file){
      console.log(file);
    }))
});



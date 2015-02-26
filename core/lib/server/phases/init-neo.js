/**
 * Created by Gloo on 2015-02-24.
 */
var Neo = require('../../core');

module.exports = function(next){
  console.log('neo');
  var neo = new Neo();
  //neo.jackIn();
  next(neo);
};

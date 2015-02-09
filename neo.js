'use strict';

(function () {
  var neo;
  try {
    neo = require('./core');
  } catch (e) {
    console.error('error finding neo', e);
  }

  neo.jackIn({},function(){
    console.log('jacked');

  });

})();

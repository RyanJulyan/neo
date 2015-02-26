var Neo = require('./lib/Neo/Neo');

module.exports = (function () {

  var globalNeo = new Neo();

  globalNeo.jackIn();

})();

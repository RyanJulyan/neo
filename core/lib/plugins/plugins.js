/**
 * Created by Gloo on 2015-02-09.
 */

module.exports = function (neo) {
  return {
    load: function () {
      var pluginFolder = neo.util.resolve(neo.appPath, 'global/plugins');
      console.log(pluginFolder);

      /*      var plugins = require('include-all')({
       dirname: pluginFolder,
       filter: /(.+)\.js$/,
       excludeDirs: /^\.(git|svn)$/,
       filterPath: /(.+)\/(.+).js$/,
       optional: true
       })
       ;

       console.log(plugins);*/

    }
  }
}
;

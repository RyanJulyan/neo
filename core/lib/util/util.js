var dir = require('node-dir');
var _ = require('highland');
var nodepath = require('path');

module.exports = {
  getTopFolderList: function (base, cb) {
    var topFolders = [];
    var current = '';
    base = nodepath.resolve(base);
    console.log(base);
    dir.subdirs(base, function (err, subdirs) {
      if (err) throw err;
      _(subdirs)
        .each(function (folder) {
          current = folder;
          current = current.replace(base, '');
          current = current.replace( /^\\/, '' );
          if (current.indexOf('\\') == -1 && current.indexOf('/') == -1) {
            topFolders.push(current);
}
});

cb(topFolders);
});
}
};

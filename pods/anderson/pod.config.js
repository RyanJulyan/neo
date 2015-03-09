/**
 * Created by Gloo on 2015-02-09.
 */
'use strict';

module.exports = {
  isRoot: true,
  name: 'anderson',
  base: '/anderson',
  webpack: {
    entry: './pods/anderson/generated/client.js',
    output: {
      path: './pods/anderson/public/',
      publicPath: '/public/',
      filename: '[name].js',
      chunkFilename: '[id].js'
    }
  }
};

/**
 * Created by Gloo on 2015-02-09.
 */
'use strict';

module.exports = {
  isRoot: true,
  name: 'anderson',
  base: '/',
  webpack: {
    entry: './client.js',
    output: {
      path: './public/',
      publicPath: '/public/',
      filename: '[name].js',
      chunkFilename: '[id].js'
    }
  }
};

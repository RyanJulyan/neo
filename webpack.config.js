'use strict';

var arc = require('./core/arc/arc.config');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack = require('webpack');

var stylePlugin = new ExtractTextPlugin(arc.bundle.css.folder + '/[name].css', {
  allChunks: true
});

var rootCore = './core';
var rootPod = './pods/' + arc.pods.root;

var config = {

  entry: rootCore + '/client/client',
  output: {
    path: rootPod + '/public',
    filename: arc.bundle.js.folder + '/[name].js',
    publicPath: arc.bundle.assets.prefix,
    chunkFilename: '[id].js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      /*
      * Load JSX
      * */
      { test: /\.jsx$/, loader: 'jsx-loader' },
      /*
       * Extract css files
       * */
      {
        test: /\.less$/,
        loader: stylePlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-woff',
          limit: '1000',
          name: arc.bundle.assets.fonts.folder + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-ttf',
          limit: '1000',
          name: arc.bundle.assets.fonts.folder + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.otf$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-otf',
          limit: '1000',
          name: arc.bundle.assets.fonts.folder + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-eot',
          limit: '1000',
          name: arc.bundle.assets.fonts.folder + '/[name]-[hash].[ext]'
        }
      },
      /*
       * SVG? font or image?
       * */
      {
        test: /\.svg$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/svg',
          limit: '1000',
          name: arc.bundle.assets.fonts.folder + '/[name]-[hash].[ext]'
        }
      },
      /*
       * Extract Images files
       * */
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: '1000',
          name: arc.bundle.assets.images.folder + '/[name]-[hash].[ext]'
        }
      }
      // You could also use other loaders the same way. I. e. the autoprefixer-loader
    ]
  },
  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
    stylePlugin,
    new webpack.optimize.CommonsChunkPlugin("common", 'common.js')
  ]
};


module.exports = config;

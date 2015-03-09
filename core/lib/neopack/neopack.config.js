  /**
 * Created by Gloo on 2015-03-03.
 */
'use strict';

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack = require('webpack');

var stylePlugin = new ExtractTextPlugin('[name].css', {
  allChunks: true
});

var config = {

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      /*
       * Load JSX
       * */
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
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
          name: '[name]-[hash].[ext]'
        }
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-ttf',
          limit: '1000',
          name: '[name]-[hash].[ext]'
        }
      },
      {
        test: /\.otf$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-otf',
          limit: '1000',
          name: '[name]-[hash].[ext]'
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-eot',
          limit: '1000',
          name: '[name]-[hash].[ext]'
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
          name: '[name]-[hash].[ext]'
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
          name: '[name]-[hash].[ext]'
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

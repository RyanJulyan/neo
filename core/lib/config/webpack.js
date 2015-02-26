'use strict';
//for now
var buildPath = './public';
//webpack
var webpack = require('webpack');
//webpack plugins
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
//instantiate style plugin instance
var stylePlugin = new ExtractTextPlugin('./css/[name].css', {
  allChunks: true
});

module.exports = {
  entry: './client.js',
  output: {
    path: './public/',
    publicPath: '/public/',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx'],
    alias: {
    }
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'jsx-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      /*
       * Extract css files
       * */
      {
        test: /\.less$/,
        loader: stylePlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(woff|woff2)($|\?)/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-woff',
          limit: '1000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.ttf($|\?)/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-ttf',
          limit: '1000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.eot($|\?)/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-eot',
          limit: '1000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.otf($|\?)/,
        loader: 'url-loader',
        query: {
          mimetype: 'application/font-otf',
          limit: '1000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      },
      /*
       * SVG? font or image?
       * */
      {
        test: /\.svg($|\?)/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/svg+xml',
          limit: '8000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      },
      /*
       * Extract Images files
       * */
      {
        test: /\.(png|jpg|gif)($|\?)/,
        loader: 'url-loader',
        query: {
          limit: '1000',
          name: buildPath + '/[name]-[hash].[ext]'
        }
      }
      // You could also use other loaders the same way. I. e. the autoprefixer-loader
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  watch: true,
  keepalive: true,

  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ]),
    stylePlugin,
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new BowerWebpackPlugin({
      modulesDirectories: ['bower_components'],
      manifestFiles: 'bower.json',
      excludes: /.*\.(less|css)/
    })/*,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      bootstrap: 'bootstrap'

    })*/
  ]
}
;



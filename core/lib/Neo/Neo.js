/*
 * Register JSX
 * */
require('node-jsx').install({extension: '.jsx'});

/*
 * Utils
 * */
//var _ = require('lodash');
var _ = require('highland');
var nodepath = require('path');
var loader = require('node-glob-loader');

var Sequence = exports.Sequence || require('sequence').Sequence;

/*
 * Fluxible
 * */
var React = require('react');
var Fluxible = require('fluxible');
var StoreMixin = require('fluxible').StoreMixin;
var RouteHandler = require('react-router').RouteHandler;

/*
 * Neo Core
 * */
var Routes = require('../Routes/Routes.jsx');
var Application = require('../App/App.jsx');
var PodCluster = require('../PodCluster/PodCluster');
var Pod = require('../PodCluster/Pod');

function Neo() {
  var _neo = this;
  console.log('new neo');

  /*
   * Private
   * */
  _neo._app = {};
  _neo._server = {};
  _neo._podCluster = {};
  _neo._pluginChain = {};
  _neo._global = {};

  /*
   * Public
   * */
  _neo.appPath = nodepath.resolve(process.cwd());

  _neo.podConfigs = [];
  _neo.routes = [];
  _neo.stores = [];

  _neo.App = {};

  _neo.util = require('../util/util');


}

Neo.prototype._init = function (_neo, next) {

  var podConfigsPath = _neo.appPath + '/pods/**/pod.config.js';
  var routesPath = _neo.appPath + '/pods/**/**/*Routes.jsx';
  var storesPath = _neo.appPath + '/pods/**/**/*Store.js';

  var sequence = Sequence.create();
  sequence
    /*
    * Collect pod names from project
    * */
    .then(function (next) {
     _neo.util.getTopFolderList(_neo.appPath + '/pods/', function (folders) {
     console.log(folders);
     next();
     });
     })
    /*
     * load and extend pod configs
     * */
    .then(function (next) {
      var configs = [];
      loader.load(podConfigsPath, function (config) {
        configs.push(config);
      })
        .then(function () {
          console.log(1);
          next(null, configs);
        });
    })
    /*
     * load pod stores
     * */
    .then(function (next, err, configs) {
      var stores = [];
      loader.load(storesPath, function (store) {
        stores.push(store);
      })
        .then(function () {
          console.log(2);
          next(null, configs, stores);
        });
    })
    /*
     * load pod routes
     * */
    .then(function (next, err, configs, stores) {
      var routes = [];
      loader.load(routesPath, function (route) {
        routes.push(route)
      })
        .then(function () {
          console.log(3);
          next(null, configs, stores, routes);
        })
    })
    /*
     * Init Neo app
     * */
    .then(function (next, err, configs, stores, routes) {

      _neo.podConfigs = configs;
      _neo.routes = routes;
      _neo.stores = stores;

      _neo.App = new Fluxible({
        appComponent: Routes(_neo.routes, Application)
      });

      _(stores)
        .each(function (store) {
          _neo.App.registerStore(store);
        });

      _neo._podCluster = new PodCluster();
      var pod = {};

      _(_neo.podConfigs)
        .each(function (config) {
          _neo._podCluster.registerPod(new Pod(
            config
          ))
        });


      console.log(4);
      console.log('neo', _neo);

      next();
    })
  ;

  next();

};


Neo.prototype.jackIn = function () {
  var _neo = this;
  console.log(_neo);
  var sequence = Sequence.create();
  sequence
    .then(function (next) {
      _neo._init(_neo,next)
    })

};

module.exports = Neo;

/*
 * Register JSX
 * */
require('node-jsx').install({extension: '.jsx'});

/*
 * Utils
 * */
var _ = require('highland');
var nodepath = require('path');
var loader = require('node-glob-loader');
var Sequence = exports.Sequence || require('sequence').Sequence;

/*
 * Fluxible
 * */
var React = require('react');
var Fluxible = require('fluxible');

/*
 * Neo Core
 * */
//Components
var Routes = require('../Routes/Routes.jsx');
var Application = require('../app/App.jsx');
var ApplicationStore = require('../app/AppStore');

//Classes
var PodCluster = require('../PodCluster/PodCluster');
var Pod = require('../PodCluster/Pod');
var Server = require('../server/Server');

//Utils
var gulpack = require('gulp-webpack');
var webpack = require('webpack');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

var Neo = module.exports = function Neo() {
  var _neo = this;
  console.log('new neo');

  /*
   * Public
   * */
  _neo.appPath = nodepath.resolve(process.cwd());
  _neo.util = require('../util/util');

  _neo.App = {};
  _neo.PodCluster = new PodCluster();

  _neo.routes = [];
  _neo.stores = [];

  _neo.Server = {};

};

Neo.prototype._init = function (_neo, next) {
  /*
   * Sequence instances
   * */
  var initSequence = Sequence.create();
  var podSequence = Sequence.create();
  var appSequence = Sequence.create();
  /*
   * Load paths
   * */
  var podConfigsPath = _neo.appPath + '/pods/{folder}/**/pod.config.js';
  var routesPath = _neo.appPath + '/pods/{folder}/**/*Routes.jsx';
  var storesPath = _neo.appPath + '/pods/{folder}/**/*Store.js';
  var podPath = _neo.appPath + '/pods/{folder}/**/*Pod.jsx';
  var indexPath = _neo.appPath + '/pods/{folder}/**/Index.jsx';
  /*
   * current variables
   * */
  var currPath = '';
  var currPod = {};
  var currPodOptions = {};
  /*
   * Help method for running async methods in loops in sequences
   * */
  var seqNext = function (index, length, next) {
    if (index === length) {
      next();
    }
  };

  var podIndex = 0;

  initSequence
    /*
     * load project pods
     * */
    .then(function (mainNext) {
      _neo.util.getTopFolderList(_neo.appPath + '/pods/', function (folders) {
        console.log(folders);

        _(folders)
          .each(function (folder) {

            podSequence
              /*
               * load and extend pod configs
               * */
              .then(function (next) {
                var configs = {};
                currPath = podConfigsPath.replace('{folder}', folder);
                loader.load(currPath, function (config) {
                  configs = config;
                })
                  .then(function () {
                    console.log('current folder', folder);
                    console.log(1);

                    next(null, configs);
                  });
              })
              /*
               * load pod routes
               * */
              .then(function (next, err, configs) {
                var routes = [];
                currPath = routesPath.replace('{folder}', folder);
                loader.load(currPath, function (route) {
                  routes.push(route)
                })
                  .then(function () {
                    console.log(2);
                    next(null, configs, routes);
                  })
              })
              /*
               * load pod stores
               * */
              .then(function (next, err, configs, routes) {
                var stores = [];
                currPath = storesPath.replace('{folder}', folder);
                loader.load(currPath, function (store) {
                  stores.push(store);
                })
                  .then(function () {
                    console.log(3);
                    next(null, configs, routes, stores);
                  });
              })
              /*
               * load pod index component
               * */
              .then(function (next, err, configs, routes, stores) {
                var index = {};
                currPath = indexPath.replace('{folder}', folder);
                loader.load(currPath, function (indexComponent) {
                  index = indexComponent;

                })
                  .then(function () {
                    console.log(4);
                    next(null, configs, routes, stores, index);
                  });
              })
              /*
               * load Pod component
               * */
              .then(function (next, err, configs, routes, stores, index) {
                var pod = {};
                currPath = podPath.replace('{folder}', folder);
                loader.load(currPath, function (podComponent) {
                  pod = podComponent;
                })
                  .then(function () {
                    console.log(5);
                    next(null, configs, routes, stores, index, pod);
                  });
              })
              /*
               * Init Neo Pod
               * */
              .then(function (next, err, configs, routes, stores, index, pod) {
                currPodOptions = configs;
                currPodOptions.routes = routes;
                currPodOptions.stores = stores;
                currPodOptions.indexComponent = index;
                currPodOptions.podComponent = pod;

                currPod = new Pod(currPodOptions);

                _neo.PodCluster.registerPod(currPod);

                podIndex++;
                seqNext(podIndex, folders.length, mainNext);
                next();
              })
            ;
          })
        ;

      });

    })
    /*
     * init app
     * */
    .then(function (mainNext) {
      appSequence
        /*
         * Collect routes and stores from pods for init
         * */
        .then(function (next) {
          podIndex = 0;
          var cluster = _neo.PodCluster.getCluster();
          _(cluster)
            .each(function (pod) {
              //console.log(pod);
              _(_neo.routes).concat(pod.routes).toArray(function (routes) {
                _neo.routes = routes;
                //console.log('routes',_neo.routes);

                _(_neo.stores).concat(pod.stores).toArray(function (stores) {
                  _neo.stores = stores;
                  //console.log('stores',_neo.stores);
                  podIndex++;
                  seqNext(podIndex, cluster.length, next);
                });

              });

            });
        })
        /*
         * new instance of app
         * */
        .then(function (next) {
          console.log('app routes', _neo.routes);

          _neo.App = new Fluxible({
            appComponent: Routes(_neo.routes, Application)
          });

          _neo.App.registerStore(ApplicationStore);

          _(_neo.stores)
            .each(function (store) {
              _neo.App.registerStore(store);
            });

          next();
        })
        /*
         * Neopack
         * */
        .then(function (next) {
          var baseConfig = require('../neopack/neopack.config.js');
          var devConfig = Object.create(baseConfig);

          console.log(require('../client/client',{app: _neo.App, navigateAction: require('../app/AppAction')} ));

          _(_neo.PodCluster.getCluster())
            //.pipe(source())
            .pipe(gulpack(devConfig, webpack, function (err, stats) {
              /* Use stats to do more things if needed */
              if (err) throw new gutil.PluginError("webpack:dev", err);
              gutil.log("[webpack:dev]", stats.toString({
                colors: true
              }));
              callback();
            }))
            .pipe(gulp.dest('../../../pods/anderson/public/app.js'))
            .pipe(function () {
              console.log('end stream');
              next()
            });

        })
      ;
      /*
       * next main sequence
       * */
      console.log(_neo);
      mainNext();
      next();
    })
  ;


}
;

Neo.prototype.jackIn = function () {
  var _neo = this;
  //console.log(_neo);
  var sequence = Sequence.create();
  sequence
    .then(function (next) {
      _neo._init(_neo, next)
    })

    .then(function (next) {
      var action = require('../app/actions/navigate');
      _neo.Server = new Server(_neo, action);
      _neo.Server.boot(next);
    });

};

Neo.extend = require('class-extend').extend;

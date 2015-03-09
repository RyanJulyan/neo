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
var gulp = require('gulp');
var tap = require('gulp-tap');

var template = require('gulp-template');
var rename = require('gulp-rename');

var gulpack = require('gulp-webpack');
var webpack = require('webpack');

var gutil = require('gulp-util');

var vfsFake = require('vinyl-fs-fake');
var source = require('vinyl-source-stream');
var File = require('vinyl');
var fs = require('vinyl-fs');
var gulpfile = require('gulp-file');

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

  _neo.paths = {};

  _neo.routes = [];
  _neo.paths.routes = [];

  _neo.stores = [];
  _neo.paths.stores = [];

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
  var options = {};

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
                options.configs = {};
                currPath = podConfigsPath.replace('{folder}', folder);
                loader.load(currPath, function (config) {
                  options.configs = config;
                })
                  .then(function () {
                    console.log('current folder', folder);
                    console.log(1);

                    next(null, options);
                  });
              })
              /*
               * load pod routes
               * */
              .then(function (next, err, options) {
                options.routes = [];
                currPath = routesPath.replace('{folder}', folder);
                loader.load(currPath, function (route, routePath) {
                  options.routes.push(route);
                  _neo.paths.routes.push(routePath);
                })
                  .then(function () {
                    console.log(2);
                    next(null, options);
                  })
              })
              /*
               * load pod stores
               * */
              .then(function (next, err, options) {
                options.stores = [];
                currPath = storesPath.replace('{folder}', folder);
                loader.load(currPath, function (store, storePath) {
                  options.stores.push(store);
                  _neo.paths.stores.push(storePath);
                })
                  .then(function () {
                    console.log(3);
                    next(null, options);
                  });
              })
              /*
               * load pod index component
               * */
              .then(function (next, err, options) {
                options.index = {};
                currPath = indexPath.replace('{folder}', folder);
                loader.load(currPath, function (indexComponent) {
                  options.index = indexComponent;

                })
                  .then(function () {
                    console.log(4);
                    next(null, options);
                  });
              })
              /*
               * load Pod component
               * */
              .then(function (next, err, options) {
                options.pod = {};
                currPath = podPath.replace('{folder}', folder);
                loader.load(currPath, function (podComponent) {
                  options.pod = podComponent;
                })
                  .then(function () {
                    console.log(5);
                    next(null, options);
                  });
              })
              /*
               * Init Neo Pod
               * */
              .then(function (next, err, options) {

                currPodOptions = options.configs;
                currPodOptions.routes = options.routes;
                currPodOptions.stores = options.stores;
                currPodOptions.indexComponent = options.index;
                currPodOptions.podComponent = options.pod;
                try {
                  currPod = new Pod(currPodOptions);

                  _neo.PodCluster.registerPod(currPod);
                } catch (e) {
                  console.log('error:', e);
                }

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
         *
         * WE NEED A BETTER SOLUTION
         *
         * Generate Route.jsx file for webpack
         * */
        .then(function (next) {

          gulp.src('./core/lib/Routes/templates/Routes.txt')
            .pipe(tap(function (file) {
              console.log(file.path)
            }))
            .pipe(template(_neo.paths))
            .pipe(rename('Routes.jsx'))
            .pipe(gulp.dest('./generated/'))
            .on('finish',function(e){
              gutil.log('gulp finished');
              next();
            })
          ;

        })
      /*
       * Generate app.js file for webpack
       * */
        .then(function (next) {

          gulp.src('./core/lib/app/templates/app.txt')
            .pipe(tap(function (file) {
              console.log(file.path)
            }))
            .pipe(template(_neo.paths))
            .pipe(rename('app.js'))
            .pipe(gulp.dest('./generated/'))
            .on('finish',function(e){
              gutil.log('gulp finished');
              next();
            })
          ;

        })
        /*
         * Generate client.js file per pod for webpack
         * */
        .then(function (next) {

          gulp.src('./core/lib/client/templates/client.txt')
            .pipe(tap(function (file) {
              console.log(file.path)
            }))
            .pipe(template(_neo.paths))
            .pipe(rename('client.js'))
            .pipe(gulp.dest('./pods/anderson/generated/'))
            .on('finish',function(e){
              gutil.log('gulp finished');
              next();
            })
          ;

        })
        .then(function (next) {

          var baseConfig = require('../neopack/neopack.config.js');
          var pod = _neo.PodCluster.getPod('anderson');
          baseConfig = _.extend(pod.webpack,baseConfig);
          console.log(baseConfig);

          var devConfig = Object.create(baseConfig);

          webpack(devConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack:dev", err);
            gutil.log("[webpack:dev]", stats.toString({
              colors: true
            }));
            next();
          });

          //gulp.src('./pods/anderson/generated/client.js')
          //.pipe(gulpack(devConfig, webpack, function(){
          //
          //  }))


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

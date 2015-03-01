/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
require('node-jsx').install({extension: '.jsx'});
/*
 * React
 * */
var React = require('react');
var Router = require('react-router');

/*
 * Server
 * */
var express = require('express');
var expressState = require('express-state');
var favicon = require('serve-favicon');

/*
 * Util
 * */
var debug = require('debug')('Example');
var _ = require('highland');

var Server = function (neo, navigateAction) {
  var _this = this;
  _this._neo = neo;
  _this._server = express();
  expressState.extend(_this._server);

  _this._server.set('state namespace', 'App');

  //_this._server.use(favicon(__dirname + '/../favicon.ico'));

  _(_this._neo.PodCluster.getCluster()).each(function (pod) {
    console.log('register static', _this._neo.appPath + '/' + pod.name + '/public');
    _this._server.use('/' + pod.name + '/public', express.static(_this._neo.appPath + '/pods/' + pod.name + '/public'));
  });

  _this._server.use(function (req, res, next) {
    console.log('here', req.path);
    if (req.path.indexOf('/public/') > -1) {
      console.log();
      next();
    } else {
      /*
       * find pod instance by path
       * */
      var podName = req.path.replace('/', '');
      podName = podName.substr(0, podName.indexOf('/'));
      console.log('podname', podName);
      var pod = _this._neo.PodCluster.getPod(podName, true);
      console.log('pod', pod);
      var HtmlComponent = React.createFactory(pod.indexComponent);
      /*
       * App instance
       * */
      var app = _this._neo.App;
      console.log('route app', HtmlComponent);

      var context = app.createContext();

      debug('Executing navigate action');

      /*
       * Run router
       * */
      Router.run(app.getAppComponent(), req.path, function (Handler, state) {
        /*
         * Execute Nav action
         * */
        context.executeAction(navigateAction, state, function () {
          debug('Exposing context state');
          //expose state to browser
          res.expose(app.dehydrate(context), 'App');
          debug('Rendering Application component into html');

          /*
           * Render app
           * */
          var html = React.renderToStaticMarkup(HtmlComponent({
            state: res.locals.state,
            markup: React.renderToString(Handler({
              context: context.getComponentContext()
            }))
          }));

          console.log('route html', html);

          debug('Sending markup');
          res.write(html);
          res.end();
        });
      });
    }
  });

  _this.port = process.env.PORT || 3000;

};

Server.prototype.boot = function (cb) {
  this._server.listen(this.port);
  console.log('Listening on port ' + this.port);
  cb();
};

Server.prototype.getServer = function () {
  return this._server;
};

module.exports = Server;


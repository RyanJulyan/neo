'use strict';

/**
 * This leverages Express to create and run the http server.
 * A fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

/*
 * Install JSX extension
 * */
require('node-jsx').install({extension: '.jsx'});

/*
 * Server & Utils
 * */
var express = require('express');
var debug = require('debug')('neo');
var serialize = require('serialize-javascript');

/*
 * React & Fluxible
 * */
var React = require('react');
var navigateAction = require('flux-router-component').navigateAction;

/*
 * Neo
 * */
var arc = require('../arc/arc.config');
var rootGlobal = arc.environment.root + '/global';
var rootPod = arc.environment.root + '/pods/' + arc.pods.root;
var app = require('../app/app');
var htmlComponent = React.createFactory(require(rootGlobal + '/Index.jsx'));

/*
 * Server
 * */
var server = express();
server.set('state namespace', 'App');
server.use('/public', express.static(rootPod + '/public'));
/*
* Context middleware
* */
server.use(function (req, res, next) {

  var context = app.createContext();

  debug('Executing navigate action');

  context.getActionContext().executeAction(navigateAction, {
    url: req.url
  }, function (err) {
    if (err) {
      if (err.status && err.status === 404) {
        next();
      } else {
        next(err);
      }
      return;
    }

    debug('Exposing context state');
    var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    debug('Rendering Application component into html');
    var appComponent = app.getAppComponent();
    React.withContext(context.getComponentContext(), function () {
      var html = React.renderToStaticMarkup(htmlComponent({
        state: exposed,
        markup: React.renderToString(appComponent())
      }));

      debug('Sending markup');
      res.write('<!DOCTYPE html>' + html);
      res.end();
    });
  });

});

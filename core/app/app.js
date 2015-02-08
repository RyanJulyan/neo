'use strict';

/*
 * React & Fluxible
 * */
var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');

/*
* Neo
* */
var arc = require('../arc/arc.config');
var rootGlobal = arc.environment.root + '/global';
var rootPod = arc.environment.root + '/pods/' + arc.pods.root;

// create new fluxible instance
var app = new Fluxible({
  appComponent: React.createFactory(require(rootGlobal + '/components/App/App.jsx'))
});

// add routes to the routr plugin
app.plug(routrPlugin({
  routes: require(rootPod+'/routes')
}));

// register stores
app.registerStore(require(rootGlobal + '/components/App/AppStore'));

module.exports = app;

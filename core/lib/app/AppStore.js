/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var createStore = require('fluxible/utils/createStore');

var ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE': 'handleNavigate'
  },
  initialize: function (dispatcher) {
    this.pageTitle = '';
    this.currentRoute = null;
  },
  handleNavigate: function (route) {
    if (this.currentRoute && route.path === this.currentRoute.path) {
      return;
    }
    this.pageTitle = route.path;
    this.currentRoute = route;
    this.emitChange();
  },
  getPageTitle: function () {
    return this.pageTitle;
  },
  getState: function () {
    return {
      route: this.currentRoute,
      pageTitle: this.pageTitle
    };
  },
  dehydrate: function () {
    return this.getState();
  },
  rehydrate: function (state) {
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle
  }
});


module.exports = ApplicationStore;

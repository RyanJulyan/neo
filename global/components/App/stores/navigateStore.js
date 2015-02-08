'use strict';

/*
 * Fluxible
 * */
var createStore = require('fluxible/utils/createStore');

/*
 * Neo
 * */
var arc = require(process.env.PWD + '/core/arc/arc.config');
var rootGlobal = arc.environment.root + '/global';
var rootPod = arc.environment.root + '/pods/' + arc.pods.root;

//routes
var routesConfig = require(rootPod+'/routes');

var ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE_SUCCESS': 'handleNavigate'
  },
  initialize: function () {
    this.currentPageName = null;
    this.currentPage = null;
    this.currentRoute = null;
    this.pages = routesConfig;
    this.pageTitle = '';
  },
  handleNavigate: function (route) {
    if (this.currentRoute && (this.currentRoute.url === route.url)) {
      return;
    }

    var pageName = route.config.page;
    var page = this.pages[pageName];

    this.currentPageName = pageName;
    this.currentPage = page;
    this.currentRoute = route;
    this.emitChange();
  },
  getCurrentPageName: function () {
    return this.currentPageName;
  },
  getPageTitle: function () {
    return this.pageTitle;
  },
  getCurrentRoute: function () {
    return this.currentRoute;
  },
  getPages: function () {
    return this.pages;
  },
  dehydrate: function () {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      route: this.currentRoute,
      pageTitle: this.pageTitle
    };
  },
  rehydrate: function (state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle;
  }
});

module.exports = ApplicationStore;

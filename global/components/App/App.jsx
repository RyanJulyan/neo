'use strict';

/*
 * React & Fluxible
 * */
var React = require('react');
var RouterMixin = require('flux-router-component').RouterMixin;
var FluxibleMixin = require('fluxible').Mixin;

/*
 * Neo
 * */
var arc = require('../arc/arc.config');
var rootPod = arc.environment.root + '/pods/' + arc.pods.root;

//Store entry
var ApplicationStore = require('./AppStore');

//components
var Nav = require(rootPod + '/components/Nav.jsx');

//controller views
var Home = require(rootPod + '/views/Home/Home.jsx');
var Stories = require(rootPod + '/views/Stories/Stories.jsx');

var Application = React.createClass({
  mixins: [RouterMixin, FluxibleMixin],
  statics: {
    storeListeners: [ApplicationStore]
  },
  getInitialState: function () {
    return this.getState();
  },
  getState: function () {
    var appStore = this.getStore(ApplicationStore);
    return {
      currentPageName: appStore.getCurrentPageName(),
      pageTitle: appStore.getPageTitle(),
      route: appStore.getCurrentRoute(),
      pages: appStore.getPages()
    };
  },
  onChange: function () {
    this.setState(this.getState());
  },
  render: function () {
    var output = '';
    switch (this.state.currentPageName) {
      case 'home':
        output = <Home/>;
        break;
      case 'stories':
        output = <Stories/>;
        break;
    }
    return (
      <div>
        <Nav selected={this.state.currentPageName} links={this.state.pages} />
        {output}
      </div>
    );
  },

  componentDidUpdate: function (prevProps, prevState) {
    var newState = this.state;
    if (newState.pageTitle === prevState.pageTitle) {
      return;
    }
    document.title = newState.pageTitle;
  }
});

module.exports = Application;

'use strict';

var React = require('react');

var ApplicationStore = require('./AppStore');

var FluxibleMixin = require('fluxible').Mixin;
var RouteHandler = require('react-router').RouteHandler;

var Application = React.createClass({
  mixins: [FluxibleMixin],
  statics: {
    storeListeners: [ApplicationStore]
  },

  getInitialState: function () {
    return this.getStore(ApplicationStore).getState();
  },
  onChange: function () {
    var state = this.getStore(ApplicationStore).getState();
    this.setState(state);
  },
  render: function () {
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Application;

'use strict';

var React = require('react');

var RouteHandler = require('react-router').RouteHandler;
var FluxibleMixin = require('fluxible').Mixin;
var Nav = require('../components/Nav/Nav.jsx')

var Pod = React.createClass({
  mixins: [FluxibleMixin],
  getInitialState: function () {
    return {};
  },
  render: function () {
    return (
      <div>
        <Nav />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Pod;
